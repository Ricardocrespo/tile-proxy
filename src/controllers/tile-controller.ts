/* This file defines the route for handling tile requests in the tile proxy application.
 * It includes middleware for validating tile coordinates and checking proximity to allowed tile centers.
 */

import express, { Request, Response, Router } from 'express';
import TileService from '../services/tile-service';
import { checkTileProximity } from '../middleware/proximity-check';
import { validateTileCoords } from '../validators/tile-validator';

class TileController {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

/* This route handles requests for map tiles.
 * It validates the tile coordinates, checks if the request is within proximity of allowed tile centers,
 * and retrieves the tile from the cache or the Map API.  
 * GET /tiles/:z/:x/:y
 * @param {string} z - Zoom level of the tile
 * @param {string} x - X coordinate of the tile
 * @param {string} y - Y coordinate of the tile
 * @return {Object} - Returns the tile image as a PNG
 */

  private initializeRoutes(): void {
    this.router.get('/:z/:x/:y', validateTileCoords, checkTileProximity, this.getTileHandler);
  }
  private async getTileHandler(req: Request, res: Response): Promise<void> {
    try {
      const { z, x, y } = req.params;
      const tile = await TileService.getTile(z, x, y);
      res.setHeader('Content-Type', 'image/png');
      res.send(tile);
    } catch (err: any) {
      console.error('Tile fetch error:', err.message);
      res.status(500).send('Tile fetch error');
    }
  }
}

export default new TileController().router;
