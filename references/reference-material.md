# Reference Material

Consulted during Step 3 (document generation) — not needed for Steps 1-2 (context gathering).

## Retroactive Learning/Improvements guidance

This section is hindsight, not a changelog — don't restate what Key Technical Decisions already covers. For each item, name the specific commit/phase it relates to, what you'd do differently knowing the full history, and why (what pain, rework, or bug it would have avoided). Look for:

- **Rework signals**: a feature built one way, then reworked or reverted later — what would have gotten it right the first time?
- **Repeated fixes**: the same file/area patched multiple times for related bugs — a sign the underlying design needed to change, not just the symptom.
- **Decisions later regretted**: a documented decision whose rationale was later overridden or worked around elsewhere.
- **Missing tests/docs that would have caught a bug earlier** — call out the specific failure it would have caught.

If nothing in the history qualifies (e.g. a young or small project), write "Nothing rises to the level of a retroactive lesson yet" rather than manufacturing filler items.

## Guidelines

1. **Be specific**: Include actual file names, function names, and concrete details
2. **Quote prompts**: Include ALL user prompts from the extract-prompts output in the Prompt History section
3. **Explain rationale**: Don't just say what was done, explain why
4. **Track metrics**: Include before/after comparisons when relevant (bundle size, test count, etc.)
5. **Preserve history**: When updating, never remove existing content — only append
6. **Use tables**: They make technical decisions and changes scannable
7. **Include code snippets**: Short examples help illustrate key patterns
8. **Date everything**: Each section should have a date for future reference
