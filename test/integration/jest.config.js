const {join} = require('path');

module.exports = {
  preset: './test/integration/preset.js',
  testMatch: ['<rootDir>/test/integration/**/*.test.ts'],
  rootDir: join(__dirname, '../../'),
};
