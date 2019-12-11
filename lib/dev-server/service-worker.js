import localForage from "localforage";

self.addEventListener('install', e => {
  console.log('installed');
});

self.addEventListener('activate', async e => {
  console.log('activated');
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(async function() {
    const {method, url} = e.request;

    if(url.includes('.js') || url.includes('.css') || url.includes('dev-server')) {
      return fetch(e.request);
    } else {
      const response = await fetch(e.request);
      const clonedResponse = response.clone();

      if(await response.headers.get("Content-Type").includes('text/html')) {
        const utf8Decoder = new TextDecoder('utf-8');

        let stream = await response.body.getReader().read();
        let body = utf8Decoder.decode(stream.value);
        let keys = { };

        await Promise.all(
          (body.match(/%[A-Z]*%/g) || [])
          .map((el) => { return el.replace(/%/g, '') })
          .filter((v, i, a) => { return a.indexOf(v) === i })
          .sort()
          .map(async (el) => {
            const val = await localForage.getItem(el);

            if(!val) {
              keys[el] = "%" + el + "%";
              await localForage.setItem(el, "%" + el + "%");
            } else {
              keys[el] = val;
            }
          })
        );

        Object.keys(keys).map( el => {
          body = body.replace(new RegExp(`%${el}%`, 'g'), keys[el])
        });

        return new Response(body, { headers: {"Content-Type": 'text/html'} });
      } else {
        return clonedResponse;
      }
    }
  }());
});
