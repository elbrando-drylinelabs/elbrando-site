# elbrando.com

Brandon's personal site at **https://elbrando.com**, served by the `elbrando` Cloudflare Worker.

The Worker reads the files in `public/` straight from the `main` branch of this repo, so **saving a change on GitHub is all it takes**. It shows up on the site within about 5 minutes (Cloudflare caches each page for 5 minutes). To undo a change, revert its commit.

Because the site reads from GitHub, this repo has to stay **public**. If it's ever made private, the site stops loading.

## What's where

| Path | What it is |
| --- | --- |
| `public/index.html` | Home page, with the list of recipes |
| `public/hot-toddy.html` | Hot Toddy recipe (served at `/hot-toddy`) |
| `public/harvest-punch.html` | Harvest Punch recipe (served at `/harvest-punch`), with its own cranberry color scheme |
| `public/harvest-daiquiri.html` | Forwards the old `/harvest-daiquiri` address to `/harvest-punch` |
| `public/favicon.svg` | Browser-tab icon for the home page |
| `public/favicon-hot-toddy.svg`, `public/favicon-harvest-punch.svg` | Browser-tab icons for each recipe page (each page's `rel="icon"` line points at its own) |
| `public/robots.txt` | Search-engine rules |
| `src/index.js` | The Worker: reads pages from GitHub, sends www to elbrando.com |
| `wrangler.jsonc` | Cloudflare settings: Worker name and domains |

Changing `src/index.js` itself does need a redeploy of the Worker (ask Claude).

## Adding a recipe

1. Copy `public/hot-toddy.html` to a new file, for example `public/old-fashioned.html` (served at `/old-fashioned`).
2. Change the title, description, ingredients and steps. Also update the `ld+json` block near the top, which is what Google uses for recipe results. In the "Share the recipe" script at the bottom, change `var title = "..."` to the new recipe's name (the link itself comes from the `canonical` tag, so update that too).
3. Add a link to it in the recipe list in `public/index.html`.
4. Commit to `main`.

Images: put them in `public/` (for example `public/img/hot-toddy.jpg`) and reference them as `/img/hot-toddy.jpg`. Supported: png, jpg, webp, svg.
