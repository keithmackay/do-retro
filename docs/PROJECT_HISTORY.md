# How do-retro Was Built

> Generated using the [do-retro](https://github.com/keithmackay/mackayi) skill, from the [keithmackay/mackayi](https://github.com/keithmackay/mackayi) marketplace.

This document chronicles the development of do-retro, including the prompts used, decisions made, and the iterative design process.

---

## Project Overview

| Attribute | Value |
|-----------|-------|
| **Project** | do-retro |
| **Description** | A Claude Code skill that generates or updates `docs/PROJECT_HISTORY.md` for a project — a chronicle of its development history built from git commits, design decisions, and every user prompt pulled from Claude Code transcripts. |
| **Started** | 2026-08-19 |
| **Primary Language** | Markdown (Claude Code skill) + a small Node.js helper script |

---

## Development Timeline

### Phase 1: Extraction from sessionstats
- `d225111` — Initial extraction of `do-retro` from sessionstats' `build_story` command. The build-story generation had no real dependency on sessionstats' session-tracking data, so it was pulled out into its own standalone skill (`SKILL.md`, `README.md`, `scripts/extract-prompts.js`).

### Phase 2: Rebrand to PROJECT_HISTORY.md and subset flags
- `e914601` — Renamed the generated output from `docs/BUILD_STORY.md` to `docs/PROJECT_HISTORY.md`, added a marketplace-attribution line to generated docs, replaced all `build_story` references with `do-retro` throughout the skill, and added `--prompts`/`--timeline`/`--decisions`/`--learnings` flags so a user can generate just one section of the history as its own file instead of the whole document.

### Phase 3: Public release
- `def2fb6` — Added the MIT LICENSE file.
- `f67b253` — Added a `.gitignore` (node_modules/, .DS_Store, *.log).
- Repo published as `keithmackay/do-retro` on GitHub, with branch protection (PR + 1 review required, force-push and deletion blocked) and tagged as `v1.0.0`. Publishing this way (rather than `git push`) went through an API-based push helper, since the corporate Zscaler proxy blocks git's SSH/HTTPS transports for this account but `api.github.com` still works. The first `gh repo create --push` attempt left the remote genuinely empty (auto-init via `--add-readme` needed a moment to propagate before the API-based push could target a real ref) — recreating with `--add-readme` and waiting for the ref to exist resolved it.

### Phase 4: improve-this review and fixes
- An `/improve-this` review (`docs/plans/improve-this-2026-08-19.md`) evaluated the skill across Token Efficiency & Progressive Disclosure, Clarity & Simplification, Completeness, Accuracy & Consistency, Redundancy, and Edge Case Coverage, and surfaced 9 findings.
- `d2a5e35` (**Fix correctness/edge-case gaps and extract templates for token efficiency**) addressed all 9:
  - Resolved `extract-prompts.js`'s path relative to the skill's own base directory instead of a hardcoded `~/.claude/skills/do-retro` path, so the skill works from non-default install locations (plugin marketplace installs, project-local skills, symlinks).
  - Made subset files (`--prompts`/`--timeline`/`--decisions`/`--learnings`) append-only, matching `PROJECT_HISTORY.md`'s own "never remove content" rule — previously they were silently overwritten on every run.
  - Defined behavior for when `extract-prompts.js` finds no transcripts (treat as informational, not a blocking error), instead of leaving it undefined.
  - Broadened project metadata/structure detection beyond `package.json`/`Cargo.toml`/`pyproject.toml` and `.ts/.js/.py/.rs/.go`, with fallbacks (`git ls-files`, `SKILL.md`/`plugin.json`/`mkdocs.yml` detection) so docs/skill-only projects (like this one) don't come back with blank Primary Language/Project Structure sections.
  - Fixed a heading-level collision: `extract-prompts.js`'s own `## {date}` / `### {time}` output is now demoted to `### {date}` / `#### {time}` when nested under the doc's `## Prompt History` heading.
  - Deduplicated the Retroactive Learning/Improvements guidance, which had been stated twice (once inline in the new-file template, once as the full standalone section).
  - Changed the "build story" trigger phrase to "build history" (a deliberate wording choice, not leftover from the earlier build_story→do-retro rename).
  - Extracted the two large boilerplate markdown templates (~97 lines total) out of the always-loaded `SKILL.md` into `references/template-new.md` and `references/template-update.md`, cutting SKILL.md from 235 to 140 lines.
  - Renumbered the skill's steps from a mix of numbered Steps 0-4 interleaved with disconnected unnumbered sections into one coherent Steps 1-5 sequence, with a clearly-scoped "Reference Material" appendix.
- `6f5cc2f` (**Prompt for output location when docs/ doesn't exist**) changed Step 4 from silently `mkdir -p docs`-ing to checking first and asking the user to choose: create `docs/`, use the current directory, or specify and create a new folder.
- Repo re-tagged as `v1.1.0` to capture this rework.

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Extract do-retro out of sessionstats into its own skill | The build-story generation logic didn't depend on sessionstats' session-tracking data — bundling it there was accidental coupling, not a real dependency. |
| Rename `BUILD_STORY.md` → `PROJECT_HISTORY.md` and all internal `build_story` references → `do-retro` | Keep the skill's name, trigger phrases, and output filename consistent with each other after the standalone extraction. |
| Subset flags write to separate `PROJECT_HISTORY_<SUBSET>.md` files rather than extracting a section from the main file on demand | Lets a user regenerate just one slice (e.g. prompts) without re-running the full multi-source gathering process, and keeps each subset file independently useful. |
| Subset files follow the same append-only policy as the main file | The main file's "never remove content" guideline exists to protect prior manual edits and history; applying the same rule to subset files avoids a silent-overwrite footgun that was flagged in the improve-this review. |
| Resolve `extract-prompts.js`'s path relative to the skill's own base directory, with a hardcoded fallback | A hardcoded absolute path breaks for any non-default install location; resolving relative to where the skill actually loaded from is the general fix, while the fallback preserves the original default-install behavior. |
| Move large markdown templates into `references/` files loaded on demand | `SKILL.md` is loaded on every invocation regardless of which branch (new file vs. update) is taken; only the file for the branch actually used needs to be read, cutting the always-loaded content roughly in half. |
| Push to `keithmackay/*` GitHub repos via a REST Git Data API helper (`gh-push`) instead of `git push` | A corporate Zscaler proxy blocks git's SSH and smart-HTTP transports outright for this account, but `api.github.com` still works through the proxy — established as a standing project convention. |
| Prompt the user for an output location instead of silently creating `docs/` | Silently creating a directory the user didn't ask for is a minor surprise; asking (create `docs/`, use project root, or specify a new folder) keeps the user in control of where a new file tree gets planted. |

---

## Project Structure

```
.
├── .gitignore
├── LICENSE
├── README.md
├── SKILL.md
├── docs/
│   └── plans/
│       └── improve-this-2026-08-19.md
├── references/
│   ├── template-new.md
│   └── template-update.md
└── scripts/
    └── extract-prompts.js
```

---

## Prompt History

### 2026-08-19

#### 23:00
> describe what this skill does and what it generates

#### 23:09
> let's update the skill as follows:
> - change the generated filename to PROJECT_HISTORY.md
> - indicate at the top of the file that it was generated using the do-retro skill included in the https://github.com/keithmackay/mackayi marketplace.
> - change all references to "build_story" to "do-retro"

#### 23:11
> let's update the skill as follows:
> - change the generated filename to PROJECT_HISTORY.md
> - indicate at the top of the file that it was generated using the do-retro skill included in the https://github.com/keithmackay/mackayi marketplace.
> - change all references to "build_story" to "do-retro"
> - add flags to generate just subsets of the history in separate files (--prompts will save the extracted prompts to PROJECT_HISTORY_PROMPTS.md, etc.)

#### 23:13
> commit this

#### 23:14
> gitrelease with a public remote github repo

#### 23:30
> create implementation plan for all of these. For the "build story" trigger phrase, change to "build history".

#### 23:31
> execute the plan

*(Note: the `extract-prompts.js` output above covers 41 lines / 8 timestamped entries as of this run. Additional prompts from this session — including the `/improve-this` review, the docs-folder-prompt follow-up, the `/git-release` re-run, and this do-retro test — occurred after the last indexed transcript snapshot and are captured in the Development Timeline and Retroactive Learning sections above/below instead.)*

---

## Future Enhancements

- No ideas were raised in this session's history beyond what's already implemented.

---

## Retroactive Learning/Improvements

- **Repeated fixes, same root cause (commit `e914601` → `d2a5e35`):** The subset-file overwrite behavior and the hardcoded transcript-script path were both introduced in the initial rebrand (`e914601`) and had to be corrected two commits later in the improve-this pass (`d2a5e35`). Both were "worked in isolation, didn't get checked against the skill's own stated rules" mistakes — the overwrite behavior directly contradicted Guideline 5 ("never remove existing content — only append"), which was already written down in the same file. Running a consistency check against the skill's own guidelines section before shipping new behavior (rather than relying on a separate `/improve-this` pass afterward) would have caught this the first time.
- **Decision later regretted (repo bootstrap):** The initial `gh repo create --public --source=. --push` attempt (during the `/git-release` step) silently produced an empty remote repo because pushing was routed through the blocked git transport rather than the API helper from the start. The repo had to be deleted and recreated with `--add-readme` to get a seedable ref. Knowing the Zscaler-push constraint applies to *repo creation with `--push`*, not just later `git push` calls, would have avoided the delete/recreate cycle — worth calling out explicitly next to the `gh-push` convention rather than assuming it only applies to post-creation pushes.
- **Missing check that would have caught a bug earlier:** Nothing in the skill's own text validated that its cross-references (step numbers, "see below" pointers, file paths like `references/template-new.md`) stayed correct across edits — the Step 3.2 restructuring pass in `d2a5e35` had to be manually re-verified for dangling references after the fact. A lightweight self-check step (grep for step-number references and confirm they still resolve) after any structural edit to `SKILL.md` would catch a broken cross-reference before it ships.

---

*Documentation generated with Claude Code assistance, using the do-retro skill.*
