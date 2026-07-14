# Moolank99 Knowledge Base

This directory stores the permanent, app-ready knowledge produced by the Moolank research project.

## Source-of-truth rule

Research chats are working spaces. Only reviewed files inside `knowledge/canonical/` should be treated as final app content.

For continuity across chats, always read `CURRENT_WORK.md` and `WORKFLOW.md` before starting or resuming a phase.

## Directory structure

```text
knowledge/
├── canonical/       Final app-facing JSON records
├── evidence/        Research notes, sources and rejected claims
├── imports/         Recovered old exports and roadmaps awaiting review
├── schema/          JSON validation schemas
├── templates/       Evidence and canonical starter templates
├── MASTER_INDEX.json
├── PROJECT_STATUS.md
├── CURRENT_WORK.md
├── WORKFLOW.md
└── CHANGELOG.md
```

## Required operating sequence

```text
Research
  ↓
Evidence Markdown
  ↓
Canonical JSON
  ↓
Index + status + changelog
  ↓
App loader registration
  ↓
CI and pull request
  ↓
Render deployment verification
```

A phase is not complete merely because a chat answer exists. Follow the definition of done in `WORKFLOW.md`.

## How the app should use this data

1. Calculate the user's Moolank.
2. Load canonical files matching that Moolank.
3. Use `appCard` for compact UI cards.
4. Use `appSafeSummary` and `canonicalDefinition` for detailed reports.
5. Use balanced and shadow expressions to generate contextual guidance.
6. Pass canonical records to the AI prompt as verified knowledge.
7. Never allow AI output to contradict excluded claims or safety notes.

## Recommended server flow

```text
Date of birth
    ↓
Moolank calculation
    ↓
Load knowledge/canonical/moolank-{n}/*.json
    ↓
Return canonicalTraits through the API
    ↓
Use the same records to ground AI-generated wording
```

## AI grounding rules

When canonical knowledge is supplied to an AI model, the prompt should require the model to:

- preserve the meaning of canonical claims;
- use conditional language for conditional traits;
- avoid fixed negative labels;
- avoid medical, psychiatric and psychological diagnoses;
- distinguish traditional numerology claims from scientific evidence;
- avoid inventing behaviours that appear in `excludedClaims`.

## Versioning

- Research drafts begin at `0.x`.
- A reviewed canonical record receives a stable version such as `1.0` or `1.2`.
- Meaningful wording or evidence changes require a version update.
- Deprecated records remain in history but must be removed from the active master index.

## Current stored record

- Moolank 1 — ID-016 Impulse Control Canonical v1.2

Other completed traits will be added only after their exact previous canonical exports are recovered and checked.
