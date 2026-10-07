# The canonical install block (this fork)

One install story, one wording. Change it here first, then run `node scripts/apply-fork-overlay.mjs` so `.agents/install-block.md` and the README install section stay in sync.

This repo is a tracked fork of [mattpocock/skills](https://github.com/mattpocock/skills). It is **not** on Claude Code's official marketplace. The primary Claude route is this repo's own marketplace. **[skills.sh](https://skills.sh/{{githubRepo}})** copies editable skill files into a project from this GitHub repo.

## Claude Code: the plugin

<canonical-block name="claude-code">

```bash
claude plugin marketplace add {{githubRepo}}
claude plugin install {{pluginName}}@{{marketplaceName}}
```

Or, from inside a session:

```
/plugin marketplace add {{githubRepo}}
/plugin install {{pluginName}}@{{marketplaceName}}
```

This fork is its own marketplace, not Anthropic's official listing. Add the marketplace once, then install. Turn on auto-update for it under `/plugin` → Marketplaces if you want installs to follow this repo.

If you still have the upstream plugin installed, uninstall it first so you do not end up with every skill twice:

```bash
claude plugin uninstall {{upstream.pluginName}}@claude-plugins-official
```

</canonical-block>

## Codex, and other agents: skills.sh

The plugin is Claude Code only. Everywhere else, skills.sh copies editable skill files into the project. Use the whole-set form on `README.md`:

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add {{githubRepo}}
```

Pick the skills you want, and which coding agents to install them on. **The installer lets you choose which skills to take: make sure `setup-matt-pocock-skills` is one of them.** That setup skill is still named as upstream named it, so merges stay easy.

</canonical-block>

…and the single-skill form wherever one skill is named on its own.

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add {{githubRepo}} --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling in all three.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice: always say "pick one".

## Not the install story

Upstream's official Anthropic marketplace listing still points at `mattpocock/skills`. Users of **this** fork should not install that listing if they want the personal skills and the fork overlay. `.claude-plugin/marketplace.json` is the primary Claude route here, not a fallback.
