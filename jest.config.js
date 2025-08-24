// jest.config.js (SUBSTITUI TUDO)
const path = require('path');

module.exports = {
  projects: [
    // ---- Projeto 1: testes de serviços (ts-jest) ----
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      // Ajusta os padrões conforme a tua tree de serviços:
      testMatch: ['<rootDir>/services/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      // Evita o deprecated warning do ts-jest movendo isolatedModules p/ tsconfig
      // (se não quiseres mexer no tsconfig agora, tudo bem)
    },

    // ---- Projeto 2: testes de UI (babel-jest + jest-expo) ----
    {
      displayName: 'ui',
      preset: 'jest-expo',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.ui.setup.ts'],
      // Coloca aqui os teus testes de componentes/telas:
      testMatch: [
        '<rootDir>/components/__tests__/**/*.test.tsx',
        '<rootDir>/components/__tests__/**/*.spec.tsx',
        '<rootDir>/app/**/*.test.tsx',
      ],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest'),
      },
      transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community|expo(nent)?|@expo(nent)?/.*|expo-.*|@expo/.*|@unimodules/.*|unimodules-.*|sentry-expo|native-base|react-clone-referenced-element|@testing-library/react-native)',
      ],
    },
  ],
};
