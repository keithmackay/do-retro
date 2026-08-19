# do-retro

A Claude Code skill that generates or updates `docs/PROJECT_HISTORY.md` for a project — a chronicle of its development history built from git commits, design decisions made during sessions, and every user prompt pulled from Claude Code transcripts. Also produces a "Retroactive Learning/Improvements" section: hindsight lessons drawn from rework, repeated fixes, and regretted decisions visible in the history.

Generated files open with a note that they were produced using the do-retro skill from the [keithmackay/mackayi](https://github.com/keithmackay/mackayi) marketplace.

## Installation

Copy or symlink this directory into your personal skills folder:

```bash
ln -s ~/Projects/do-retro ~/.claude/skills/do-retro
```

## Usage

In a Claude Code session inside any git project, ask Claude to "do a retro" or "generate the project history" — it will invoke this skill automatically.

You can also ask for just a subset of the history, which is written to its own file instead of the full `docs/PROJECT_HISTORY.md`:

| Flag | Output file |
|------|-------------|
| `--prompts` | `docs/PROJECT_HISTORY_PROMPTS.md` |
| `--timeline` | `docs/PROJECT_HISTORY_TIMELINE.md` |
| `--decisions` | `docs/PROJECT_HISTORY_DECISIONS.md` |
| `--learnings` | `docs/PROJECT_HISTORY_LEARNINGS.md` |

## How it works

The skill walks git history, project metadata, and README content, then runs `scripts/extract-prompts.js` to pull every user prompt from that project's Claude Code transcripts (`~/.claude/projects/<encoded-project-path>/*.jsonl`). It writes or appends to `docs/PROJECT_HISTORY.md`, never overwriting prior sections.
