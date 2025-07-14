module.exports = {
  default: {
    require: [
      'ts-node/register', // Enable TypeScript support
      'src/features/step_definitions/*.ts', // Path to step definitions
      'src/features/hooks.ts', // Include hooks file
    ],
    format: ['progress', 'json:reports/cucumber-report.json'], // Optional: Add reporting
    paths: ['src/features/*.feature'], // Path to feature files
  },
};