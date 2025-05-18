/**
 * This is the service worker registered for local development
 */

import { setupServiceWorker } from './build/index.esm.js';

setupServiceWorker(self, 'pod-os-dev-server', 'http://localhost:3333/build/', ['/', './index.html', './registerSW.js']);
