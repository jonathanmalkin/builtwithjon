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

## See Also

- [Jules](https://github.com/jonathanmalkin/jules) — the Claude Code system that runs the business
- [builtwithjon.com](https://builtwithjon.com) — the live site

<!-- build trigger -->
