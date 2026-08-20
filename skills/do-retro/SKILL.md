---
name: do-retro
description: Generate or update a docs/PROJECT_HISTORY.md chronicling a project's development history — git commits, design decisions, and every user prompt from Claude Code transcripts — plus a retroactive-learning section of hindsight lessons. Supports flags to generate subsets into separate files (e.g. --prompts). Use when the user says "build history", "document how this was built", "do a retro", "project history doc", or "do-retro".
---

# do-retro

You are tasked with creating or updating `docs/PROJECT_HISTORY.md`, a document that chronicles this project's development — commits, design decisions, and every user prompt from Claude Code transcripts — for whoever reads it later to understand how and why the project was built. Follow Steps 1-5 in order.

## Flags

### `--help`

If the user invokes this skill with a `--help` flag (e.g. `/do-retro --help`), do not run any of the steps below. Instead, read and display the contents of `help.md` (in this skill's folder) verbatim, then stop.

## Step 1: Determine mode — full history or a subset

Check whether the user's invocation included a subset flag: `--prompts`, `--timeline`, `--decisions`, and/or `--learnings`.

- **No flags** → full mode: gather everything in Step 2, then generate/update the complete `docs/PROJECT_HISTORY.md` in Step 3.
- **One or more flags** → subset mode: for each flag, gather only the context that section needs (see the table in Step 3b) and write just that section to its own file. Multiple flags may be combined (e.g. `--prompts --timeline`); generate one file per flag.

## Step 2: Gather Context

Collect information from these sources. In subset mode, run only the substeps each requested flag needs.

### 2.1 Check for an existing PROJECT_HISTORY.md
```bash
cat docs/PROJECT_HISTORY.md 2>/dev/null || echo "NO_EXISTING_FILE"
```
If a prior run wrote it to a non-default location (see Step 4), check there instead.

### 2.2 Get git history
```bash
git log --oneline --all | head -50
```

### 2.3 Get detailed recent commits
```bash
git log --pretty=format:"### %s%n%nDate: %ad%nAuthor: %an%n%n%b%n---" --date=short -20
```

### 2.4 Get project metadata
```bash
cat package.json 2>/dev/null || cat Cargo.toml 2>/dev/null || cat pyproject.toml 2>/dev/null || cat go.mod 2>/dev/null || find . -maxdepth 2 \( -iname "SKILL.md" -o -iname "plugin.json" -o -iname "mkdocs.yml" \) 2>/dev/null | head -5 || echo "{}"
```
If none of these match, treat the project as a non-code project (docs/skill/config collection): derive "Primary Language"/"Description" from the README and the file types found in Step 2.6 instead of leaving them blank.

### 2.5 Get README
```bash
cat README.md 2>/dev/null || echo "No README"
```

### 2.6 Get project structure
```bash
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.rs" -o -name "*.go" \) 2>/dev/null | grep -v node_modules | grep -v dist | grep -v build | head -50
```
If this returns no results (e.g. a docs/markdown-only or skill project), fall back to listing all tracked files:
```bash
git ls-files | head -50
```

### 2.7 Get user prompt history from Claude Code transcripts

Run `scripts/extract-prompts.js` from this skill's own base directory (the directory containing this SKILL.md, as announced when the skill loaded) rather than assuming a fixed path:
```bash
node "<skill-base-dir>/scripts/extract-prompts.js"
```
If the skill's base directory can't be determined, fall back to `~/.claude/skills/do-retro/scripts/extract-prompts.js`.

If the script exits non-zero or prints "No user prompts found in transcripts.", note in the output that no transcript history was available for this project — treat this as informational, not a blocking error.

The script outputs every user prompt from every Claude Code session for this project, grouped by date with timestamps (as `## {date}` / `### {time}` headings). Include ALL of these prompts wherever Prompt History is generated, demoting the script's headings by one level (`### {date}` / `#### {time}`) so they nest correctly under the target document's own `## Prompt History` heading.

### 2.8 Analyze the current session

Review this session's conversation to identify:
- **User requests**: What did the user ask for?
- **Design decisions**: What choices were made and why?
- **Implementation details**: What was built?
- **Key insights**: What lessons were learned?

## Step 3a: Full mode — generate or update PROJECT_HISTORY.md

**If Step 2.1 returned NO_EXISTING_FILE:** read `references/template-new.md` (relative to this skill's base directory) and create `docs/PROJECT_HISTORY.md` following that structure exactly, filling in the bracketed placeholders from Step 2's context.

**If the file exists:** read `references/template-update.md` (relative to this skill's base directory) and follow its procedure and section template to update `docs/PROJECT_HISTORY.md` in place.

Both paths use `references/reference-material.md` (Retroactive Learning/Improvements guidance and Guidelines) — consult it while filling in those sections.

## Step 3b: Subset mode — generate individual section files

Each flag writes only its section to its own file in `docs/`, named `PROJECT_HISTORY_<SUBSET>.md`, opening with the same do-retro attribution line used in `references/template-new.md`.

| Flag | Output file | Content |
|------|-------------|---------|
| `--prompts` | `docs/PROJECT_HISTORY_PROMPTS.md` | Step 2.7's full output under a `## Prompt History` heading. |
| `--timeline` | `docs/PROJECT_HISTORY_TIMELINE.md` | The `## Development Timeline` section, built from Steps 2.2–2.3. |
| `--decisions` | `docs/PROJECT_HISTORY_DECISIONS.md` | The `## Key Technical Decisions` table, built from commit and session context. |
| `--learnings` | `docs/PROJECT_HISTORY_LEARNINGS.md` | The `## Retroactive Learning/Improvements` section — see Reference Material below. |

Each subset file follows the same append-only policy as the full file (Guideline 5): if it already exists, read it first and add a new dated section rather than overwriting prior content; only create it fresh if it doesn't exist yet. Never touch `docs/PROJECT_HISTORY.md` itself while generating a subset.

## Step 4: Write the file(s)

Check whether the `docs/` directory exists:
```bash
test -d docs && echo EXISTS || echo MISSING
```

If it's missing, ask the user where to write the output before generating anything further:
- **Create `docs/`** — proceed as designed, writing to `docs/PROJECT_HISTORY.md` (or `docs/PROJECT_HISTORY_<SUBSET>.md` in subset mode)
- **Use the current directory** — write `PROJECT_HISTORY.md` (or the subset files) directly at the project root instead
- **Use a new folder** — ask for the folder name, create it (`mkdir -p <folder>`), and write there instead

Once the destination is settled (or `docs/` already existed), write the content generated in Step 3a or 3b there, creating the chosen directory first if needed.

## Step 5: Report what was done

Summarize for the user:
- Whether `docs/PROJECT_HISTORY.md` was created or updated, or which subset files were written
- How many sections were added
- Key highlights captured

If updating the full file, also show what changed:
```bash
git diff docs/PROJECT_HISTORY.md | head -100
```
