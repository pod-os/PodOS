import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'elements',
  globalScript: 'src/global.ts',
  globalStyle: 'src/global.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
      dir: '../docs/elements',
    },
    {
      type: 'www',
      copy: [{ src: 'pod-index.html' }],
      serviceWorker: null, // disable service workers
    },
  ],
};
