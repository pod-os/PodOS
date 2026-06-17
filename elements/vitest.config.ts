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
          environment: 'happy-dom',
        },
      },
    ],
  },
});
