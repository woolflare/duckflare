addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

class AttributeRewriter {
  constructor(attributeName, domainFrom, domainTo) {
    this.attributeName = attributeName;
    this.domainFrom = domainFrom;
    this.regex = new RegExp(`\/\/${domainFrom}`, 'g');
    this.domainTo = `//${domainTo}`;
  }

  element(element) {
    const attribute = element.getAttribute(this.attributeName);
    if (attribute && attribute.includes(this.domainFrom)) {
      const newAttribute = attribute.replace(this.regex, this.domainTo);
      element.setAttribute(this.attributeName, newAttribute);
    }
  }
}

function createNewRequest(request) {
  let url = new URL(request.url);
  url.hostname = 'html.duckduckgo.com';
  const newHeaders = new Headers(request.headers);
  newHeaders.set('Host', url.hostname);
  newHeaders.set('Origin', `${url.protocol}//${url.hostname}`);
  newHeaders.set('Referer', `${url.protocol}//${url.hostname}/`);
  newHeaders.delete('x-real-ip');

  return new Request(url.href, {
    method: request.method,
    headers: newHeaders,
    body: request.method === 'POST' ? request.body : undefined
  });
}

async function fetchAndRewrite(request) {
  const response = await fetch(request);
  const newResponseHeaders = new Headers(response.headers);
  newResponseHeaders.delete("Content-Security-Policy");
  // newResponseHeaders.set('Access-Control-Allow-Origin', 'duckflare.com');

  const rewriter = new HTMLRewriter()
    .on('img', new AttributeRewriter('src', 'external-content.duckduckgo.com', 'external-content.duckflare.com'))
    .on('link', new AttributeRewriter('href', 'duckduckgo.com', 'duckflare.com'))
    // .on('img', new AttributeRewriter('src', 'duckduckgo.com', 'duckflare.com'));

    return rewriter.transform(new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newResponseHeaders
  }));
}

async function handleRequest(request) {
  try {
    if (new URL(request.url).protocol === 'http:') {
      return Response.redirect(request.url.replace('http:', 'https:'), 301);
    }
    const newRequest = createNewRequest(request);
    return await fetchAndRewrite(newRequest);
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
