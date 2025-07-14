import { When, Then, Given } from '@cucumber/cucumber';
import nock from 'nock';
import request from 'supertest';
import assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'; // ensure this is before `app` is imported
import app from '../../../src/app';

let response: request.Response;

// This sets up shared test state or environment before each scenario
Given('a running tile proxy server', function (): boolean {
  // Nothing to initialize because we use the imported app instance
  // You can also set up mock/stub logic here later if needed
  return true;
});

Given('a cached tile exists for {string}', async function (tilePath: string): Promise<void> {
  const parts = tilePath.split('/');
  const [, maybeTiles, z, x, file] = parts;
  const y = file.replace('.png', '');
  const fullPath = path.join(
    __dirname,
    '../../cache',
    maybeTiles === 'tiles' ? maybeTiles : 'tiles',
    z,
    x,
    `${y}.png`
  );

  await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });

  // Fake tile data (valid enough for a PNG header)
  const fakeTileData = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
  await fs.promises.writeFile(fullPath, fakeTileData);

  this.externalRequestMade = false;

});

When('I request tile {string}', async function (path: string): Promise<void> {
  // Intercept any MapTiler API calls and flag them
  nock('https://api.maptiler.com')
    .get(/.*/)
    .reply(() => {
      this.externalRequestMade = true;
      return [200, Buffer.from('real-data')];
    });

  response = await request(app).get(path);
});

Then('I should receive a PNG image with status 200', (): void => {
  assert.strictEqual(response.status, 200);
  assert.match(response.headers['content-type'], /image\/png/);
  assert.ok(response.body instanceof Buffer);
});

Then('I receive a {int} status code', function (statusCode: number): void {
  if (!response) throw new Error('No response received');
  assert.strictEqual(response.status, statusCode);
});

Then('the response should be a PNG image', function (): void {
  assert.match(response.headers['content-type'], /image\/png/);
});

Then('the response body should be a Buffer', function (): void {
  assert.ok(response.body instanceof Buffer);
});

Then('no external request should be made', function (): void {
  assert.strictEqual(this.externalRequestMade, false, 'Expected tile to be served from local cache');
});
