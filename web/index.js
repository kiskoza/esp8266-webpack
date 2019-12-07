// You can add JS here

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');

  window.addEventListener('load', async function() {
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (registrations.length) {
      for(let registration of registrations) {
        await registration.unregister();
      }
    }

    const registration = await navigator.serviceWorker.register('/service-worker.js');
  });
}
