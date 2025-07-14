import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { LRUCache as LRU } from 'lru-cache';

/* This service handles fetching and caching map tiles.
 * It uses an LRU cache for in-memory storage and a file system cache for persistent storage.
 */
class TileService {
  private static instance: TileService;
  private memoryCache: LRU<string, Buffer>;
  private inflight: Map<string, Promise<Buffer>>;
  private tileDir: string;

  private constructor() {
    this.tileDir = path.join(__dirname, '../cache/tiles');
    this.memoryCache = new LRU<string, Buffer>({
      max: 200, // Maximum number of tiles in memory
      ttl: 1000 * 60 * 10, // 10 minutes
    });
    this.inflight = new Map();
  }

  // Singleton instance getter
  public static getInstance(): TileService {
    if (!TileService.instance) {
      TileService.instance = new TileService();
    }
    return TileService.instance;
  }

  private getTileFilePath(z: string, x: string, y: string): string {
    return path.join(this.tileDir, `${z}`, `${x}`, `${y}.png`);
  }

  private async readFromDiskCache(tileKey: string, tilePath: string): Promise<Buffer | null> {
    try {
      const fileBuffer: Buffer = await fs.promises.readFile(tilePath);
      console.log(`${new Date().toISOString()} File system cache hit:`, tileKey);
      this.memoryCache.set(tileKey, fileBuffer); // Populate memory cache
      return fileBuffer;
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        console.error(`${new Date().toISOString()} File read error:`, err);
      } else {
        console.log(`${new Date().toISOString()} Cache miss:`, tileKey);
      }
      return null; // Explicitly return null on cache miss or error
    }
  }

  private async fetchAndCacheTile(z: string, x: string, y: string): Promise<Buffer> {
    const tilePath: string = this.getTileFilePath(z, x, y);
    const url: string = `https://api.maptiler.com/maps/basic/${z}/${x}/${y}.png?key=${process.env.MAP_API_KEY}`;

    console.log(`${new Date().toISOString()} Fetching:`, url);

    const response = await axios.get(url, { responseType: 'arraybuffer' });

    await fs.promises.mkdir(path.dirname(tilePath), { recursive: true });
    await fs.promises.writeFile(tilePath, response.data);

    return response.data;
  }

  
/* The `getTile` function retrieves a tile by its zoom level, x, and y coordinates.
  * If the tile is not found in the cache, it fetches it from the MapTiler API and caches it.
  * The service also handles concurrent requests for the same tile to avoid multiple fetches.

  * @param {string} z - Zoom level of the tile
  * @param {string} x - X coordinate of the tile
  * @param {string} y - Y coordinate of the tile
  * 
  * @return {Promise<Buffer>} - Returns a promise that resolves to the tile image data as a Buffer.
*/
  public async getTile(z: string, x: string, y: string): Promise<Buffer> {
    const tileKey: string = `${z}/${x}/${y}`;
    const tilePath: string = this.getTileFilePath(z, x, y);

    // Check memory cache
    const memHit = this.memoryCache.get(tileKey);
    if (memHit) {
      console.log(`${new Date().toISOString()} Memory cache hit:`, tileKey);
      return memHit;
    }

    // Check file system cache
    const diskHit = await this.readFromDiskCache(tileKey, tilePath);
    if (diskHit) return diskHit;

    // Handle concurrent in-flight requests
    if (!this.inflight.has(tileKey)) {
      this.inflight.set(tileKey, this.fetchAndCacheTile(z, x, y));
    }

    try {
      return await this.inflight.get(tileKey)!;
    } finally {
      this.inflight.delete(tileKey);
    }
  }
}

export default TileService.getInstance();