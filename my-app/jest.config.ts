/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // ✅ Transpile TS & TSX
    '^.+\\.(js|jsx)$': 'babel-jest' // ✅ Optional: if you use JS or JSX
  },
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['./jest.setup.ts']
}
