# Canonical Knowledge Integration

The app now uses canonical JSON as an application data source rather than leaving research only in chat history.

## Runtime flow

1. `scripts/generate-integrated-server.mjs` reads the existing `server.ts` source.
2. It generates `server.generated.ts` with canonical-knowledge hooks.
3. `src/knowledge/index.ts` loads canonical JSON records.
4. `npm run dev`, `npm run lint`, and `npm run build` generate the integrated server before running.
5. The reading endpoint includes `canonicalTraits` in its JSON response.
6. Gemini receives the same canonical records as verified grounding context.

## APIs

### Personalized reading

`POST /api/moolank/reading`

The existing response now includes:

```json
{
  "canonicalTraits": []
}
```

For Moolank 1, the array currently contains ID-016 Impulse Control v1.2.

### Direct canonical knowledge

`GET /api/knowledge/moolank/:number`

Example:

```text
GET /api/knowledge/moolank/1
```

Response shape:

```json
{
  "success": true,
  "moolank": 1,
  "canonicalTraits": [],
  "canonicalTraitCount": 1
}
```

## Safety rules enforced in AI grounding

- Conditional traits must not become fixed labels.
- Canonical knowledge must not be contradicted.
- Medical, psychiatric, diagnostic, criminal, addiction, and clinical claims must not be invented.
- Traditional numerology interpretation must not be presented as scientific proof.
- Empty canonical datasets must not be described as researched canonical knowledge.

## Adding the next trait

1. Add the validated JSON file under `knowledge/canonical/moolank-N/`.
2. Import it in `src/knowledge/index.ts`.
3. Add it to the correct Moolank array.
4. Run `npm run lint` and `npm run build`.
5. Update `MASTER_INDEX.json`, `PROJECT_STATUS.md`, and `CHANGELOG.md`.

`server.generated.ts` is generated and ignored by Git. Do not edit it directly.
