import * as esbuild from 'esbuild'

import {config} from './esm-config.mjs';

const context = await esbuild.context(config)
await context.watch();