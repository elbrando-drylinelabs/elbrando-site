# elbrando.com

Brandon's personal site at **https://elbrando.com**, hosted on Cloudflare Workers (same setup as the Dryline Labs site).

Once the repo is connected to the `elbrando` Worker in Cloudflare (Workers & Pages → elbrando → Settings → Build → Connect), every change saved to `main` is published automatically within a minute or two. To undo a change, revert its commit on GitHub.

## What's where

| Path | What it is |
| --- | --- |
| `public/index.html` | Home page, with the list of recipes |
| `public/hot-toddy.html` | Hot Toddy recipe (served at `/hot-toddy`) |
| `public/favicon.svg` | Browser-tab icon |
| `src/index.js` | Small script that redirects www.elbrando.com to elbrando.com |
| `wrangler.jsonc` | Cloudflare settings: Worker name and domains |

## Adding a recipe

1. Copy `public/hot-toddy.html` to a new file, for example `public/old-fashioned.html` (served at `/old-fashioned`).
2. Change the title, description, ingredients and steps. Also update the `ld+json` block near the top, which is what Google uses for recipe results.
3. Add a link to it in the recipe list in `public/index.html`.
4. Commit to `main`.
