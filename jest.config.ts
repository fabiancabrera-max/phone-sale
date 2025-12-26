import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provee la ruta a tu aplicación Next.js para cargar next.config.js y los archivos .env
  dir: './',
});

// Configuración personalizada de Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  // Setup adicional antes de cada prueba
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Mapeo de alias (si utilizas @/...)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
