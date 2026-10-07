# This fork

[johnspence0212/skills](https://github.com/johnspence0212/skills) tracks [mattpocock/skills](https://github.com/mattpocock/skills). The point is to make the catalog yours **without** editing Matt's skill files, so `git merge upstream/main` stays a fast-forward-plus-overlay, not a rewrite.

## The rule

Upstream-owned files stay stock. Fork identity and extras live in `fork/` and `skills/personal/`. A script paints the identity onto the few files an installer has to read (`package.json`, the Claude plugin manifests, the README install story). After every upstream merge, take their version of those files if they conflict, then re-run the overlay.

Do not:

- Rename upstream skills (`ask-matt`, `setup-matt-pocock-skills`, and the rest)
- Patch `ask-matt` so it knows about personal skills (update `/ask-me` instead)
- Put personal behaviour into `engineering/` or `productivity/` (those buckets are the merge surface), except the overlaid `grilling` copy described below
- Rewrite README philosophy text in place (the banner and install section are overlaid; the rest is upstream's)

## Pulling updates

```bash
scripts/sync-upstream.sh
```

That script:

1. Adds or updates the `upstream` remote to `https://github.com/mattpocock/skills.git`
2. Fetches and merges `upstream/main`
3. On conflict, takes **upstream** for overlay-managed files listed in `fork/config.json`
4. Runs `node scripts/apply-fork-overlay.mjs`
5. Commits the overlay if it changed anything

If something **outside** that list conflicts, the script stops and leaves those files for you. That is the signal you edited an upstream file you should not have, or upstream and this fork both added the same new path.

```bash
node scripts/apply-fork-overlay.mjs --check
```

Exits 1 when a managed file does not match what the overlay would write. CI runs this on every push.

## Making it more yours

| Want | Do this |
|---|---|
| A new skill you actually run | Add it under `skills/personal/<name>/` (`SKILL.md` plus `agents/openai.yaml`). Update [`skills/personal/ask-me/SKILL.md`](./skills/personal/ask-me/SKILL.md) and [`skills/personal/README.md`](./skills/personal/README.md). Run the overlay so the plugin list picks it up. |
| Different plugin name, author, or GitHub repo | Edit `fork/config.json` only, then run the overlay. |
| Different install wording | Edit `fork/install-block.md` and `fork/readme-install.md`, then run the overlay. |
| Change how grilling asks questions | Edit [`fork/skills/grilling.md`](./fork/skills/grilling.md), then run the overlay. Do not edit `skills/productivity/grilling/SKILL.md` by hand. |
| Drop or change an upstream skill | Do not delete it. Leave it stock so the next merge does not resurrect a fight. If you really do not want it in the plugin, that is a future overlay feature; today the plugin still ships the full upstream promoted set plus personal. |

`/setup-matt-pocock-skills` is still the per-repo setup skill. It can record Linear (or anything else) as a freeform tracker. Do not fork that skill to rename it.

## Overlay-managed files

These are the only upstream paths the overlay rewrites. They **will** conflict on some merges. That is expected, and the sync script's job:

- `package.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `README.md`
- `CLAUDE.md`
- `.agents/install-block.md`
- `skills/productivity/grilling/SKILL.md` (copied from `fork/skills/grilling.md`)

Everything else should merge as if this were not a fork.

`grilling` is the one upstream skill this fork rewrites, because Cursor's `AskQuestion` picker is the daily-driver win and upstream will not ship a harness-specific question UI. After a sync, skim `git show upstream/main:skills/productivity/grilling/SKILL.md` and port any new interview rules (frontier, facts vs decisions, confirmation gate) into `fork/skills/grilling.md`. Then re-run the overlay. Do not port the ❓ / ➡️ markdown format back in.

## Why not rewrite the skills in place

Every local edit to an upstream `SKILL.md` becomes a conflict the next time Matt changes that skill. The overlay exists so the files installers care about can wear your name, while the procedures you actually want updates for stay identical to upstream. `grilling` is the deliberate exception: the question UI is the point of using this fork in Cursor, so that one file is owned in `fork/` and re-copied on every sync.
