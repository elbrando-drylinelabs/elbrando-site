// elbrando.com
// Pages live in /public and are served as-is. This script only:
//   1. sends www.elbrando.com to elbrando.com
//   2. adds a few standard security headers
//   3. sends unknown addresses back to the home page

const CANONICAL_HOST = "elbrando.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Let previews on *.workers.dev work; redirect every other non-canonical host.
    if (url.hostname !== CANONICAL_HOST && !url.hostname.endsWith(".workers.dev")) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      return Response.redirect(new URL("/", url).toString(), 302);
    }

    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
