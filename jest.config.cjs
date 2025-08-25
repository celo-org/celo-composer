module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/*.test.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/templates/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
