// Serves the former addresses (builtwithjon.com and the www form of the new
// domain). Every page request gets a permanent redirect to the same path on
// opendoorlearningai.com, so printed QR codes, slides and old links keep
// working. API posts are passed straight to the site worker instead, because
// a redirected POST from a page opened before the move would be lost.

const PRIMARY_ORIGIN = "https://opendoorlearningai.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return env.SITE.fetch(request);
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${PRIMARY_ORIGIN}${url.pathname}${url.search}`,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        "Strict-Transport-Security": "max-age=31536000",
      },
    });
  },
};
