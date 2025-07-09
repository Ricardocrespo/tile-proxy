const { When, Then, Given } = require('@cucumber/cucumber');
const request = require('supertest');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.test' }); // ensure this is before `app` is imported
const app = require('../../app');

let response;
let nockCalled = false;

// This sets up shared test state or environment before each scenario
Given('a running tile proxy server', function () {
  // Nothing to initialize because we use the imported app instance
  // You can also set up mock/stub logic here later if needed
  return true;
});

Given('a cached tile exists for {string}', async function (tilePath) {
  const parts = tilePath.split('/');
  const [ , maybeTiles, z, x, file ] = parts;
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

  // Simple fake PNG header (doesn't need to be valid image for test)
  const fakeTileData = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
  await fs.promises.writeFile(fullPath, fakeTileData);

  // Clear any prior mocks
  this.externalRequestMade = false;

  // Ensure external request is *not* called
  const nock = require('nock');
  nock('https://api.maptiler.com')
    .get(() => true)
    .reply(() => {
      this.externalRequestMade = true;
      return [200, 'should not happen'];
    });
});

When('I request tile {string}', async function (path) {
  // Intercept any MapTiler API calls and flag them
  const nock = require('nock');
  const api = nock('https://api.maptiler.com')
    .get(/.*/)
    .reply(() => {
      nockCalled = true;
      return [200, Buffer.from('real-data')];
    });

  response = await request(app).get(path);
});

Then('I should receive a PNG image with status 200', () => {
  assert.strictEqual(response.status, 200);
  assert.match(response.headers['content-type'], /image\/png/);
  assert.ok(response.body instanceof Buffer);
});

Then('I receive a {int} status code', function (statusCode) {
  if (!response) throw new Error('No response received');
  if (response.status !== statusCode) {
    console.error('Response body:', response.text);
  }
  //expect(response.status).toBe(statusCode);
  assert.strictEqual(response.status, statusCode);
});

Then('the response should be a PNG image', function () {
  assert.match(response.headers['content-type'], /image\/png/);
});

Then('the response body should be a Buffer', function () {
  assert.ok(response.body instanceof Buffer);
});

Then('no external request should be made', function () {
  assert.strictEqual(nockCalled, false, 'Expected no external API call');
  assert.strictEqual(this.externalRequestMade, false, 'Expected tile to be served from local cache');
});
