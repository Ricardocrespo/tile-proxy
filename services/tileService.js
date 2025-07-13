/* This service handles fetching and caching map tiles.
 * It uses an LRU cache for in-memory storage and a file system cache for persistent storage.
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');

const TILE_DIR = path.join(__dirname, '../cache/tiles');
const memoryCache = new LRU({
  max: 200,
  ttl: 1000 * 60 * 10,
});

// inflight requests map to avoid duplicate fetches
const inflight = new Map(); // <tileKey, Promise<Buffer>>

function getTileFilePath(z, x, y) {
  return path.join(TILE_DIR, `${z}`, `${x}`, `${y}.png`);
}

// This function fetches a tile from the MapTiler API and caches it on disk.
async function fetchAndCacheTile(z, x, y) {
  const tilePath = getTileFilePath(z, x, y);
  const url = `https://api.maptiler.com/maps/basic/${z}/${x}/${y}.png?key=${process.env.MAP_API_KEY}`;

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
async function getTile(z, x, y) {
  console.log("is getTile called twice?");
  const tileKey = `${z}/${x}/${y}`;

  // Check first In-memory cache
  const memHit = memoryCache.get(tileKey);
  if (memHit) {
    console.log(`${new Date().toISOString()} Memory cache hit:`, tileKey);
    return memHit;
  }

  // Handle concurrent in-flight requests
  if (!inflight.has(tileKey)) {
    inflight.set(tileKey, fetchAndCacheTile(z, x, y));
  }

  // Wait for the in-flight request to resolve
  const tilePromise = inflight.get(tileKey);

  try {
    return await tilePromise;
  } finally {
    inflight.delete(tileKey); // Clean up after resolve or reject
  }
}

module.exports = { getTile };
if (process.env.NODE_ENV === 'test') {
  module.exports.__lruCache = memoryCache; // Expose for testing
}
