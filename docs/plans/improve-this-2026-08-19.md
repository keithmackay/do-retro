# Implementation Plan — improve-this findings (2026-08-19)

Source: `/improve-this` review of the do-retro skill, full-project scope. Addresses all 9 findings from that review.

## Phase 1 — Correctness fixes (silent-failure / silent-data-loss risks)

### 1.1 Fix hardcoded transcript-extraction script path (Finding #1)
- **File:** `SKILL.md` Step 1.7
- Replace the hardcoded `node ~/.claude/skills/do-retro/scripts/extract-prompts.js` invocation with logic that locates `extract-prompts.js` relative to wherever this SKILL.md was loaded from, rather than assuming the fixed `~/.claude/skills/do-retro/` path. In practice: instruct the agent to resolve the script path from the skill's own base directory (the directory containing this SKILL.md) before invoking it, and only fall back to the `~/.claude/skills/do-retro/...` path if that resolution fails.
- Add a one-line note that this matters for non-default installs (plugin marketplace installs, project-local `.claude/skills/`, symlinked skill dirs).

### 1.2 Make subset-file write behavior consistent with the main file's append-only rule (Finding #2)
- **File:** `SKILL.md`, "Generating Subsets" section
- Decide and document one policy explicitly — recommended: subset files follow the same append/preserve rule as `PROJECT_HISTORY.md` (read existing subset file if present, add a new dated section, never delete prior content), rather than the current "write/overwrite" behavior.
- Update the flags table's "Content" column and the paragraph beneath it to state the append behavior plainly, so it no longer contradicts Guideline #5 ("Preserve history... only append").

### 1.3 Define behavior when extract-prompts.js finds no transcripts (Finding #6)
- **File:** `SKILL.md` Step 1.7
- Add explicit handling: if the script exits non-zero or returns "No user prompts found," the agent should note in the generated doc that no transcript history was available (rather than silently omitting the Prompt History section or treating the error as blocking). Apply the same note to the `--prompts` subset flow.

## Phase 2 — Completeness

### 2.1 Broaden project metadata/structure detection (Finding #3)
- **File:** `SKILL.md` Steps 1.4 and 1.6
- Extend Step 1.4's manifest check beyond `package.json`/`Cargo.toml`/`pyproject.toml` to also check for common non-code project markers (e.g. `SKILL.md`/plugin manifest for skill projects, `mkdocs.yml`/`_config.yml` for docs sites) so "Primary Language"/"Description" can resolve to something like "Claude Code skill (markdown + Node.js helper script)" instead of coming back empty.
- Extend Step 1.6's file glob beyond `.ts/.js/.py/.rs/.go` to include a fallback: if no code files matching the current extensions are found, list all tracked non-hidden files instead (via `git ls-files`), so a docs/markdown-only project still gets a meaningful Project Structure section.

### 2.2 Resolve Prompt History heading-level collision (Finding #5)
- **File:** `SKILL.md` Step 1.7 description and the Prompt History template guidance (line ~124)
- Add an explicit instruction: when embedding `extract-prompts.js` output under the doc's own `## Prompt History` heading, demote the script's `## {date}` / `### {time}` headings by one level (`### {date}` / `#### {time}`) so they nest correctly under the parent section instead of colliding with top-level document headings.
- No script change needed — this is purely an instruction for how SKILL.md tells the agent to merge the output.

## Phase 3 — Redundancy & structure cleanup

### 3.1 Deduplicate Retroactive Learning guidance (Finding #4)
- **File:** `SKILL.md`
- Remove the inline restatement in the "If NO existing file" template's Retroactive Learning placeholder (currently: "[Reviewing the full history above with hindsight...]") and replace it with a short pointer to the single canonical guidance section (e.g. "See Retroactive Learning/Improvements guidance below"), so the detailed rules exist in exactly one place.

### 3.2 Renumber/restructure steps for clarity (Finding #8)
- **File:** `SKILL.md`
- Use the **`/plsfix`** skill to do this restructuring pass rather than hand-editing prose from scratch: feed it the current SKILL.md (post Phases 1–2 edits) and have it produce a version where the numbered Step 0–4 flow and the currently-unnumbered sections (Generating Subsets, Retroactive Learning, Guidelines, Output) read as one coherent, correctly-ordered sequence — e.g. folding "Generating Subsets" in as part of Step 0's branch, and either numbering the remaining sections or clearly marking them as reference material consulted by specific steps.
- This should run **after** Phase 4's extraction (3.3 below), since /plsfix should operate on the trimmed, template-free SKILL.md, not the current bloated version.

### 3.3 Change stale trigger phrase from "build story" to "build history" (Finding #9)
- **File:** `SKILL.md` frontmatter `description` (line 3)
- Replace the trigger phrase `"build story"` with `"build history"` in the list of activation phrases, per explicit direction — this is a deliberate wording choice, not a leftover from the earlier build_story→do-retro rename.

## Phase 4 — Token efficiency / progressive disclosure

### 4.1 Extract the always-loaded markdown templates out of SKILL.md (Finding #7)
- **New files:** `references/template-new.md` (the ~73-line "If NO existing file" template, SKILL.md lines 69-141) and `references/template-update.md` (the ~24-line "If file EXISTS" template, SKILL.md lines 150-173)
- **File:** `SKILL.md` Step 3 — replace the inline template blocks with a short instruction to read the appropriate reference file based on whether `docs/PROJECT_HISTORY.md` exists, keeping the branching logic (steps 1-7 under "If file EXISTS") in SKILL.md itself since those are decision-making instructions, not boilerplate.
- Use the **`/readme`** skill's approach as the model for this split (setup/reference content lives outside the always-loaded file, pulled in only when that branch is taken) — SKILL.md should end up close to its current line count minus the ~97 template lines.
- After this extraction, re-run **`/plsfix`** over the remaining SKILL.md (combined with step 3.2) to tighten the prose now that it's no longer padded by inline templates.

## Sequencing note

Do Phases 1-2 first (correctness/completeness — these are behavior changes, not just rewording). Do Phase 3.1 and 3.3 next (straightforward text fixes). Do Phase 4.1 (template extraction) before 3.2 (restructuring pass), since the restructuring should operate on the leaner file. Run `/plsfix` once at the end covering both 3.2 and the post-extraction tightening, rather than twice.

## Out of scope / not applicable here

None of the 9 findings require test changes or `/readme` regeneration of the top-level README — README.md already reflects current behavior as of the prior session's edits (PROJECT_HISTORY.md rename + subset flags), and the "Guidelines" section in SKILL.md is short enough not to need extraction on its own.
