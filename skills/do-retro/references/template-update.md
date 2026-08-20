Procedure and section template for updating an EXISTING `docs/PROJECT_HISTORY.md` (used when Step 1.1 returns existing content):

1. Read the existing content
2. Identify the last documented date/section
3. Analyze git commits since then
4. Add a new section for recent changes, using this template:

```markdown
---

## [Feature/Change Name] ([DATE])

### Context
[Why was this change needed?]

### User Request
> [Quote the prompt if available]

### Changes Made

| File | Change |
|------|--------|
| `file1.ts` | [description] |
| `file2.ts` | [description] |

### Technical Details
[Implementation specifics]

### Key Insights
> "[Any lessons learned]"
```

5. Update the **Prompt History** section with any new prompts not already documented.
6. If the existing file has no **Retroactive Learning/Improvements** section, add one at the end (see the guidance in SKILL.md). If it already has one, review it against the changes since it was last updated and append any new items — don't rewrite items already there unless they've been directly superseded.
7. If the existing file predates the do-retro attribution line, add it directly under the title.
