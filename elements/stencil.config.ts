import { Config } from '@stencil/core';

import { join } from 'path';

export const config: Config = {
  namespace: 'elements',
  globalScript: 'src/global.ts',
  globalStyle: 'src/global.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        {
          src: join(__dirname, '../node_modules/@shoelace-style/shoelace/dist/assets'),
          dest: 'shoelace/assets',
        },
      ],
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
      copy: [
        { src: 'pod-index.html' },
        { src: 'registerSW.js' },
        { src: 'service-worker-localhost.js' },
        {
          src: join(__dirname, '../node_modules/@shoelace-style/shoelace/dist/assets'),
          dest: 'build/shoelace/assets',
        },
      ],
      serviceWorker: false, // disable stencils own service worker
    },
  ],
};
