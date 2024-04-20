addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
async function handleRequest(request) {
  const url = new URL(request.url);
  url.hostname = 'external-content.duckduckgo.com';

  const newRequest = new Request(url, request);
  newRequest.headers.set('Host', url.hostname);
  newRequest.headers.delete('x-real-ip');

  try {
    const response = await fetch(newRequest);
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', 'duckflare.com');
    newHeaders.set('Vary', 'Origin');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
