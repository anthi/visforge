# DecisionVerse — Claude Code Index

DecisionVerse maps the intellectual landscape of decision making across fields, using SvelteKit + D3.js. Owner: Evanthia Dimara, Utrecht University.

**Tech stack:** SvelteKit · D3.js v7 · TypeScript · Vercel · GitHub
**Live URL:** https://decisionverse.vercel.app/
**Current phase:** 5–8 partially done — next priority: Phase 5 full dataset rebuild (300 pubs, 3-axis ontology)

---

## Companion files — read when relevant

| File | Read when... |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Working on any code — layout engine, components, design decisions, build phases |
| [DATASET.md](DATASET.md) | Working on data models, mock dataset, taxonomy, or Zotero integration |
| [VISION.md](VISION.md) | Making architectural choices that affect the intellectual argument of the tool |

---

## Key implementation notes

- **Routes:** App served at `/` (root). No `/euler` path. `src/routes/+page.svelte` is the entry point.
- **SSR:** Disabled globally via `src/routes/+layout.ts` (`export const ssr = false`). Required because D3 force simulation is browser-only.
- **Terminology:** `fields` (Layer 1), `subfields` (Layer 2), `applications` (Layer 3) — never "disciplines" or "domains" anywhere in code or docs.
- **Author data:** Derived at runtime from `filteredPublications` via `deriveAuthors()` in `src/lib/data/authors.ts`. No separate author data file.
- **Venue filter:** Exclusion-set semantics — empty set = show all = all checked in UI.
- **Worktree:** Active development branch is `claude/epic-shannon-3e4db4`, always pushed to `main` via `git push origin claude/epic-shannon-3e4db4:main`.
