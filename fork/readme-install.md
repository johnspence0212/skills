## Installation (30-second setup)

Two ways in, two philosophies. **The [Claude Code plugin](https://code.claude.com/docs/en/plugins)** from this fork is a marketplace you add yourself (this repo is not on Anthropic's official listing). **skills.sh** copies editable skill files into your project from [{{githubRepo}}](https://github.com/{{githubRepo}}). Pick one: installing both leaves you with every skill twice.

### 1. Get the skills

<details>
<summary><strong>Claude Code</strong></summary>

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

</details>

<details>
<summary><strong>Codex, and other agents</strong></summary>

```bash
npx skills@latest add {{githubRepo}}
```

Pick the skills you want, and which coding agents to install them on. **The installer lets you choose which skills to take, so make sure `setup-john-skills` is one of them.** If the installer lists skills individually, also take `setup-matt-pocock-skills`: that folder is the procedure `/setup-john-skills` follows, not the command you type.

A native Codex plugin is on the roadmap in upstream (see [`.agents/adr/0002-ship-as-a-claude-code-plugin.md`](./.agents/adr/0002-ship-as-a-claude-code-plugin.md)).

</details>

<details>
<summary><strong>For tinkerers</strong></summary>

Use the same installer, on any agent, including Claude Code:

```bash
npx skills@latest add {{githubRepo}}
```

It writes the skills into your repo as ordinary files you own and can edit. Pull this fork when you want its latest, and run `scripts/sync-upstream.sh` in **this** repo when you want Matt's latest folded in (see [FORK.md](./FORK.md)).

</details>

### 2. Run `/setup-john-skills`

In your agent, in the **consumer** repo (the project you are building, not the catalog), run it once. It will:

- Recommend **Nonlinear** as the issue tracker (say yes, or pick GitHub / GitLab / local / other)
- Ask you what labels you apply to tickets when you triage them (`/triage` uses labels)
- Write the tracker runbook under `docs/agents/` (the only files setup should add). On Nonlinear, later research and similar notes are issue comments, not repo files.

That is this fork's setup command. Do not type `/setup-matt-pocock-skills`.

### 3. Bam - you're ready to go.
