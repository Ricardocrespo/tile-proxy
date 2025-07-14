import { isWithinRange, latLonToTile, tileToLatLon } from '../../src/utils/tile-centers';
import haversineDistance from '../../src/utils/haversine';

jest.mock('../../src/utils/haversine', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('isWithinRange', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns true when the point is within range of a tile center', () => {
    (haversineDistance as jest.Mock).mockReturnValue(0.5); // Mock distance within range

    const result = isWithinRange(31.759195054758752, -106.45245281786063, 1.0);

    expect(haversineDistance).toHaveBeenCalledWith(31.759195054758752, -106.45245281786063, 31.759195054758752, -106.45245281786063);
    expect(result).toBe(true);
  });

  it('returns false when the point is outside the range of all tile centers', () => {
    (haversineDistance as jest.Mock).mockReturnValue(2.0); // Mock distance outside range

    const result = isWithinRange(31.75, -106.45, 1.0);

    expect(haversineDistance).toHaveBeenCalledWith(31.75, -106.45, 31.759195054758752, -106.45245281786063);
    expect(result).toBe(false);
  });

});

describe('tileToLatLon', () => {
  it('round-trips to the same tile', () => {
    const original = { lat: 31.759195054758752, lon: -106.45245281786063 };
    const zoom = 16;

    const { x, y } = latLonToTile(original.lat, original.lon, zoom);
    const { lat, lon } = tileToLatLon(zoom, x, y);

    const roundTrip = latLonToTile(lat, lon, zoom);

    expect(roundTrip.x).toBe(x);
    expect(roundTrip.y).toBe(y);
  });
});