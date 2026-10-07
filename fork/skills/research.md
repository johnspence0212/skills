---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a cited Markdown document (on the issue tracker when that repo's tracker says so, otherwise as a file). Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings as a single Markdown document, citing each claim's source.
3. Read `docs/agents/issue-tracker.md` if it exists. If it has an **Artifacts** section, put the findings there. Do not write a research file, and do not create a `research/` branch, unless that section says to. If there is no tracker doc, or it is silent on artifacts, save the file where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
