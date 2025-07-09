/* This hook runs before each scenario to ensure a clean slate for the tile cache.
 * It removes the cache directory if it exists, allowing tests to run without stale data.
 * This is useful for ensuring that each test starts with a fresh state, especially when testing tile caching behavior.
 */
const { BeforeAll, After, Before } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');
const nock = require('nock');

const cacheDir = path.join(__dirname, '../../cache/tiles');

BeforeAll(async () => {
  // Ensure the cache directory exists
  await fs.promises.mkdir(cacheDir, { recursive: true });
});

Before(async function (scenario) {
  nock.cleanAll();
  this.nockCalled = false;
  this.externalRequestMade = false;

  const isCacheScenario = scenario.pickle.tags.some(tag => tag.name === '@cache');
  if (!isCacheScenario) return;

  const tilePath = path.join(cacheDir, '16', '13388');
  const tileFile = path.join(tilePath, '26665.png');
  await fs.promises.mkdir(tilePath, { recursive: true });
  const fakeData = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
  await fs.promises.writeFile(tileFile, fakeData);
});

After({ tags: '@cache' }, async () => {
  await fs.promises.rm(path.join(cacheDir, '16', '13388', '26665.png'), { force: true });
});


