/* This file defines the route for handling tile requests in the tile proxy application.
 * It includes middleware for validating tile coordinates and checking proximity to allowed ports.
 */

const express = require('express');
const router = express.Router();
const { getTile } = require('../services/tileService');
const { checkTileProximity } = require('../middleware/proximityCheck');
const { validateTileCoords } = require('../validators/tileValidator');

/* This route handles requests for map tiles.
 * It validates the tile coordinates, checks if the request is within proximity of allowed ports,
 * and retrieves the tile from the cache or the Map API.  
 * GET /tiles/:z/:x/:y
 * @param {string} z - Zoom level of the tile
 * @param {string} x - X coordinate of the tile
 * @param {string} y - Y coordinate of the tile
 * @return {Object} - Returns the tile image as a PNG
 */
router.get('/:z/:x/:y',
  validateTileCoords,
  checkTileProximity,
  async (req, res) => {
    try {
      const { z, x, y } = req.params;
      const tile = await getTile(z, x, y);
      res.setHeader('Content-Type', 'image/png');
      res.send(tile);
    } catch (err) {
      console.error('Tile fetch error:', err.message);
      res.status(500).send('Tile fetch error');
    }
  }
);

module.exports = router;
