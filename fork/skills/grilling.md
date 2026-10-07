---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round. Then wait for the user's answers before the next round.

## How to ask a round

**Call Cursor's `AskQuestion` tool.** That is the round. Do not print ❓ or ➡️ markdown into the chat. Those icons are the upstream format this fork replaces.

One `AskQuestion` call is one round:

- Optional `title`: a short round name (`Round 2`, or the theme of this frontier).
- Each frontier question is one item: unique `id` (`q1`, `q2`, ...), a `prompt` (title plus body), and at least two `options` (each with `id` and `label`).
- Put your recommended option first. Prefix its `label` with `(Recommended)`.
- Word the `prompt` so picking that recommended option is the "yes".
- Cursor's picker has no free-text box beside the chips. Always include a last option with `id` `other` and label `Something else (I'll reply in chat)`.
- Set `allow_multiple` to true only when several options can apply at once. Leave it off for a single decision.

If the frontier is wider than the tool will accept in one call, split into back-to-back `AskQuestion` calls. They are still one round: do not recompute the frontier until every question in this frontier has an answer.

When the tool returns, continue in the same turn from those answers. Do not reprint the round as markdown.

## If `AskQuestion` is not in your tool list

Some sessions do not attach the picker (some models, some cloud agents). Then, and only then, ask in the reply itself and wait. Number the questions. Put the recommended answer under each one. Do not use ❓ or ➡️. Do not claim you used the picker.

```
**Q1. <question title>**: <body>

Recommended: <your recommended answer>

---

**Q2. <question title>**: <body>

Recommended: <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

## After answers

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
