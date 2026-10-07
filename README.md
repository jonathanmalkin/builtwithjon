# Open Door Learning

Website for Jonathan Malkin, AI educator and builder, working as Open Door Learning. Primary address: https://opendoorlearningai.com.

Built with [Astro](https://astro.build) v7. Hosted on Cloudflare Workers as `jonathanmalkin-site`. Zero JavaScript by default.

## Local Preview

From this repo:

```bash
npm run build
npm run preview
```

## Deploy

Publish committed changes from `main`:

```bash
git push origin main
npm run build
find dist -name .DS_Store -delete
wrangler deploy
```

Do not pass `--assets` or `--name`. `wrangler.jsonc` owns the Worker and asset
routing, including `run_worker_first` for API endpoints and retirement redirects. CLI asset flags can replace that configuration and intercept Worker routes.

In the broader `Active-Work` workspace, use `System/Scripts/deploy-website.sh` to run the push, build, cleanup, and Wrangler deploy sequence.

GitHub push alone does not publish the live site.

### Redirect worker and domain ownership

The wrapper deploys only `jonathanmalkin-site`, which owns opendoorlearningai.com. `builtwithjon-redirect` owns builtwithjon.com and www.opendoorlearningai.com and passes legacy `/api/*` requests to the site worker. For a reviewed redirect-worker change, load the same Keychain credentials as the deploy skill, then run from this repo:

```bash
(cd redirect-worker && ../node_modules/.bin/wrangler deploy)
```

Keep each worker's custom domains in its own `wrangler.jsonc`. A site deployment removes domains absent from that config. For a future domain transfer, prepare the receiving worker first, then deploy it immediately after the relinquishing worker. Do not remove the old domain or its Google Workspace inbox.

Google Workspace uses builtwithjon.com as its primary domain and opendoorlearningai.com as a user alias domain. The visible contact address and site Sender address are jonathan@opendoorlearningai.com. Gmail Send mail as is verified; changing the Gmail default needs Jonathan's approval.

## IndexNow

After a deploy that changes one or more canonical, indexable pages, notify
IndexNow with only those URLs:

```bash
npm run indexnow:submit -- https://opendoorlearningai.com/articles/example/
```

The script verifies that the deployed key file is live before it submits. Preview
the exact bounded payload without any network call with:

```bash
npm run indexnow:submit -- --dry-run https://opendoorlearningai.com/articles/example/
```

It rejects other origins, query strings/fragments, and noindex/private routes.
HTTP 200 means IndexNow received the notification; HTTP 202 means it received it
and key validation is pending. Neither response guarantees that a search engine
will index the URL.

## See Also

- [Jules](https://github.com/jonathanmalkin/jules) — the Claude Code system that runs the business
- [Open Door Learning](https://opendoorlearningai.com): the live site.
- [builtwithjon.com](https://builtwithjon.com): permanent redirect and working Google Workspace inbox.

<!-- build trigger -->
