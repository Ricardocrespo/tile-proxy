import { checkTileProximity } from '../../src/middleware/proximity-check';
import { isWithinRange, tileToLatLon } from '../../src/utils/tile-centers';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

// Mock tileToLatLon and isWithinRange
jest.mock('../../src/utils/tile-centers', () => ({
  isWithinRange: jest.fn(),
  tileToLatLon: jest.fn(),
}));

describe('checkTileProximity middleware', () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = { params: { z: '16', x: '14087', y: '25959' } };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('calls next() when tile is within allowed range', () => {
    (tileToLatLon as jest.Mock).mockReturnValue({ lat: 31.75, lon: -106.45 });
    (isWithinRange as jest.Mock).mockReturnValue(true);

    checkTileProximity(req, res, next);

    expect(isWithinRange).toHaveBeenCalledWith(31.75, -106.45);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('sends 403 when tile is outside allowed range', () => {
    (tileToLatLon as jest.Mock).mockReturnValue({ lat: 31.60, lon: -106.20 });
    (isWithinRange as jest.Mock).mockReturnValue(false);

    checkTileProximity(req, res, next);

    // Mock tileToLatLon and isWithinRange
    jest.mock('../../src/utils/tile-centers', () => ({
      isWithinRange: jest.fn(),
      tileToLatLon: jest.fn(),
    }));

  });
});
