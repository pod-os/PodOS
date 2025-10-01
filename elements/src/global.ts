import '@ionic/core';

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

setBasePath(new URL('./shoelace', import.meta.url).toString());

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function updateTheme(e) {
  document.documentElement.classList.toggle('sl-theme-dark', e.matches);
}

updateTheme(mediaQuery);

mediaQuery.addEventListener('change', updateTheme);
