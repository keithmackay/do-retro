do-retro — generate/update a project's development history doc

WHAT IT DOES
  Creates or updates docs/PROJECT_HISTORY.md, chronicling a project's
  development: git commits, design decisions, and every user prompt
  pulled from Claude Code session transcripts — plus a Retroactive
  Learning/Improvements section of hindsight lessons (rework signals,
  repeated fixes, regretted decisions). Full mode generates/updates the
  complete document; subset flags write just one section to its own
  file instead.

WHAT IT NEEDS
  - Run from inside a git repository
  - Claude Code session transcripts for this project, to extract prompt
    history from (optional — informational if none are found)

USAGE
  /do-retro                Generate/update the full PROJECT_HISTORY.md
  /do-retro --prompts       Write only the Prompt History section
  /do-retro --timeline      Write only the Development Timeline section
  /do-retro --decisions     Write only the Key Technical Decisions table
  /do-retro --learnings     Write only the Retroactive Learning section
  /do-retro --help          Show this message and exit

  Multiple subset flags may be combined, e.g. --prompts --timeline.

FLAGS
  --prompts     Write docs/PROJECT_HISTORY_PROMPTS.md only
  --timeline    Write docs/PROJECT_HISTORY_TIMELINE.md only
  --decisions   Write docs/PROJECT_HISTORY_DECISIONS.md only
  --learnings   Write docs/PROJECT_HISTORY_LEARNINGS.md only
  --help        Show this help message without making any changes
