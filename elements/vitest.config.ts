import { defineVitestConfig } from '@stencil/vitest/config';

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  test: {
    projects: [
      {
        test: {
          name: 'spec',
          include: ['src/**/*.vspec.{ts,tsx}'],
          environment: 'happy-dom',
          setupFiles: ['./vitest-setup.ts'],
        },
      },
    ],
  },
});
