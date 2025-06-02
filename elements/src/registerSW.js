if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker-localhost.js').catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}
