import fs from 'fs';
import path from 'path';
import { TileCache } from '../../src/services/tile-cache';

describe('TileCache', () => {
  const tileKey = '16/12345/67890';
 
  const baseDir = path.join(__dirname, '../../test/cache/tiles');
  const expectedPath = path.join(baseDir, '16', '12345', '67890.png');

  let cache: TileCache;

  beforeEach(() => {
    jest.clearAllMocks();
    cache = new TileCache();

    // Ensure directory exists
    fs.mkdirSync(path.dirname(baseDir), { recursive: true });

    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Buffer.from('test-data'));
    jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined);
    jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);
    jest.spyOn(fs.promises, 'unlink').mockResolvedValue(undefined);
  });

  afterAll(async () => {
    const testCacheRoot = path.join(__dirname, '../../test/cache');
    try {
      await fs.promises.rm(testCacheRoot, { recursive: true, force: true });
    } catch (_) {
      // ignore
    }
  });

    it('should return null if tile does not exist', async () => {
    (fs.promises.readFile as jest.Mock).mockRejectedValueOnce(
      Object.assign(new Error('File not found'), { code: 'ENOENT' })
    );

    const result = await cache.get(tileKey);

    expect(fs.promises.readFile).toHaveBeenCalledWith(expectedPath);
    expect(result).toBeNull();
  });

  it('should log error and return null on unexpected read error', async () => {
    const unexpectedErr = Object.assign(new Error('Disk failure'), { code: 'EIO' });
    (fs.promises.readFile as jest.Mock).mockRejectedValueOnce(unexpectedErr);

    const result = await cache.get(tileKey);

    expect(fs.promises.readFile).toHaveBeenCalledWith(expectedPath);
    expect(result).toBeNull();
  });

    it('should write a tile to disk', async () => {
    const data = Buffer.from('test-data');

    await cache.set(tileKey, data);

    expect(fs.promises.mkdir).toHaveBeenCalledWith(path.dirname(expectedPath), { recursive: true });
    expect(fs.promises.writeFile).toHaveBeenCalledWith(expectedPath, data);
  });

  it('should read a tile if it exists', async () => {
    const fakeData = Buffer.from('tile-data');
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(fakeData);
    const result = await cache.get(tileKey);

    expect(fs.promises.readFile).toHaveBeenCalledWith(expectedPath);
    expect(result).toEqual(fakeData);
  });


});
