module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '^test/(.*)$': '<rootDir>/test/$1'
    },
    setupFilesAfterEnv: ['./jest.setup.js']
  };