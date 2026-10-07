# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This repo tracks work in **Nonlinear**. Operational notes (research, terminology, decisions) live on Nonlinear issues as comments, not as files in git. See `docs/agents/issue-tracker.md` (**Artifacts**).

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root, if it exists, or
- **`GLOSSARY-MAP.md`** at the repo root if it exists: it points at one `GLOSSARY.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**, if it exists: read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist, **proceed silently**. Don't flag their absence. **Do not create them** unless the user explicitly asks for a glossary or an ADR. `/domain-modeling` still runs (challenge terms, invent scenarios, cross-check the code). Persist a term or a hard-to-reverse decision as a Nonlinear `add_comment` on the relevant issue when it must outlive the session.

If a `GLOSSARY.md` already exists, you may read it and challenge against it. Do not update it unless the user asks.

## File structure

The upstream layout, for when the user *does* ask to start a glossary or ADR set. Do not create this tree on your own.

Single-context repo (most repos):

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Multi-context repo (presence of `GLOSSARY-MAP.md` at the root):

```
/
├── GLOSSARY-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── GLOSSARY.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── GLOSSARY.md
        └── docs/adr/
```

## Use the glossary's vocabulary

When a `GLOSSARY.md` exists and your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined there. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's fine here: discuss it in the session, and comment it on the Nonlinear issue if it needs to stick. Do not treat a missing glossary as a reason to write one.

## Flag ADR conflicts

If a `docs/adr/` tree exists and your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
