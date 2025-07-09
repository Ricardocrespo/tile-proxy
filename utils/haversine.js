/* This module exports a single function `haversineDistance` that calculates the distance in miles
 * between two points on the Earth specified by latitude and longitude using the Haversine formula.
 * The Haversine formula is used to find the shortest distance over the Earth's surface, assuming a spherical Earth.
 * @param {number} lat1 - Latitude of the first point
 * @param {number} lon1 - Longitude of the first point
 * @param {number} lat2 - Latitude of the second point
 * @param {number} lon2 - Longitude of the second point
 * @returns {number} - Distance in miles between the two points
 * @see {@link https://en.wikipedia.org/wiki/Haversine_formula|Haversine formula on Wikipedia}
 */

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const toRad = angle => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = haversineDistance;