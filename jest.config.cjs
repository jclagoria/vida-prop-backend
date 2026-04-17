module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>', '<rootDir>/scripts'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!**/*.module.ts'],
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
    '^@prisma/client$': '<rootDir>/prisma/generated/client',
  },
}
