# do-retro

A Claude Code skill that generates or updates `docs/BUILD_STORY.md` for a project — a chronicle of its development history built from git commits, design decisions made during sessions, and every user prompt pulled from Claude Code transcripts. Also produces a "Retroactive Learning/Improvements" section: hindsight lessons drawn from rework, repeated fixes, and regretted decisions visible in the history.

## Installation

Copy or symlink this directory into your personal skills folder:

```bash
ln -s ~/Projects/do-retro ~/.claude/skills/do-retro
```

## Usage

In a Claude Code session inside any git project, ask Claude to "do a retro" or "generate the build story" — it will invoke this skill automatically.

## How it works

The skill walks git history, project metadata, and README content, then runs `scripts/extract-prompts.js` to pull every user prompt from that project's Claude Code transcripts (`~/.claude/projects/<encoded-project-path>/*.jsonl`). It writes or appends to `docs/BUILD_STORY.md`, never overwriting prior sections.
