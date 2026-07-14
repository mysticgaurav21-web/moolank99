# Moolank99 Research and Development Workflow

This document is the operating system for all future Moolank99 research and app changes.

## Core rule

Chat is a working room. GitHub is the permanent source of truth.

No research phase is considered complete until its evidence, canonical record, project status, index entry, changelog entry, app registration, and validation results are committed to GitHub.

## End-to-end flow

```text
Research question
  ↓
Source collection and quality review
  ↓
Evidence consolidation
  ↓
Canonical draft
  ↓
Trait-boundary and safety review
  ↓
Canonical JSON + evidence Markdown
  ↓
MASTER_INDEX + PROJECT_STATUS + CHANGELOG
  ↓
src/knowledge registration
  ↓
Type check + production build
  ↓
Pull request + CI
  ↓
Merge to main
  ↓
Render auto-deploy
  ↓
Live website verification
```

## Phase lifecycle

### 1. Start phase

Update `knowledge/CURRENT_WORK.md` before research begins.

Required fields:

- phase number
- trait ID and name
- Moolank
- research question
- status
- known blockers
- expected output files

### 2. Research and evidence

Create or update:

```text
knowledge/evidence/moolank-N/ID-NNN-trait-name.md
```

Evidence files must include:

- research question
- source list
- source quality notes
- repeated claims
- conflicting claims
- supported claims
- cautious claims
- rejected claims
- trait boundaries
- tradition-level confidence
- scientific-status statement
- final evidence verdict

### 3. Canonical record

Create:

```text
knowledge/canonical/moolank-N/ID-NNN-trait-name.vX.Y.json
```

Canonical records must pass the schema in `knowledge/schema/trait.schema.json` and must include safe conditional wording where appropriate.

### 4. Register the trait

Update all of the following in the same phase:

- `knowledge/MASTER_INDEX.json`
- `knowledge/PROJECT_STATUS.md`
- `knowledge/CHANGELOG.md`
- `src/knowledge/index.ts`

A canonical file that is not registered in `src/knowledge/index.ts` will not flow into the API, Gemini grounding, or live app.

### 5. Validate

Run:

```bash
npm run lint
npm run build
```

For API or numerology-logic changes, also run the relevant tests and smoke checks.

### 6. Pull request and deployment

Use a feature branch. Open a PR, wait for CI, then merge only after checks pass.

Render deploys `main` after successful checks. Verify:

- `/health`
- `GET /api/knowledge/moolank/:number`
- generated reading
- Canonical Knowledge panel

### 7. Close phase

After live verification:

- mark phase complete in `PROJECT_STATUS.md`
- move `CURRENT_WORK.md` to the next verified phase
- record the live verification in `CHANGELOG.md`
- never leave the next trait ID guessed or ambiguous

## Chat-limit handoff protocol

Before a long chat ends, GitHub must contain:

1. current phase and exact next action in `CURRENT_WORK.md`
2. all accepted evidence in the evidence file
3. canonical draft or locked JSON
4. unresolved questions and blockers
5. latest project status

A new chat should begin by reading:

```text
knowledge/CURRENT_WORK.md
knowledge/PROJECT_STATUS.md
knowledge/MASTER_INDEX.json
knowledge/WORKFLOW.md
```

Then it should open only the relevant evidence and canonical files.

## Definition of done

A research-development phase is done only when all boxes are true:

- [ ] Evidence reviewed and stored
- [ ] Duplicate and conflicting claims resolved
- [ ] Trait boundaries documented
- [ ] Canonical JSON created or versioned
- [ ] Unsupported and clinical claims excluded
- [ ] Master index updated
- [ ] Project status updated
- [ ] Changelog updated
- [ ] Trait registered in app loader
- [ ] Type check passed
- [ ] Production build passed
- [ ] PR merged
- [ ] Render deployment verified

## Safety rules

- Numerology tradition and scientific evidence must remain separate.
- Do not present Moolank associations as scientifically proven personality facts.
- Do not infer medical, psychiatric, criminal, addiction, or diagnostic conditions.
- Conditional shadow traits must not become fixed negative labels.
- Exact old canonical records must be recovered rather than recreated from memory.
