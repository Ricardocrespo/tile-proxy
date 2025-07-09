/* This hook runs before each scenario to ensure a clean slate for the tile cache.
 * It removes the cache directory if it exists, allowing tests to run without stale data.
 * This is useful for ensuring that each test starts with a fresh state, especially when testing tile caching behavior.
 */
const { BeforeAll, AfterAll, Before } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '../../cache/tiles');

BeforeAll(async () => {
  // Ensure the cache directory exists
  await fs.promises.mkdir(cacheDir, { recursive: true });
});

Before({ tags: '@cache' }, async () => {
  // Write fake cached tile again before each @cache test
  const tilePath = path.join(cacheDir, '16', '13388');
  const tileFile = path.join(tilePath, '26665.png');

  await fs.promises.mkdir(tilePath, { recursive: true });
  const fakeData = Buffer.from([0x89, 0x50, 0x4E, 0x47]); // Fake PNG header
  await fs.promises.writeFile(tileFile, fakeData);
});

AfterAll(async () => {
  // Optional: clean up cache folder
  await fs.promises.rm(path.join(__dirname, '../../cache'), { recursive: true, force: true });
});


