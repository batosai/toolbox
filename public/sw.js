const CACHE_NAME = 'github-cache';
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 heures (en millisecondes)

self.addEventListener('fetch', (event) => {
  // Vérifiez si la requête concerne uniquement github.com
  const requestUrl = new URL(event.request.url);

  // Restreindre aux requêtes réseau vers github.com
  if (!requestUrl.hostname.endsWith('github.com') || !requestUrl.protocol.startsWith('https:')) {
    return; // Ignore toute requête ne ciblant pas GitHub
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const now = Date.now();

      if (cachedResponse) {
        const cachedTime = new Date(cachedResponse.headers.get('sw-cache-timestamp')).getTime();
        if (now - cachedTime < CACHE_EXPIRATION_TIME) {
          console.log("Réponse récupérée du cache pour :", event.request.url);
          return cachedResponse;
        }
      }

      console.log("Requête réseau effectuée pour :", event.request.url);
      const response = await fetch(event.request);

      // Clonez et modifiez la réponse pour ajouter un timestamp
      const clonedResponse = response.clone();
      const headers = new Headers(clonedResponse.headers);
      headers.set('sw-cache-timestamp', new Date().toISOString());

      const modifiedResponse = new Response(await clonedResponse.text(), { headers });

      // Mettez la réponse dans le cache
      cache.put(event.request, modifiedResponse);

      return response;
    })
  );
});
