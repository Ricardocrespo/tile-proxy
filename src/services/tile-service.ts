import { MemoryCache } from './memory-cache';
import { TileCache } from './tile-cache'
import { TileClient } from '../client/tile-client';

export class TileService {
  private inflight = new Map<string, Promise<Buffer>>();

  constructor(
    private memCache: MemoryCache,
    private tileCache: TileCache,
    private tileClient: TileClient
  ) {}

  /**
   * Fetches a tile from memory cache, disk cache, or remote service.
   * @param {string} z Zoom level
   * @param {string} x X coordinate
   * @param {string} y Y coordinate
   * @returns Tile image as a Buffer
   */
  async getTile(z: string, x: string, y: string): Promise<Buffer> {
    const key = `${z}/${x}/${y}`;

    // Check memory cache first
    const fromMem = this.memCache.get(key);
    if (fromMem) return fromMem;

    // Check file cache
    const fromDisk = await this.tileCache.get(key);
    if (fromDisk) {
      this.memCache.set(key, fromDisk);
      return fromDisk;
    }

    // If not in cache, fetch from remote service
    // Use inflight map to prevent duplicate requests
    if (!this.inflight.has(key)) {
      this.inflight.set(
        key,
        this.tileClient.fetchTile(z, x, y).then(async (data) => {
          this.memCache.set(key, data);
          await this.tileCache.set(key, data);
          return data;
        })
      );
    }

    // Wait for the inflight request to complete
    // This ensures that we only resolve the promise once the tile is fetched
    // and stored in both memory and disk caches.
    try {
      return await this.inflight.get(key)!;
    } finally {
      this.inflight.delete(key);
    }
  }
}
