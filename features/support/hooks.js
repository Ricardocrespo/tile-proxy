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
  const tileFile = path.join(cacheDir, '16', '13388', '26665.png');
  await fs.promises.rm(tileFile, { force: true });
  // Remove parent directories if they are empty
  let currentDir = path.dirname(tileFile); // Start with '13388'
  while (currentDir !== cacheDir) { // Stop at the root cache directory
    try {
      const files = await fs.promises.readdir(currentDir);
      if (files.length === 0) {
        await fs.promises.rmdir(currentDir);
        currentDir = path.dirname(currentDir); // Move up to the parent directory
      } else {
        break; // Stop if the directory is not empty
      }
    } catch (err) {
      // Log error or handle it if necessary, then break
      break;
    }
  }
});


