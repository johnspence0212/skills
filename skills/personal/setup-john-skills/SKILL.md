---
name: setup-john-skills
description: "Configure a repo for this fork of the skills: issue tracker, triage labels, and domain doc layout. Run once per consumer repo."
disable-model-invocation: true
---

# Setup John Skills

You are the **consumer setup** for this fork (`johnspence-skills`). The user ran `/setup-john-skills`. Do not tell them to run `/setup-matt-pocock-skills`. You are already doing that job.

## Load the procedure

Find the sibling skill directory named `setup-matt-pocock-skills` (same skills tree as this folder). Read its `SKILL.md` and follow that procedure, including its seed templates, **except where Overrides below replace a section**.

If that directory is missing, stop and tell the user to install the full set from `johnspence0212/skills` (this wrapper needs those procedure files). Do not invent a tracker layout.

This skill's own folder (the directory that contains this `SKILL.md`) holds the Nonlinear seeds: `issue-tracker-nonlinear.md`, `triage-labels-nonlinear.md`, and `domain-nonlinear.md`.

## Overrides

While following the procedure:

- Present the work as configuring **this fork**, not "Matt Pocock's Skills".
- If you mention the setup command in `CLAUDE.md` / `AGENTS.md` or in the closing recap, name `/setup-john-skills`.
- If another skill would have told the user to run `/setup-matt-pocock-skills`, that means this skill.

### Section A: Issue tracker (default Nonlinear)

Do **not** lead with GitHub just because `git remote` is GitHub.

Recommended answer: **Nonlinear** (Cursor MCP server `nonlinear`). One question, recommended yes:

> Use Nonlinear as the issue tracker? (recommended: **yes**)

**If yes** (including a bare "yes"):

- Write `docs/agents/issue-tracker.md` by copying `issue-tracker-nonlinear.md` from this skill folder. Do not draft Nonlinear from memory.
- Skip the GitHub, GitLab, and local-markdown templates.
- Do not ask them to describe Nonlinear.
- For Section B (triage labels), if `triage` is installed: recommend the defaults (they match Nonlinear). Write `docs/agents/triage-labels.md` from `triage-labels-nonlinear.md` in this skill folder, not from the upstream GitHub-oriented seed.
- After writing those files, if the `nonlinear` MCP is available, call `create_label` once per seed label (idempotent): `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`, `wayfinder:map`, `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, `wayfinder:task`. Do not run `gh label create`.
- If the MCP is not attached this session, still write the markdown files, then tell the user labels were not seeded and they should run setup again with Nonlinear connected, or create those labels themselves.
- Section C (domain docs): do **not** follow upstream's "write a single-context glossary layout and let `/domain-modeling` create files lazily". Write `docs/agents/domain.md` from `domain-nonlinear.md` in this skill folder. Do not create `GLOSSARY.md`, `GLOSSARY-MAP.md`, or `docs/adr/`. Do not ask where to save docs we create: research and similar notes go on Nonlinear, not into git.
- The `## Agent skills` / Issue tracker one-liner should say issues live in Nonlinear via the `nonlinear` MCP. See `docs/agents/issue-tracker.md`.
- The Domain docs one-liner should say glossary and ADR files are off unless the user asks; terms persist as Nonlinear comments. See `docs/agents/domain.md`.

**If no**: drop this override (tracker seed, triage seed, domain seed, and the Section C bullets above). Follow upstream Section A and Section C exactly (GitHub, GitLab, local markdown, or Other).

### Removable

The Nonlinear default is only this folder: the Section A and Section C overrides in this file, plus `issue-tracker-nonlinear.md`, `triage-labels-nonlinear.md`, and `domain-nonlinear.md`. Upstream `setup-matt-pocock-skills` is untouched. To stop defaulting to Nonlinear, delete those three seeds and the Section A / Section C overrides; `/setup-john-skills` still runs and those sections fall through to upstream.
