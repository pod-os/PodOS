module.exports = {
  preset: '@stencil/core/testing',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],

  moduleNameMapper: {
    '^marked$': '<rootDir>/../node_modules/marked/lib/marked.umd.js',
  },
};
