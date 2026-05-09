export default {
  preset: '@stencil/core/testing',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],

  moduleNameMapper: {
    '^marked$': '<rootDir>/../node_modules/marked/lib/marked.umd.js',
  },

  // The Stencil preset transforms TypeScript files by default, but we need to also
  // transform .js/.mjs files from node_modules packages that use ES module syntax
  // (like url-template which has "type": "module" in its package.json)
  transform: {
    '^.+\\.(js|mjs)$': '@stencil/core/testing/jest-preprocessor',
  },

  transformIgnorePatterns: ['/node_modules/(?!(url-template)/)'],
};
