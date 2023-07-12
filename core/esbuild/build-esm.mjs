import * as esbuild from 'esbuild'

import {config} from './esm-config.mjs';

await esbuild.build(config)
