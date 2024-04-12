import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'contacts',
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
    },
    {
      type: 'www',
      copy: [
        {
          src: 'manifest.json',
        },
        {
          src: 'favicon-32x32.png',
        },
        {
          src: 'netlify',
          dest: '',
        },
      ],
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
};
