import { Request, Response, NextFunction } from 'express';
import { isWithinRange, tileToLatLon } from '../utils/tile-centers';

/* This middleware checks if the tile request is within proximity of allowed tile centers.
 * It uses the `isWithinRange` function to determine if the latitude and longitude of the tile are within the allowed range.
 * If the request is outside the allowed region, it responds with a 403 Forbidden status.
 * If the request is within range, it calls the next middleware function in the stack.
 */
function checkTileProximity(req: Request, res: Response, next: NextFunction): void {
  const { z, x, y } = req.params;
  const { lat, lon } = tileToLatLon(parseInt(z), parseInt(x), parseInt(y));

  if (!isWithinRange(lat, lon)) {
    res.status(403).send('Tile is outside the allowed range.');
    return;
  }

  next();
}

export { checkTileProximity };