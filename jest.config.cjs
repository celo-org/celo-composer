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
  // The project is "type": "module" and its TypeScript sources use `.js`
  // specifiers on relative imports, which is what NodeNext requires. Jest
  // resolves those literally and fails with "Cannot find module './x.js'",
  // so any test importing a src module could not run at all — which is part
  // of why there were none. Strip the extension for resolution only.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  // Scaffolding a project runs the real CLI end to end: plop, template
  // rendering, git init. The default 5s is not enough on a cold cache.
  testTimeout: 120000
};
