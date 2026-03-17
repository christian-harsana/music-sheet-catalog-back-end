module.exports = {
  preset: 'ts-jest', // Tells Jest how to compile .ts files
  testEnvironment: 'node', // Runs tests in a Node.js environment instead of the default browser-like (jsdom) environment — essential for API/server testing
  testMatch: ['**/*.test.ts']
};