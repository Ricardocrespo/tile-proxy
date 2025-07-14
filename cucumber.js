module.exports = {
  default: {
    require: [
      'ts-node/register', // Enable TypeScript support
      'test/features/step_definitions/*.ts', // Path to step definitions
      'test/features/hooks.ts', // Include hooks file
    ],
    format: ['progress', 'json:reports/cucumber-report.json'], // Optional: Add reporting
    paths: ['test/features/*.feature'], // Path to feature files
  },
};