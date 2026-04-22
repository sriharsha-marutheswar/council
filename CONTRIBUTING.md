# Contributing to Council

Thanks for your interest in contributing! Here's how to get involved.

## Ways to Contribute

- **Report bugs** — Open an [issue](https://github.com/sriharsha-marutheswar/council/issues) using the bug report template
- **Suggest features** — Open an [issue](https://github.com/sriharsha-marutheswar/council/issues) using the feature request template
- **Submit a fix or improvement** — Fork, branch, and open a pull request

## Pull Request Workflow

1. Fork the repository
2. Create a feature branch from `main` (`git checkout -b feat/your-change`)
3. Make your changes
4. Test locally: run the skill with your AI coding agent to verify behavior
5. Commit with a clear message (`feat:`, `fix:`, `docs:` prefixes preferred)
6. Push and open a pull request against `main`

## What Makes a Good PR

- **Small and focused** — One concern per PR
- **Tested** — Describe how you verified the change works
- **Clear description** — Explain what changed and why

## Local Development

The skill file lives at `skills/council/SKILL.md`. To test changes:

```bash
# Copy to your agent's skill directory (example: Claude Code)
cp skills/council/SKILL.md ~/.claude/skills/council/SKILL.md

# Then trigger the council in your agent and verify behavior
```

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Questions?

Open a [discussion](https://github.com/sriharsha-marutheswar/council/discussions) — don't use issues for general questions.
