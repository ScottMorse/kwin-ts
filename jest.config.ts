/* eslint-disable */
export default {
  preset: './jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: './coverage',
  testMatch: [
    '<rootDir>/packages/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/packages/**/*(*.)@(spec|test).[jt]s?(x)',
    '<rootDir>/libs/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
