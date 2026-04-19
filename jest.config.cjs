module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>', '<rootDir>/scripts'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!**/*.module.ts'],
  forceExit: true,
  workerIdleMemoryLimit: '512MB',
  fakeTimers: {
    enableGlobally: true,
    doNotFake: ['setImmediate'],
  },
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 60,
      statements: 60,
    },
  },
  moduleNameMapper: {
    '^@/(.*)\\.js$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)\\.js$': '<rootDir>/src/common/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@health/(.*).js$': '<rootDir>/src/health/$1',
    '^@health/(.*)$': '<rootDir>/src/health/$1',
    '^@prisma/client$': '<rootDir>/prisma/generated/client',
  },
}
