import { Request, Response, NextFunction } from 'express';
import { isWithinRange, tileToLatLon } from '../utils/tile-centers';

/** 
 * This middleware checks if the tile request is within proximity of allowed tile centers.
 * It uses the `isWithinRange` function to determine if the latitude and longitude of the tile are within the allowed range.
 * If the request is outside the allowed region, it responds with a 403 Forbidden status.
 * If the request is within range, it calls the next middleware function in the stack.
 *
 * @param {Request} req - The Express request object containing tile parameters.
 * @param {Response} res - The Express response object used to send the response.
 * @param {NextFunction} next - The next middleware function to call if the request is within range.
 * @returns {void}
 * @throws {Error} If the tile is outside the allowed range, it sends a 403 Forbidden response.
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