# Fork overlay: identity and personal skills without rewriting upstream files

This repo is a tracked fork of `mattpocock/skills`. The goal is to wear a local identity (plugin name, author, install URLs, extra skills) while still merging `upstream/main` as a routine operation.

## Constraint

Almost every interesting improvement in this catalog is an edit to a `SKILL.md`, a docs page, `ask-matt`, or the README. A fork that rewrites those in place will fight every upstream pull. Renaming `setup-matt-pocock-skills` or `ask-matt` is the same class of mistake: the next upstream commit to that path is a rename-plus-edit conflict.

Installers nevertheless have to read a handful of identity files (`package.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, the README install story). Those cannot stay Matt's if this GitHub repo is the thing you install.

## Decision

Keep a **declarative overlay** in `fork/`:

- `fork/config.json` is the identity (names, URLs, extra npm scripts).
- Snippets next to it own the README banner, the install section, the CLAUDE.md fork addendum, and the install-block copy.
- `skills/personal/` is the only bucket this fork adds. Upstream will never have it, so it never conflicts. `scripts/link-skills.sh` already picks it up (it skips only `deprecated/` and `misc/`).
- `scripts/apply-fork-overlay.mjs` paints identity onto the managed files. It is idempotent. `--check` is what CI runs.
- `scripts/sync-upstream.sh` merges `upstream/main`, and on conflict **takes upstream** on managed files, then re-runs the overlay.

`ask-matt` is not patched. Personal routing lives in `/ask-me`. User-invoked skills cannot call each other; `/ask-me` tells the human to type `/ask-matt` for the upstream map.

The Claude plugin for this fork ships the full upstream promoted set **plus** every `skills/personal/*/SKILL.md`. Personal skills get no aihero.dev docs page.

## Why not the alternatives

- **Rewrite README and skills in place.** Maximum "this is mine", maximum merge pain. Rejected.
- **Subtree or vendor copy under `vendor/`.** Makes the overlay unnecessary, but also makes the plugin paths and `npx skills add` layout a second tree to teach. Rejected while the fork is still "Matt's catalog plus extras".
- **git merge ours on identity files.** Drops upstream's new promoted skills and version bumps. The overlay's "take theirs, then patch" keeps those.
- **A `personal/` bucket inside `engineering/`.** Contaminates the promoted merge surface and forces `ask-matt` / docs / plugin edits for every new skill.

## Invariants

- Do not rename or edit upstream skills to add fork behaviour.
- New daily-driver skills this fork owns go in `skills/personal/`, and `/ask-me` must mention them.
- Overlay-managed files are listed once, in `fork/config.json`. Adding a new managed file is a deliberate expansion of the conflict surface.
- After every overlay change, `node scripts/apply-fork-overlay.mjs --check` is clean.
