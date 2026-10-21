# Ouroboros documentation site

This is a dependency-free static handbook for the current Ouroboros development checkout. It includes a guided language manual, systems-programming and engine guides, compatibility notes, and a searchable builtin index.

## View locally

Open `index.html` in a browser. For consistent local behavior, serve this folder over HTTP:

```sh
python -m http.server 8000 --directory docs
```

Then visit <http://localhost:8000>. No package installation or build step is required.

## Host it

Publish the contents of `docs/` as the root of any static-file host. Keep `index.html`, `styles.css`, `app.js`, `content.js`, `reference.js` and the logo files (`logo.png` full size, `logo-320.png` hero, `logo-64.png` header and favicon) together. The site does not call external services.

## Finding your way

- The sidebar groups collapse; `/` focuses the page filter, which also matches section headings.
- `Ctrl K` searches pages, sections and builtins; `[` and `]` step to the previous / next page.
- "Which form should I use?" compares the alternatives the language offers, and most guide pages open with a "When to use it" box.
- "Feature index (A–Z)" lists every construct with its status and guide page; "Builtin API index" lists every builtin.

## Editing

Pages live in `content.js` (`add(id, group, title, description, sections)`). Helpers: `code()`, `table()`, `note()`, `choose(use, other)` for the use / avoid boxes, and `pick(rows)` for decision tables. "When to use it" boxes are in the `WHEN` map near the end of the file, and feature-index rows in `FEATURES`. Builtins live in `reference.js`.

The API index is maintained against the compiler builtin/checker tables, engine ABI catalog, and optional PhysX catalog. Because Ouroboros is experimental, check the linked backend and compatibility notes before relying on an entry in production code.
