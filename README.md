# Ouroboros documentation site

Dependency-free static handbook for the current Ouroboros checkout. Day-to-day compile/run is **Chimera** (`build/chimera`) with native `ouro-link` / `ouro-run`.

## View locally

Open `index.html` in a browser, or serve this folder with any static file server (for example `npx serve docs` or your editor’s live preview). Keep `index.html`, `styles.css`, `app.js`, `content.js`, `reference.js` and the logo files together. The site does not call external services.

## Self-host subset site

A parallel handbook for what **Chimera** can compile today lives in [`selfhost/`](selfhost/). Canonical markdown: [`SELF_HOST.md`](SELF_HOST.md). Open `/selfhost/` when serving `docs/`, or see [`selfhost/README.md`](selfhost/README.md).

## Finding your way

- The sidebar groups collapse; `/` focuses the page filter, which also matches section headings.
- `Ctrl K` searches pages, sections and builtins; `[` and `]` step to the previous / next page.
- "What’s new" and `SYNTAX_GRAPH.md` describe the graph-in-text dialect (`|>`, `||>`, `let`/`mut`, …).
- "Which form should I use?" is the short cheat-sheet while legacy spellings still parse; most guide pages open with a "When to use it" box.
- "Feature index (A–Z)" lists every construct with its status and guide page; "Builtin API index" lists every builtin.

## Editing

Pages live in `content.js` (`add(id, group, title, description, sections)`). Helpers: `code()`, `table()`, `note()`, `choose(use, other)` for the use / avoid boxes, and `pick(rows)` for decision tables. "When to use it" boxes are in the `WHEN` map near the end of the file, and feature-index rows in `FEATURES`. Builtins live in `reference.js`.

Because Ouroboros is experimental, check the linked Chimera / self-host notes before relying on a surface that is not in the freeze.
