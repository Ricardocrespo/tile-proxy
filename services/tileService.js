// services/tileService.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TILE_DIR = path.join(__dirname, '../cache/tiles');

function getTileFilePath(z, x, y) {
  return path.join(TILE_DIR, `${z}`, `${x}`, `${y}.png`);
}

async function getTile(z, x, y) {
  const tilePath = getTileFilePath(z, x, y);

  // If tile exists in file cache, return it
  if (fs.existsSync(tilePath)) {
    return fs.promises.readFile(tilePath);
  }

  // Otherwise, fetch from MapTiler and cache it
  const url = `https://api.maptiler.com/maps/basic/${z}/${x}/${y}.png?key=${process.env.MAP_API_KEY}`;
  console.log('Fetching:', url);

  const response = await axios.get(url, { responseType: 'arraybuffer' });

  // Ensure path exists
  await fs.promises.mkdir(path.dirname(tilePath), { recursive: true });

  // Save to disk
  await fs.promises.writeFile(tilePath, response.data);

  return response.data;
}

module.exports = { getTile };
