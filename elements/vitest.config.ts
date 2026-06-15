import { defineVitestConfig } from '@stencil/vitest/config';
import { stencilVitestPlugin } from '@stencil/vitest/plugin';

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  test: {
    projects: [
      {
        plugins: [stencilVitestPlugin()],
        test: {
          setupFiles: ['vitest/setup-spec.ts'],
          name: 'spec',
          include: ['src/**/*.vspec.{ts,tsx}'],
          environment: 'happy-dom',
        },
      },
    ],
  },
});
