const { tileToLatLon, latLonToTile } = require('../../utils/tileCenters');
const haversine = require('../../utils/haversine');

describe('tileToLatLon', () => {
  it('converts tile coordinates close to original lat/lon (within 0.300ish mile)', () => {
    const original = { lat: 31.7592, lon: -106.4524 };
    const { x, y } = latLonToTile(original.lat, original.lon, 16);

    const result = tileToLatLon(16, x, y);
    const distance = haversine(original.lat, original.lon, result.lat, result.lon);

    console.log(`Original: lat=${original.lat}, lon=${original.lon}`);
    console.log(`Tile center: lat=${result.lat}, lon=${result.lon}`);
    console.log(`Distance: ${distance.toFixed(4)} miles`);

    expect(distance).toBeLessThan(0.4); // about 528 feet
  });
});
