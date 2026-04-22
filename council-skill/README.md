# council-skill

Install the [Council](https://github.com/sriharsha-marutheswar/council) skill for any AI coding agent.

Council runs your question through 5 independent AI advisors who peer-review each other anonymously, then synthesizes a final verdict. Adapted from [Andrej Karpathy's LLM Council concept](https://github.com/karpathy), enhanced by [Ole Lehmann](https://x.com/itsolelehmann).

## Install

```bash
# Claude Code
npx council-skill --claude

# GitHub Copilot CLI
npx council-skill --copilot

# OpenAI Codex
npx council-skill --codex

# Cursor
npx council-skill --cursor

# Gemini CLI
npx council-skill --gemini

# Windsurf
npx council-skill --windsurf

# OpenCode
npx council-skill --opencode

# All platforms at once
npx council-skill --all
```

## Options

```
--local       Install to current project instead of global directory
--update      Fetch latest SKILL.md from GitHub
--uninstall   Remove the installed skill
--help        Show help
```

## Examples

```bash
# Install locally for this project only
npx council-skill --claude --local

# Update to latest version from GitHub
npx council-skill --claude --update

# Remove the skill
npx council-skill --claude --uninstall
```

## License

MIT
