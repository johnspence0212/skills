# Issue tracker: Nonlinear

Issues, specs, maps, and plans for this repo live in **Nonlinear**. Use the Cursor MCP server `nonlinear` (config key `nonlinear`, often `http://localhost:3333/mcp`). This is not Linear.app. Do not use the `Linear` MCP namespace.

Identity is the numeric `id`. Display names (NL-12, P-8, B-1) are for humans. In tool calls, pass the integer. In anything the human reads, refer to tickets **by title**.

If the `nonlinear` MCP server is not in this session's tool list, stop and say so. Do not fall back to `gh`, GitLab, or Linear.app.

## Conventions

Call MCP server `nonlinear`. Discover a tool's schema before the first call if the harness requires it.

- **Create an issue**: `create_issue` with `{ "title": "...", "body": "...", "labels": [...], "parentId": <int>, "projectId": <int> }`. `parentId` nests under a map or plan. `projectId` attaches to a Project (`P-N`). They are different axes. Creating a map does not create a Project.
- **Read an issue**: `get_issue` with `{ "id": <int> }`. Returns body, comments, parent, children, blockers, blocks, blockedBy, frontier, blocked, openBlockers.
- **List issues**: `list_issues` with filters such as `{ "state": "open", "labels": ["needs-triage"], "parentId": <int>, "assignee": "unassigned", "query": "P-8" }`. `labels` is AND. `assignee: "unassigned"` means unclaimed. `{ "frontier": true }` is the takeable set.
- **Make a child of a parent**: set `parentId` on `create_issue`, or `update_issue` `{ "id": <child>, "parentId": <parent> }`. Detach with `{ "id": <child>, "clearParent": true }`. A markdown `## Parent` line does not nest anything.
- **Comment**: `add_comment` `{ "id": <int>, "body": "...", "author": "cursor" }`.
- **Apply a label (append)**: `add_label` `{ "id": <int>, "label": "needs-triage" }`. Preferred. `update_issue` with `labels` replaces the whole set (destructive).
- **Close**: `update_issue` `{ "id": <int>, "state": "closed" }`. For a wayfinder ticket, prefer `resolve_issue` (comment plus close).
- **Blocked by**: `set_blocked_by` `{ "id": <child>, "issueIds": [<blocker>, ...] }`. This **replaces** the whole set. Clear with `"issueIds": []`. Create tickets first, then wire blockers (you need ids). Unblocked when every blocker is `state: "closed"`.

Issue `state` is only `open` or `closed`. Triage is labels, not workflow states. Do not invent Linear-style Backlog / Todo / In Progress.

## Pull requests as a triage surface

**PRs as a request surface: no.** Nonlinear is not GitHub. `/triage` does not ingest pull requests.

## When a skill says "publish to the issue tracker"

`create_issue`. Apply triage labels with `add_label` (or `labels` on create). Specs from `/to-spec` get `ready-for-agent`.

If a Nonlinear **plan** already exists for this effort, implementation tickets use `parentId` equal to that plan's numeric id, not the map's. If there is no plan, create a standalone issue (no `parentId` unless the user named a parent).

## When a skill says "fetch the relevant ticket"

`get_issue` with the numeric id. If the user said `NL-12` or a title, `list_issues` with `query` first, then `get_issue`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is one issue; its tickets are children via `parentId`.

- **Map**: `create_issue` `{ "title": "...", "labels": ["wayfinder:map"], "projectId": <optional P-id>, "body": "<Destination / Notes / Decisions so far / Fog>" }`. Nonlinear also has map lifecycle tools (`ready_for_spec`, `create_spec`, `advance_to_spec`, and so on). Those are not triage and are not required for `/wayfinder` to chart decisions. `/wayfinder` still treats the map as the decision index until the way is clear, then hands off to `/to-spec` unless the user asks to use Nonlinear's spec/plan pipeline.
- **Child ticket**: `create_issue` `{ "title": "<question>", "labels": ["wayfinder:<type>"], "parentId": <map-id> }` where type is `research` / `prototype` / `grilling` / `task`. Decision tickets parent to the **map**. Implementation tickets after a plan exists parent to the **plan** id. Do not parent implementation tickets to the map. Maps and decision tickets carry `wayfinder:*` labels, not triage labels.
- **Blocking**: `set_blocked_by` on the child after both ids exist. Native `blockedBy: number[]`. Do not treat a markdown Blocked-by line as the source of truth.
- **Frontier query**: prefer `list_frontier` `{ "parentId": <map-id> }`. Equivalent: open, unblocked, unassigned, not map/spec/plan. Also `list_issues` `{ "frontier": true }` or `{ "state": "open", "parentId": <map-id>, "assignee": "unassigned" }` then drop any with `openBlockers`.
- **Claim**: `claim_issue` `{ "id": <int> }` (defaults assignee to `"cursor"`). First write of the session. Unclaim: `update_issue` `{ "id": <int>, "assignee": "unassigned" }`.
- **Resolve**: `resolve_issue` `{ "id": <int>, "answer": "<decision>", "author": "cursor" }`, then gist plus link on the map's Decisions-so-far (`get_issue` the map, `update_issue` the body).

Do not call `wipe_db` from these skills.
