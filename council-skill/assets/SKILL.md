---
name: council
description: "Run any question, idea, or decision through a council of 5 AI advisors who independently analyze it, peer-review each other anonymously, and synthesize a final verdict. MANDATORY TRIGGERS: '/council', 'council this', 'run the council', 'war room this', 'pressure-test this', 'stress-test this', 'debate this'. Do NOT trigger on simple yes/no questions, factual lookups, or creation tasks. Only trigger when the user presents a genuine decision with stakes and multiple angles worth exploring."
---

# Council

You ask one AI a question, you get one answer. That answer might be great or mid. No way to tell from one perspective.

The council fixes this. It runs the question through 5 independent advisors thinking from fundamentally different angles. They review each other's work anonymously. A chairman synthesizes everything into a final recommendation showing where advisors agree, clash, and what to actually do.

Adapted from Andrej Karpathy's LLM Council concept, enhanced by Ole Lehmann.

---

## When to Use

The council is for questions where being wrong is expensive. It spawns 11 sub-agents across 3 rounds — do not use for trivial questions.

### Good council questions

- "Should I launch a $97 workshop or a $497 course?"
- "Which of these 3 positioning angles is strongest?"
- "I'm thinking of pivoting from X to Y. Am I crazy?"
- "Here's my landing page copy. What's weak?"
- "Should I hire a VA or build an automation first?"

### Bad council questions

- "What's the capital of France?" (one right answer)
- "Write me a tweet" (creation task, not a decision)
- "Summarize this article" (processing task, not judgment)
- "Should I use tabs or spaces?" (trivial, no real stakes)

The council shines with genuine uncertainty and high cost of a bad call. If you already know the answer and want validation, the council will likely tell you things you don't want to hear. That's the point.

---

## The Five Advisors

Each advisor is a thinking lens, not a persona. They create natural tensions that surface blind spots.

### 1. The Contrarian

Actively looks for what's wrong, missing, what will fail. Assumes the idea has a fatal flaw and tries to find it. Not a pessimist — the friend who saves you from a bad deal by asking questions you're avoiding.

### 2. The First Principles Thinker

Ignores surface-level question, asks "what are we actually trying to solve?" Strips assumptions. Rebuilds from ground up. Sometimes the most valuable output is saying "you're asking the wrong question entirely."

### 3. The Expansionist

Looks for upside everyone else is missing. What could be bigger? What adjacent opportunity is hiding? Doesn't care about risk (that's the Contrarian's job). Cares about what happens if this works even better than expected.

### 4. The Outsider

Zero context about you, your field, or history. Responds purely to what's in front of them. Most underrated advisor. Experts develop blind spots. The Outsider catches the curse of knowledge.

### 5. The Executor

Only cares about: can this actually be done, and what's the fastest path? Ignores theory, strategy, big-picture. Looks through the lens of "OK but what do you do Monday morning?" If an idea sounds brilliant but has no clear first step, the Executor will say so.

### Why these five

Three natural tensions. Contrarian vs Expansionist (downside vs upside). First Principles vs Executor (rethink everything vs just do it). The Outsider sits in the middle keeping everyone honest.

---

## Model Configuration

The council uses a tiered model strategy to balance cost, speed, and quality across its 11 sub-agents. The defaults below are recommended but can be overridden per-council.

### Default Model Assignments

| Round | Agents | Model | Why |
|---|---|---|---|
| **Advisors** (Step 2) | 5 advisors | `sonnet` | Bounded 150-300 word analyses — Sonnet at max effort produces strong focused takes. Running 5 in parallel keeps cost and latency reasonable. |
| **Peer Reviewers** (Step 3) | 5 reviewers | `opus` | Reviewers must evaluate, compare, and find gaps across all 5 responses simultaneously. This cross-response judgment benefits from Opus-level reasoning. |
| **Chairman** (Step 4) | 1 chairman | `opus` | The synthesis is the highest-leverage output — it weighs all 10 prior responses, resolves conflicts, and produces the final recommendation. Always Opus. |

All agents run at **max reasoning effort** (the highest effort level supported by the model).

### Overriding Model Assignments

Users can request different model configurations when invoking the council:

- **"council this (all opus)"** — run all 11 agents on Opus. Higher cost, higher quality across the board.
- **"council this (all sonnet)"** — run all 11 agents on Sonnet. Lower cost, still effective for most questions.
- **"council this (advisors on opus)"** — upgrade advisors to Opus while keeping the default Opus reviewers/chairman.
- **"council this (reviewers on sonnet)"** — downgrade reviewers to Sonnet while keeping other defaults.

If no override is specified, use the defaults above. When spawning agents, always set the `model` parameter on the Agent tool call to the appropriate value.

---

## Process Flow

### Step 1: Frame the Question

When triggered, do two things before framing:

#### A. Scan workspace for context

Quick scan for relevant context files:

- CLAUDE.md / claude.md in project root (business context, preferences, constraints)
- Any memory/ folder (audience profiles, voice docs, business details, past decisions)
- Files the user explicitly referenced or attached
- Recent council transcripts in council-reports/ (avoid re-counciling same ground)
- Other relevant context files for the specific question

Use Glob and quick Read calls. Don't spend more than 30 seconds. Looking for 2-3 files that give advisors context for specific, grounded advice instead of generic takes.

#### B. Frame the question

Take user's raw question AND enriched context, reframe as clear neutral prompt for all five advisors. Include:

1. Core decision or question
2. Key context from user's message
3. Key context from workspace files (business stage, audience, constraints, past results, numbers)
4. What's at stake

No opinion injected. No steering. Make sure each advisor has enough context for specific, grounded answers.

If too vague ("council this: my business"), ask ONE clarifying question. Just one. Then proceed.

Save framed question for transcript.

---

### Step 2: Convene the Council (5 sub-agents in parallel)

Spawn all 5 simultaneously as sub-agents using the Agent tool. Each gets:

1. Their advisor identity and thinking style
2. The framed question
3. Instruction: respond independently, no hedging, no balancing, lean fully into assigned perspective

Each produces 150-300 words.

#### Sub-agent prompt template

```
You are [Advisor Name] on a Council.

Your thinking style: [advisor description from above]

A user has brought this question to the council:

---
[framed question]
---

Respond from your perspective. Be direct and specific. Don't hedge or try to be balanced. Lean fully into your assigned angle. The other advisors will cover the angles you're not covering.

Keep your response between 150-300 words. No preamble. Go straight into your analysis.
```

**Important:** Always spawn all 5 in parallel. Sequential wastes time and lets earlier responses bleed context.

**Model:** Use `sonnet` (or user override) with max reasoning effort. Set `model: "sonnet"` on each Agent tool call.

---

### Step 3: Peer Review (5 sub-agents in parallel)

Collect all 5 responses. Anonymize as Response A through E (randomize mapping, no positional bias).

Spawn 5 reviewer sub-agents in parallel. Each sees all 5 anonymized responses and answers:

1. Which response is the strongest and why? (pick one)
2. Which response has the biggest blind spot and what is it?
3. What did ALL responses miss?

#### Reviewer prompt template

```
You are reviewing the outputs of a Council. Five advisors independently answered this question:

---
[framed question]
---

Here are their anonymized responses:

**Response A:**
[response]

**Response B:**
[response]

**Response C:**
[response]

**Response D:**
[response]

**Response E:**
[response]

Answer these three questions. Be specific. Reference responses by letter.

1. Which response is the strongest? Why?
2. Which response has the biggest blind spot? What is it missing?
3. What did ALL five responses miss that the council should consider?

Keep your review under 200 words. Be direct.
```

**Important:** Always anonymize. If reviewers know which advisor said what, they defer to certain thinking styles instead of evaluating on merit.

**Model:** Use `opus` (or user override) with max reasoning effort. Set `model: "opus"` on each Agent tool call. Peer review requires cross-response comparison and gap detection — this benefits from stronger reasoning.

---

### Step 4: Chairman Synthesis

One agent gets everything: framed question, all 5 de-anonymized responses, all 5 peer reviews.

#### Chairman prompt template

```
You are the Chairman of a Council. Your job is to synthesize the work of 5 advisors and their peer reviews into a final verdict.

The question brought to the council:

---
[framed question]
---

ADVISOR RESPONSES:

**The Contrarian:**
[response]

**The First Principles Thinker:**
[response]

**The Expansionist:**
[response]

**The Outsider:**
[response]

**The Executor:**
[response]

PEER REVIEWS:

[all 5 peer reviews]

Produce the council verdict using this exact structure:

## Where the Council Agrees
[Points multiple advisors converged on independently. These are high-confidence signals.]

## Where the Council Clashes
[Genuine disagreements. Present both sides. Explain why reasonable advisors disagree.]

## Blind Spots the Council Caught
[Things that only emerged through peer review. Things individual advisors missed that others flagged.]

## The Recommendation
[A clear, direct recommendation. Not "it depends." A real answer with reasoning.]

## The One Thing to Do First
[A single concrete next step. Not a list. One thing.]

Be direct. Don't hedge. The whole point of the council is to give the user clarity they couldn't get from a single perspective.
```

Chairman can disagree with majority if reasoning supports it.

**Model:** Always use `opus` with max reasoning effort. Set `model: "opus"` on the Agent tool call. The chairman synthesis is the highest-leverage output — never downgrade this, even if the user requests "all sonnet" (warn them that chairman quality will suffer).

---

### Step 5: Generate the Council Report

Three files in council-reports/ (create dir if needed):

```
council-reports/
  council-report-YYYY-MM-DD-HHMMSS.html
  council-report-YYYY-MM-DD-HHMMSS.md
  council-transcript-YYYY-MM-DD-HHMMSS.md
```

#### HTML Report

Single self-contained HTML with inline CSS. Contents:

1. Question at top
2. Chairman's verdict prominently displayed
3. Agreement/disagreement visual — grid or spectrum showing advisor positions
4. Collapsible sections for each advisor's full response (collapsed by default)
5. Collapsible section for peer review highlights
6. Footer with timestamp

Styling: white background, subtle borders, system font stack, soft accent colors per advisor. Professional briefing document.

#### Markdown Report

Same content as HTML, formatted for terminals/Obsidian/GitHub. Uses standard markdown headers, blockquotes, and `<details>` sections.

#### Transcript

Complete raw record:

- Original question (as user asked it)
- Framed question (after context enrichment)
- All 5 advisor responses (labeled by name)
- Anonymization mapping (which advisor was which letter)
- All 5 peer reviews
- Chairman's full synthesis

#### After generating

1. Auto-open HTML: `open council-reports/council-report-YYYY-MM-DD-HHMMSS.html`
2. Print all three file paths (clickable in terminal)

---

## Important Notes

- Always spawn all 5 advisors in parallel. Sequential wastes time and bleeds context.
- Always anonymize for peer review. Otherwise reviewers defer to thinking styles instead of evaluating on merit.
- Chairman can disagree with majority if the 1 dissenter's reasoning is strongest.
- Don't council trivial questions. One right answer = just answer it.
- Context enrichment matters. Difference between generic and useful council is whether advisors have enough context. Spend the 30 seconds scanning.
