const { When, Then, Given } = require('@cucumber/cucumber');
const nock = require('nock');
const request = require('supertest');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.test' }); // ensure this is before `app` is imported
const app = require('../../app');
const tileService = require('../../services/tileService');

let response;

// This sets up shared test state or environment before each scenario
Given('a running tile proxy server', function () {
  // Nothing to initialize because we use the imported app instance
  // You can also set up mock/stub logic here later if needed
  return true;
});

Given('a cached tile exists for {string}', async function (tilePath) {
  const parts = tilePath.split('/');
  const [ , , z, x, file ] = parts;
  const y = file.replace('.png', '');
  const tileKey = `${z}/${x}/${y}`;

  // Fake tile data (valid enough for a PNG header)
  const fakeTileData = Buffer.from([0x89, 0x50, 0x4E, 0x47]);

  // Inject directly into the LRU cache
  tileService.__lruCache.set(tileKey, fakeTileData);

  // Ensure external request is NOT called
  this.externalRequestMade = false;
});

When('I request tile {string}', async function (path) {
  // Intercept any MapTiler API calls and flag them
  nock(/https:\/\/api\.maptiler\.com/)
    .get(/.*/)
    .reply(() => {
      this.externalRequestMade = true;
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
  assert.strictEqual(this.externalRequestMade, false, 'Expected tile to be served from local cache');
});
