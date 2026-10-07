---
name: ask-me
description: Ask which personal (this-fork) skill fits. For Matt's catalog, type /ask-matt.
disable-model-invocation: true
---

# Ask Me

Router for **this fork's** skills in `skills/personal/`. It does not replace `/ask-matt`. That skill still maps the upstream catalog. Do not call `ask-matt` through the Skill tool: it is user-invoked, so only the human can fire it. Tell them to type `/ask-matt`.

## Personal skills

- **`/ask-me`**: this router.

When there is no personal skill for the job, say so. If the work is an upstream flow (grill, spec, tickets, implement, triage, architecture, and the rest), tell the user to type `/ask-matt`.

## Adding a personal skill

New daily-driver skills this fork owns go in `skills/personal/<name>/`, not in `engineering/` or `productivity/`. Update this list, update `skills/personal/README.md`, then run `node scripts/apply-fork-overlay.mjs` so the plugin ships the new path. The longer version is [FORK.md](../../../FORK.md).
