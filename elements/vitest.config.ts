import { defineVitestConfig } from '@stencil/vitest/config';
import { stencilVitestPlugin } from '@stencil/vitest/plugin';

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  test: {
    projects: [
      {
        // plain unit tests in node environment
        test: {
          name: 'unit',
          include: ['src/**/*.vspec.ts'],
          environment: 'node',
        },
      },
      {
        // component unit tests in dom environment
        plugins: [stencilVitestPlugin()],
        test: {
          setupFiles: ['vitest/setup-spec.ts'],
          name: 'unit-dom',
          include: ['src/**/*.vspec.tsx'],
          exclude: ['src/**/*.integration.vspec.tsx'],
          environment: 'happy-dom',
        },
      },
      {
        // integration tests against a built bundle (elements including core) running in dom environment
        test: {
          setupFiles: ['vitest/setup-spec.ts', 'vitest/setup-integration.ts'],
          name: 'integration-dom',
          include: ['src/**/*.integration.vspec.tsx'],
          environment: 'happy-dom',
        },
      },
    ],
  },
});
