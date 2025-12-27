import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

function updateTheme(e) {
  document.documentElement.classList.toggle('sl-theme-dark', e.matches);
}

export default function () {
  setBasePath(new URL('./shoelace', import.meta.url).toString());

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  updateTheme(mediaQuery);

  mediaQuery.addEventListener('change', updateTheme);
}
