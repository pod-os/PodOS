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
      copy: [{ src: 'pod-index.html' }, { src: 'registerSW.js' }, { src: 'service-worker-localhost.js' }],
      serviceWorker: false, // disable stencils own service worker
    },
  ],
};
