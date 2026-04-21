# Council

Run decisions through 5 AI advisors with peer review and synthesis.

## How It Works

Council runs your question through a structured 3-round deliberation:

**Round 1 — Advisors:** 5 sub-agents analyze your question independently in parallel. Each uses a distinct thinking lens:

| # | Advisor | Role |
|---|---------|------|
| 1 | The Contrarian | Finds what's wrong, what will fail |
| 2 | The First Principles Thinker | Strips assumptions, rebuilds from ground up |
| 3 | The Expansionist | Finds hidden upside and opportunity |
| 4 | The Outsider | Fresh eyes, catches curse of knowledge |
| 5 | The Executor | What's the fastest path to doing it |

**Round 2 — Peer Review:** Each advisor's response is anonymized and cross-reviewed by all others.

**Round 3 — Chairman Synthesis:** One agent synthesizes everything into a verdict showing where advisors agree, clash, and what to do.

## Installation

**Claude Code:**

```bash
claude plugin marketplace add sriharsha-marutheswar/council
claude plugin install council
```

**Copilot CLI / Codex CLI (manual):**

```bash
# Copy the skill to your skills directory
git clone https://github.com/sriharsha-marutheswar/council.git
cp -r council/skills/council ~/.claude/skills/council
```

## Usage

**Trigger phrases:**

- `/council` (slash command)
- `council this`
- `run the council`
- `war room this`
- `pressure-test this`
- `stress-test this`
- `debate this`

**Example:**

```
> council this: I'm thinking of building a $297 course on Claude Code for beginners.
> My audience is mostly non-technical solopreneurs. Is this the right move?
```

## When to Use

The council is for decisions where being wrong is expensive. It spawns 11 sub-agents across 3 rounds — don't use it for trivial questions.

**Good for:** Strategic decisions, pricing, positioning, pivots, copy review, hire-vs-build decisions

**Not for:** Factual questions, creation tasks, summaries, trivial choices

## Output

Each session generates three files in `council-reports/`:

| File | Purpose |
|------|---------|
| `council-report-*.html` | Visual report — scannable in browser |
| `council-report-*.md` | Same report in markdown — for terminals, Obsidian, GitHub |
| `council-transcript-*.md` | Full raw transcript — all advisor responses, peer reviews, chairman synthesis |

## Credits

- **Andrej Karpathy** — Original LLM Council concept ([github.com/karpathy](https://github.com/karpathy))
- **Ole Lehmann** — Enhanced methodology with thinking styles and peer review ([x.com/itsolelehmann](https://x.com/itsolelehmann))

## License

MIT
