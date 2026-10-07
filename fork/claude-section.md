<!-- FORK-SECTION-BEGIN -->
## This fork

`skills/personal/` is a fork-only bucket. Upstream will never have it. Personal skills ship in this fork's plugin (the overlay appends them to `.claude-plugin/plugin.json`) and have no aihero.dev docs page. List them in `skills/personal/README.md` and keep `/ask-me` accurate.

Do not edit upstream skill files, `ask-matt`, or `SCOPE.md` to add personal behaviour. Put new skills in `skills/personal/`, update `/ask-me`, then run `node scripts/apply-fork-overlay.mjs`. The one upstream skill this fork overlays is `grilling`: edit `fork/skills/grilling.md`, not the copy under `skills/productivity/grilling/`.

After merging `upstream/main`, run `scripts/sync-upstream.sh` (it takes upstream on overlay-managed files and re-applies the overlay). See [FORK.md](./FORK.md) and [.agents/adr/0003-fork-overlay.md](./.agents/adr/0003-fork-overlay.md).
<!-- FORK-SECTION-END -->
