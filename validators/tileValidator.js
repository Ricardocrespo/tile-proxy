/* This function validates the tile coordinates in the request parameters.
 * It checks if the parameters z, x, and y are all numeric values.
 * If any of them are not numeric, it responds with a 400 Bad Request status and an error message.
 * If all parameters are valid, it calls the next middleware function in the stack.
 * 
 * @param {Object} req - The request object containing tile coordinates in the URL parameters.
 * @param {Object} res - The response object used to send the error response if validation fails.
 * @param {Function} next - The next middleware function to call if validation passes.
 * 
 * @returns {void} - Returns nothing if validation passes, or sends a 400 error response if validation fails.
 */
function validateTileCoords(req, res, next) {
  const { z, x, y } = req.params;

  if (![z, x, y].every(v => /^\d+$/.test(v))) {
    return res.status(422).send('Invalid tile coordinates');
  }

  if (z < 0 || z > 20) {
    return res.status(422).send('Unsupported zoom level');
  }

  next();
}

module.exports = { validateTileCoords };
