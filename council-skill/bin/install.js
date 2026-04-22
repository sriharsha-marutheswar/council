#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');

const HOME = os.homedir();
const SKILL_URL = 'https://raw.githubusercontent.com/sriharsha-marutheswar/council/main/skills/council/SKILL.md';
const BUNDLED_SKILL = path.join(__dirname, '..', 'assets', 'SKILL.md');

const PLATFORMS = {
  claude:   { name: 'Claude Code',       global: path.join(HOME, '.claude', 'skills', 'council'),              local: path.join('.claude', 'skills', 'council') },
  copilot:  { name: 'GitHub Copilot CLI', global: path.join(HOME, '.github', 'skills', 'council'),              local: path.join('.github', 'skills', 'council') },
  codex:    { name: 'OpenAI Codex',       global: path.join(HOME, '.codex', 'skills', 'council'),               local: path.join('.codex', 'skills', 'council') },
  cursor:   { name: 'Cursor',             global: path.join(HOME, '.cursor', 'skills', 'council'),              local: path.join('.cursor', 'skills', 'council') },
  gemini:   { name: 'Gemini CLI',         global: path.join(HOME, '.gemini', 'skills', 'council'),              local: path.join('.gemini', 'skills', 'council') },
  opencode: { name: 'OpenCode',           global: path.join(HOME, '.config', 'opencode', 'skills', 'council'), local: null },
  windsurf: { name: 'Windsurf',           global: path.join(HOME, '.windsurf', 'skills', 'council'),            local: path.join('.windsurf', 'skills', 'council') },
};

const HELP = `
council-skill — Install the Council skill for any AI coding agent

Usage:
  npx council-skill <platform> [options]

Platforms:
  --claude      Claude Code
  --copilot     GitHub Copilot CLI
  --codex       OpenAI Codex
  --cursor      Cursor
  --gemini      Gemini CLI
  --opencode    OpenCode
  --windsurf    Windsurf
  --all         All platforms (global only)

Options:
  --local       Install to current project instead of global directory
  --update      Fetch latest SKILL.md from GitHub and install
  --uninstall   Remove the installed skill
  --help        Show this help message

Examples:
  npx council-skill --claude
  npx council-skill --claude --local
  npx council-skill --claude --update
  npx council-skill --all
  npx council-skill --claude --uninstall
`.trim();

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = new Set();
  for (const arg of args) {
    if (arg.startsWith('--')) {
      flags.add(arg.slice(2));
    }
  }
  return flags;
}

function fetchSkill() {
  return new Promise((resolve, reject) => {
    const request = (url) => {
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch SKILL.md: HTTP ${res.statusCode}`));
          return;
        }
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve(data));
        res.on('error', reject);
      }).on('error', reject);
    };
    request(SKILL_URL);
  });
}

function installSkill(dir, content) {
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, 'SKILL.md');
  fs.writeFileSync(dest, content, 'utf8');
  return dest;
}

function uninstallSkill(dir) {
  const skillFile = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    return null;
  }
  fs.unlinkSync(skillFile);
  try {
    const remaining = fs.readdirSync(dir);
    if (remaining.length === 0) {
      fs.rmdirSync(dir);
    }
  } catch (_) {}
  return skillFile;
}

function getTargetDir(platform, isLocal) {
  if (isLocal) {
    if (!platform.local) {
      return null;
    }
    return path.resolve(process.cwd(), platform.local);
  }
  return platform.global;
}

async function main() {
  const flags = parseArgs(process.argv);

  if (flags.has('help') || flags.size === 0) {
    console.log(HELP);
    process.exit(0);
  }

  const isLocal = flags.has('local');
  const isUpdate = flags.has('update');
  const isUninstall = flags.has('uninstall');
  const isAll = flags.has('all');

  const platformKeys = isAll
    ? Object.keys(PLATFORMS)
    : Object.keys(PLATFORMS).filter((k) => flags.has(k));

  if (platformKeys.length === 0) {
    console.error('Error: No platform specified. Use --claude, --copilot, --codex, --cursor, --gemini, --opencode, --windsurf, or --all.');
    console.error('Run with --help for usage information.');
    process.exit(1);
  }

  if (isAll && isLocal) {
    console.error('Error: --all only supports global installation. Remove --local to continue.');
    process.exit(1);
  }

  if (isUninstall) {
    for (const key of platformKeys) {
      const platform = PLATFORMS[key];
      const dir = getTargetDir(platform, isLocal);
      if (!dir) {
        console.log(`  skip: ${platform.name} does not support local installation`);
        continue;
      }
      const removed = uninstallSkill(dir);
      if (removed) {
        console.log(`  done: Removed ${removed}`);
      } else {
        console.log(`  skip: ${platform.name} — not installed at ${dir}`);
      }
    }
    return;
  }

  let content;
  if (isUpdate) {
    console.log('Fetching latest SKILL.md from GitHub...');
    try {
      content = await fetchSkill();
      console.log('  done: Fetched latest version');
    } catch (err) {
      console.error(`  fail: ${err.message}`);
      process.exit(1);
    }
  } else {
    content = fs.readFileSync(BUNDLED_SKILL, 'utf8');
  }

  for (const key of platformKeys) {
    const platform = PLATFORMS[key];
    const dir = getTargetDir(platform, isLocal);
    if (!dir) {
      console.log(`  skip: ${platform.name} does not support --local`);
      continue;
    }
    try {
      const dest = installSkill(dir, content);
      console.log(`  done: ${platform.name} — ${dest}`);
    } catch (err) {
      console.error(`  fail: ${platform.name} — ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
