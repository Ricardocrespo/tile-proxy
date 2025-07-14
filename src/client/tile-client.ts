import axios from 'axios';

export class TileClient {
/**
 * This method fetches a tile from the remote Map API.
 * It constructs the URL using the zoom level (z), x coordinate (x), and y coordinate (y),
 * and appends the API key from environment variables.
 * If the request is successful, it returns the tile image as a Buffer.
 * If the request fails, it throws an error.
 *
 * @param {string} z Zoom level
 * @param {string} x X coordinate
 * @param {string} y Y coordinate
 * @returns Tile image as a Buffer
 */
  async fetchTile(z: string, x: string, y: string): Promise<Buffer> {
    const url = `https://api.maptiler.com/maps/basic/${z}/${x}/${y}.png?key=${process.env.MAP_API_KEY}`;
    console.log(`${new Date().toISOString()} Fetching: ${url}`);
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  }
}