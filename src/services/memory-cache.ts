/**
 * This class implements a memory cache using LRU (Least Recently Used) strategy.
 * It stores tile images in memory for quick access, reducing the need to fetch from disk or remote services.
 */
import { LRUCache } from 'lru-cache';

export class MemoryCache {
  private cache = new LRUCache<string, Buffer>({ max: 200, ttl: 1000 * 60 * 10 });

/**
 * Retrieves a tile image from the memory cache.
 *
 * @param key - The tile key in the format "z/x/y".
 * @returns The tile image as a Buffer, or null if not found.
 */
  get(key: string): Buffer | null {
    const hit = this.cache.get(key);
    if (hit) {
      console.log(`${new Date().toISOString()} Memory cache hit: ${key}`);
      return hit;
    }
    return null;
  }

/**
 * Stores a tile image in the memory cache.
 *
 * @param key - The tile key in the format "z/x/y".
 * @param value - The tile image as a Buffer.
 */
  set(key: string, value: Buffer): void {
    this.cache.set(key, value);
  }
}
