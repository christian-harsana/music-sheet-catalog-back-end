module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.integration.test.ts'],
  testTimeout: 30000, // Integration tests hit real servers/DBs so they need more time than the default 5000ms
};