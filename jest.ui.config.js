// jest.ui.config.js
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/components/__tests__/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.ui.setup.ts'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest'),
  },

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native'
    + '|@react-native'
    + '|@react-navigation'
    + '|@react-native-community'
    + '|expo(nent)?'
    + '|@expo(nent)?/.*'
    + '|expo-.*'
    + '|@expo/.*'
    + '|@unimodules/.*'
    + '|unimodules-.*'
    + '|sentry-expo'
    + '|native-base'
    + '|react-clone-referenced-element'
    + '|@testing-library/react-native'
    + ')',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],


};
