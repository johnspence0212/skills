---
name: setup-john-skills
description: "Configure a repo for this fork of the skills: issue tracker, triage labels, and domain doc layout. Run once per consumer repo."
disable-model-invocation: true
---

# Setup John Skills

You are the **consumer setup** for this fork (`johnspence-skills`). The user ran `/setup-john-skills`. Do not tell them to run `/setup-matt-pocock-skills`. You are already doing that job.

## Load the procedure

Find the sibling skill directory named `setup-matt-pocock-skills` (same skills tree as this folder). Read its `SKILL.md` and follow that procedure exactly, including its seed templates (`issue-tracker-github.md`, `issue-tracker-gitlab.md`, `issue-tracker-local.md`, `triage-labels.md`, `domain.md`).

If that directory is missing, stop and tell the user to install the full set from `johnspence0212/skills` (this wrapper needs those procedure files). Do not invent a tracker layout.

## Overrides

While following that procedure:

- Present the work as configuring **this fork**, not "Matt Pocock's Skills".
- If you mention the setup command in `CLAUDE.md` / `AGENTS.md` or in the closing recap, name `/setup-john-skills`.
- If another skill would have told the user to run `/setup-matt-pocock-skills`, that means this skill.

The issue tracker, triage labels, and domain-doc files you write are the same artifacts the engineering skills already know how to read.
