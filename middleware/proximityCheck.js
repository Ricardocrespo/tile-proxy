/* This middleware checks if the tile request is within proximity of allowed tile centers.
 * It uses the `isWithinRange` function to determine if the latitude and longitude of the tile are within the allowed range.
 * If the request is outside the allowed region, it responds with a 403 Forbidden status.
 * If the request is within range, it calls the next middleware function in the stack.
 */
const { isWithinRange, tileToLatLon } = require('../utils/tileCenters');

function checkTileProximity(req, res, next) {
  const { z, x, y } = req.params;
  const { lat, lon } = tileToLatLon(Number(z), Number(x), Number(y));

  if (!isWithinRange(lat, lon)) {
    return res.status(403).send('Tile request is outside allowed region');
  }

  next();
}

module.exports = { checkTileProximity };