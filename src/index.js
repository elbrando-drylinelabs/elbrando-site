// elbrando.com
// Serves the files in /public straight from the `main` branch of this (public) GitHub repo,
// cached at Cloudflare's edge for 5 minutes. Commit a change to main and it's live within ~5 minutes.
// This script also:
//   1. sends www.elbrando.com (and any other host) to elbrando.com
//   2. serves /hot-toddy from public/hot-toddy.html and redirects old .html addresses
//   3. adds a few standard security headers
//   4. sends unknown addresses back to the home page

const CANONICAL_HOST = "elbrando.com";
const SOURCE = "https://raw.githubusercontent.com/elbrando-drylinelabs/elbrando-site/main/public";
const CACHE_SECONDS = 300;

const TYPES = {
  html: "text/html; charset=utf-8",
  svg: "image/svg+xml",
  txt: "text/plain; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  ico: "image/x-icon",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  json: "application/json",
  xml: "application/xml",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname !== CANONICAL_HOST && !url.hostname.endsWith(".workers.dev")) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const path = url.pathname;
    if (path === "/index.html") return Response.redirect(new URL("/", url).toString(), 301);
    if (path.endsWith(".html")) return Response.redirect(new URL(path.slice(0, -5), url).toString(), 301);
    if (path.length > 1 && path.endsWith("/")) return Response.redirect(new URL(path.slice(0, -1), url).toString(), 301);

    // Only plain file names; nothing that could climb out of /public.
    if (!/^\/[A-Za-z0-9._\/-]*$/.test(path) || path.includes("..")) {
      return Response.redirect(new URL("/", url).toString(), 302);
    }

    let file = path === "/" ? "/index.html" : path;
    let ext = file.includes(".") ? file.split(".").pop().toLowerCase() : "";
    if (!ext) { file += ".html"; ext = "html"; }
    const type = TYPES[ext];
    if (!type) return Response.redirect(new URL("/", url).toString(), 302);

    const upstream = await fetch(SOURCE + file, { cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true } });
    if (!upstream.ok) {
      if (path === "/") return new Response("Back soon.", { status: 503, headers: { "Content-Type": TYPES.txt } });
      return Response.redirect(new URL("/", url).toString(), 302);
    }

    return new Response(request.method === "HEAD" ? null : upstream.body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  },
};
