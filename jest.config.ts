import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // Matches test files in the "tests" folder
  moduleFileExtensions: ['ts', 'js'], // Recognizes TypeScript and JavaScript files
  rootDir: './', // Root directory of the project
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Maps "src" imports for cleaner paths
  },
  clearMocks: true, // Automatically clears mock calls and instances between tests
};

export default config;