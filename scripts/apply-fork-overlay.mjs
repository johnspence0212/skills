#!/usr/bin/env node
// Re-applies this fork's identity on top of stock upstream files.
// With --check it changes nothing and exits 1 if any managed file is stale.
//
// After `git merge upstream/main`, take upstream on managed files if they
// conflict, then run this. See FORK.md.

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const cfg = JSON.parse(readFileSync(join(repo, "fork/config.json"), "utf8"));

function interpolate(str) {
  return str.replace(/\{\{([a-zA-Z0-9.]+)\}\}/g, (_, path) => {
    const val = path.split(".").reduce((o, k) => o?.[k], cfg);
    if (val == null) {
      throw new Error(`fork/config.json is missing ${path}`);
    }
    return String(val);
  });
}

function readSnippet(name) {
  return interpolate(readFileSync(join(repo, "fork", name), "utf8"));
}

function replaceMarked(source, begin, end, inner) {
  const block = `${begin}\n${inner.trim()}\n${end}`;
  const start = source.indexOf(begin);
  const stop = source.indexOf(end);
  if (start !== -1 && stop !== -1 && stop > start) {
    return source.slice(0, start) + block + source.slice(stop + end.length);
  }
  return null;
}

function personalSkillPaths() {
  const dir = join(repo, "skills/personal");
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries
    .filter((name) => {
      try {
        return statSync(join(dir, name, "SKILL.md")).isFile();
      } catch {
        return false;
      }
    })
    .sort()
    .map((name) => `./skills/personal/${name}`);
}

function jsonWithNewline(obj) {
  return `${JSON.stringify(obj, null, 2)}\n`;
}

function overlayPackageJson(source) {
  const pkg = JSON.parse(source);
  pkg.name = cfg.packageName;
  pkg.description = cfg.description;
  pkg.repository = { ...(pkg.repository ?? {}), type: "git", url: cfg.repository };
  pkg.scripts = { ...(pkg.scripts ?? {}), ...cfg.packageScripts };
  return jsonWithNewline(pkg);
}

function overlayPluginJson(source) {
  const plugin = JSON.parse(source);
  plugin.name = cfg.pluginName;
  plugin.description = cfg.pluginDescription;
  plugin.author = { name: cfg.author.name, url: cfg.author.url };
  plugin.homepage = cfg.homepage;
  plugin.repository = cfg.repository;
  const upstreamSkills = (plugin.skills ?? []).filter(
    (p) => !String(p).includes("/personal/"),
  );
  plugin.skills = [...upstreamSkills, ...personalSkillPaths()];
  return jsonWithNewline(plugin);
}

function overlayMarketplaceJson(source) {
  const market = JSON.parse(source);
  market.name = cfg.marketplaceName;
  market.owner = { name: cfg.author.name, url: cfg.author.url };
  market.description = cfg.description;
  if (Array.isArray(market.plugins) && market.plugins[0]) {
    market.plugins[0].name = cfg.pluginName;
    market.plugins[0].description = cfg.pluginDescription;
  }
  return jsonWithNewline(market);
}

function overlayReadme(source) {
  const bannerInner = readSnippet("readme-banner.md")
    .replace("<!-- FORK-BANNER-BEGIN -->", "")
    .replace("<!-- FORK-BANNER-END -->", "")
    .trim();
  const installInner = readSnippet("readme-install.md").trim();

  let next = replaceMarked(
    source,
    "<!-- FORK-BANNER-BEGIN -->",
    "<!-- FORK-BANNER-END -->",
    bannerInner,
  );
  if (!next) {
    next = `<!-- FORK-BANNER-BEGIN -->\n${bannerInner}\n<!-- FORK-BANNER-END -->\n\n${source}`;
  }

  const markedInstall = replaceMarked(
    next,
    "<!-- FORK-INSTALL-BEGIN -->",
    "<!-- FORK-INSTALL-END -->",
    installInner,
  );
  if (markedInstall) {
    next = markedInstall;
  } else {
    const start = next.indexOf("## Installation");
    const stop = next.indexOf("## Why These Skills Exist");
    if (start === -1 || stop === -1) {
      throw new Error(
        "README.md is missing '## Installation' or '## Why These Skills Exist'; cannot overlay the install section.",
      );
    }
    next = `${next.slice(0, start)}<!-- FORK-INSTALL-BEGIN -->\n${installInner}\n<!-- FORK-INSTALL-END -->\n\n${next.slice(stop)}`;
  }

  const endMarker = "<!-- FORK-INSTALL-END -->";
  const endIdx = next.indexOf(endMarker);
  const whyIdx = next.indexOf("\n## Why These Skills Exist", endIdx);
  if (endIdx !== -1 && whyIdx !== -1) {
    next = `${next.slice(0, endIdx + endMarker.length)}\n${next.slice(whyIdx)}`;
  }

  next = next.replace(
    /^- \*\*\[setup-matt-pocock-skills\]\(\.\/skills\/engineering\/setup-matt-pocock-skills\/SKILL\.md\)\*\*:.*$/m,
    `- **[${cfg.setupSkill}](./skills/personal/${cfg.setupSkill}/SKILL.md)**: Configure a consumer repo for these skills (issue tracker, triage labels, domain doc layout). Run once per repo. The upstream \`setup-matt-pocock-skills\` folder is the procedure it follows, not the command you type.`,
  );

  return next.endsWith("\n") ? next : `${next}\n`;
}

function overlayClaudeMd(source) {
  const inner = readSnippet("claude-section.md")
    .replace("<!-- FORK-SECTION-BEGIN -->", "")
    .replace("<!-- FORK-SECTION-END -->", "")
    .trim();
  const marked = replaceMarked(
    source,
    "<!-- FORK-SECTION-BEGIN -->",
    "<!-- FORK-SECTION-END -->",
    inner,
  );
  if (marked) {
    return marked.endsWith("\n") ? marked : `${marked}\n`;
  }
  const trimmed = source.endsWith("\n") ? source.slice(0, -1) : source;
  return `${trimmed}\n\n<!-- FORK-SECTION-BEGIN -->\n${inner}\n<!-- FORK-SECTION-END -->\n`;
}

function overlayCopied(snippetRel) {
  const text = readSnippet(snippetRel);
  return text.endsWith("\n") ? text : `${text}\n`;
}

function overlayTextReplacements(source, rel) {
  let next = source;
  for (const rule of cfg.textReplacements ?? []) {
    if (!(rule.files ?? []).includes(rel)) {
      continue;
    }
    next = next.replaceAll(rule.from, interpolate(rule.to));
  }
  return next;
}

function isReplacementFile(rel) {
  return (cfg.textReplacements ?? []).some((rule) =>
    (rule.files ?? []).includes(rel),
  );
}

const overlays = {
  "package.json": overlayPackageJson,
  ".claude-plugin/plugin.json": overlayPluginJson,
  ".claude-plugin/marketplace.json": overlayMarketplaceJson,
  "README.md": overlayReadme,
  "CLAUDE.md": overlayClaudeMd,
};

let stale = 0;
for (const rel of cfg.managedFiles) {
  const copiedFrom = cfg.copiedFiles?.[rel];
  let overlay;
  if (copiedFrom) {
    overlay = () => overlayCopied(copiedFrom);
  } else if (overlays[rel]) {
    overlay = overlays[rel];
  } else if (isReplacementFile(rel)) {
    overlay = (source) => overlayTextReplacements(source, rel);
  }
  if (!overlay) {
    throw new Error(`No overlay implementation for managed file ${rel}`);
  }
  const abs = join(repo, rel);
  const current = readFileSync(abs, "utf8");
  const desired = overlay(current);
  if (current === desired) {
    continue;
  }
  if (check) {
    console.error(`stale overlay: ${rel}`);
    stale += 1;
    continue;
  }
  writeFileSync(abs, desired);
  console.log(`applied overlay: ${rel}`);
}

if (check) {
  if (stale > 0) {
    console.error(
      `${stale} managed file(s) stale. Run \`node scripts/apply-fork-overlay.mjs\`.`,
    );
    process.exit(1);
  }
  console.log("fork overlay is up to date");
  process.exit(0);
}
