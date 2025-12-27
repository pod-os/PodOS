import { Config } from '@stencil/core';
import { join } from 'path';

export const config: Config = {
  namespace: 'contacts',
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
        {
          src: join(__dirname, '../node_modules/@shoelace-style/shoelace/dist/assets'),
          dest: 'build/shoelace/assets',
        },
      ],
      serviceWorker: null, // disable service workers
    },
  ],
};
