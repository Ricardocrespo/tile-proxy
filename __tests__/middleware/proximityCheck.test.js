const { checkTileProximity } = require('../../middleware/proximityCheck');
const { isWithinRange, tileToLatLon } = require('../../utils/ports');

// Mock tileToLatLon and isWithinRange
jest.mock('../../utils/ports', () => ({
  isWithinRange: jest.fn(),
  tileToLatLon: jest.fn(),
}));

describe('checkTileProximity middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { z: '16', x: '14087', y: '25959' } };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('calls next() when tile is within allowed range', () => {
    tileToLatLon.mockReturnValue({ lat: 31.75, lon: -106.45 });
    isWithinRange.mockReturnValue(true);

    checkTileProximity(req, res, next);

    expect(isWithinRange).toHaveBeenCalledWith(31.75, -106.45);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('sends 403 when tile is outside allowed range', () => {
    tileToLatLon.mockReturnValue({ lat: 31.60, lon: -106.20 });
    isWithinRange.mockReturnValue(false);

    checkTileProximity(req, res, next);

    expect(isWithinRange).toHaveBeenCalledWith(31.60, -106.20);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Tile request is outside allowed region');
    expect(next).not.toHaveBeenCalled();
  });
});
