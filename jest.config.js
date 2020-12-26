module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testMatch: ['<rootDir>/test/unit/**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.config.ts',
    '!src/**/*.repository.ts',
    '!src/**/model/**',
    '!src/**/error/**',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};
