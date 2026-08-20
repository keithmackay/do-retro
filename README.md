# do-retro

A Claude Code skill that generates or updates `docs/PROJECT_HISTORY.md` for a project — a chronicle of its development history built from git commits, design decisions made during sessions, and every user prompt pulled from Claude Code transcripts. Also produces a "Retroactive Learning/Improvements" section: hindsight lessons drawn from rework, repeated fixes, and regretted decisions visible in the history.

Generated files open with a note that they were produced using the do-retro skill from the [keithmackay/mackayi](https://github.com/keithmackay/mackayi) marketplace.

## Installation

### Claude Code

```bash
cp -r /path/to/do-retro/ ~/.claude/skills/do-retro/
```

Or symlink:
```bash
ln -s /path/to/do-retro/ ~/.claude/skills/do-retro
```

Then invoke by asking Claude to "do a retro" or "generate the project history" — no explicit `/` command is needed; see Usage below.

### Codex

Place the plugin directory where Codex can find it, then add an entry to your marketplace:

**`~/.agents/plugins/marketplace.json`** (create if absent):
```json
{
  "name": "personal",
  "interface": { "displayName": "Personal Plugins" },
  "plugins": [
    {
      "name": "do-retro",
      "source": { "source": "local", "path": "/path/to/do-retro/" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

### Antigravity

**Global install** (all workspaces):
```bash
cp -r /path/to/do-retro/ ~/.gemini/antigravity/skills/do-retro/
```

**Workspace install** (current project only):
```bash
cp -r /path/to/do-retro/ .agents/skills/do-retro/
```

The root `SKILL.md` has no Claude Code-specific metadata, so it is used as-is — no separate Antigravity variant is needed.

Skills are auto-discovered. You can also mention the skill by name to force activation.

### Gemini CLI

Gemini CLI installs extensions directly from GitHub:

```bash
gemini extensions install https://github.com/keithmackay/do-retro
```

To update:
```bash
gemini extensions update do-retro
```

The skill is auto-discovered from `GEMINI.md` after installation.

## Compatibility

| Feature | Claude Code | Codex | Antigravity | Gemini CLI |
|---------|:-----------:|:-----:|:-----------:|:----------:|
| Core skill | ✅ | ✅ | ✅ | ✅ |
| Sub-documents (`references/`) | ✅ | ✅ | ✅ | ✅ |
| Script (`scripts/extract-prompts.js`) | ✅ | ✅ | ✅ | ✅ |

No Claude Code-specific frontmatter (`metadata`, `retrieval`, `tags`) or subagent dispatch is used by this skill, so there are no platform gaps to document — it ports cleanly to all four platforms. The `extract-prompts.js` script reads Claude Code transcripts specifically (`~/.claude/projects/<encoded-project-path>/*.jsonl`); on non-Claude-Code platforms it will find no transcripts to parse, which the skill already treats as informational rather than a blocking error.

Legend: ✅ Supported · ❌ Not supported

## References

- **Claude Code Skills:** https://code.claude.com/docs/en/skills
- **Claude Code Complete Guide (PDF):** https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf
- **Codex Plugins:** https://developers.openai.com/codex/plugins/build
- **Antigravity Skills:** https://antigravity.google/docs/skills
- **Gemini CLI Extensions:** https://github.com/google-gemini/gemini-cli/blob/main/docs/extension.md
- **Agent Skills open standard:** https://agentskills.io/home

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
