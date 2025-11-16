/** @type {import('jest').Config} */
export default {
  projects: [
    {
      displayName: 'core',
      rootDir: './core',
      transformIgnorePatterns: ['/node_modules/(?!(@solid-data-modules|mime)/)'],
    },
    {
      displayName: 'elements',
      rootDir: './elements',
      preset: '@stencil/core/testing',
      setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
      moduleNameMapper: {
        '^marked$': '<rootDir>/../node_modules/marked/lib/marked.umd.js',
      },
    },
    {
      displayName: 'contacts',
      rootDir: './contacts',
      preset: '@stencil/core/testing',
      setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    },
    {
      displayName: 'service-worker',
      rootDir: './service-worker',
    },
  ],
};
