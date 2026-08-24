# builtwithjon.com

Personal site for Jonathan Malkin. AI builder, solo founder.

Built with [Astro](https://astro.build) v6. Hosted on Cloudflare Workers as `jonathanmalkin-site`. Zero JavaScript by default.

## Local Preview

From this repo:

```bash
npm run build
npm run preview
```

## Deploy

Live deploys require both steps:

```bash
git push origin main
npm run build
find dist -name .DS_Store -delete
wrangler deploy
```

Do not pass `--assets` or `--name`. `wrangler.jsonc` owns the Worker and asset
routing, including `run_worker_first` for the MCP endpoint. CLI asset flags can
replace that configuration and cause static assets to intercept `POST /mcp`.

In the broader `Active-Work` workspace, use `Scripts/deploy-website.sh` to run the push, build, cleanup, and Wrangler deploy sequence.

GitHub push alone does not publish the live site.

## IndexNow

After a deploy that changes one or more canonical, indexable pages, notify
IndexNow with only those URLs:

```bash
npm run indexnow:submit -- https://builtwithjon.com/articles/example/
```

The script verifies that the deployed key file is live before it submits. Preview
the exact bounded payload without any network call with:

```bash
npm run indexnow:submit -- --dry-run https://builtwithjon.com/articles/example/
```

It rejects other origins, query strings/fragments, and noindex/private routes.
HTTP 200 means IndexNow received the notification; HTTP 202 means it received it
and key validation is pending. Neither response guarantees that a search engine
will index the URL.

## See Also

- [Jules](https://github.com/jonathanmalkin/jules) — the Claude Code system that runs the business
- [builtwithjon.com](https://builtwithjon.com) — the live site

<!-- build trigger -->
