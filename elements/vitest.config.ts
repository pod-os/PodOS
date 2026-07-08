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
        oxc: {
          // vitest prints a warning:
          // > Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsxFactory: 'h', jsxFragment: 'Fragment' }`
          // so osx is used, but it does not have jsx options set correctly, which leads to renderings like `__self="[object global]"` and `__source="[object Object]"` in tests
          // we are setting the jsx options for oxc here to fix that
          jsx: {
            runtime: 'classic',
            pragma: 'h',
            pragmaFrag: 'Fragment',
            development: false, // do not render development props like __self and __source
          },
        },
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
