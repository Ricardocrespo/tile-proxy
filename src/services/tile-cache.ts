import * as fs from 'fs/promises';
import * as path from 'path';

export class TileCache {
    private readonly baseDir: string;

    constructor() {
    this.baseDir =
      process.env.NODE_ENV === 'test'
        ? path.join(__dirname, '../../test/cache/tiles')
        : path.join(__dirname, '../cache/tiles');
  }

  private getTilePath(z: string, x: string, y: string): string {
    return path.join(this.baseDir, `${z}`, `${x}`, `${y}.png`);
  }

  /**
   * This method retrieves a tile from the file system cache.
   * It constructs the file path based on the zoom level (z), x coordinate (x), and y coordinate (y).
   * If the tile exists, it reads the file and returns its contents as a Buffer.
   * 
   * @param {string} key - The tile key in the format "z/x/y".
   * @returns {Promise<Buffer | null>} - Returns a Promise that resolves to the tile image as a Buffer, or null if not found.
   */
  async get(key: string): Promise<Buffer | null> {
    try {
      const [z, x, y] = key.split('/');
      const tileDataBuffer = await fs.readFile(this.getTilePath(z, x, y));
      console.log(`${new Date().toISOString()} File system cache hit: ${key}`);
      return tileDataBuffer;
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            console.error(`${new Date().toISOString()} File system cache miss: ${key}`, err);
        } else {
            console.error(`${new Date().toISOString()} Error reading tile cache: ${err.message}`, err);
        }
      return null;
    }
  }

  /**
   * Stores a tile image in the file system cache. 
   * It constructs the file path based on the zoom level (z), x coordinate (x), and y coordinate (y).
   * If the directory structure does not exist, it creates the necessary directories.
   * 
   * @param key - The tile key in the format "z/x/y".
   * @param data - The tile image as a Buffer.
   */
  async set(key: string, data: Buffer): Promise<void> {
    const [z, x, y] = key.split('/');
    const filePath = this.getTilePath(z, x, y);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
  }
}
