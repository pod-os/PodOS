import '@ionic/core';

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function updateTheme(e) {
  document.documentElement.classList.toggle('sl-theme-dark', e.matches);
}

updateTheme(mediaQuery);

mediaQuery.addEventListener('change', updateTheme);
