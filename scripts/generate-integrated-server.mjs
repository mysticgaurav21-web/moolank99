import { readFile, writeFile } from "node:fs/promises";

const sourceUrl = new URL("../server.ts", import.meta.url);
const outputUrl = new URL("../server.generated.ts", import.meta.url);

function replaceOnce(source, label, search, replacement) {
  const firstIndex = source.indexOf(search);
  if (firstIndex === -1) {
    throw new Error(`Knowledge integration failed: anchor not found for ${label}.`);
  }

  const secondIndex = source.indexOf(search, firstIndex + search.length);
  if (secondIndex !== -1) {
    throw new Error(`Knowledge integration failed: anchor is not unique for ${label}.`);
  }

  return source.slice(0, firstIndex) + replacement + source.slice(firstIndex + search.length);
}

let serverSource = await readFile(sourceUrl, "utf8");

serverSource = replaceOnce(
  serverSource,
  "deployment port",
  "const PORT = 3000;",
  'const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);'
);

serverSource = replaceOnce(
  serverSource,
  "health endpoint",
  "app.use(express.json());",
  `app.use(express.json());\n\napp.get("/health", (_req, res) => {\n  res.status(200).json({ status: "ok" });\n});`
);

serverSource = replaceOnce(
  serverSource,
  "knowledge loader import",
  'import { convertToHinglish } from "./src/utils/hinglish";',
  'import { convertToHinglish } from "./src/utils/hinglish";\nimport { getCanonicalTraits } from "./src/knowledge";'
);

serverSource = replaceOnce(
  serverSource,
  "canonical knowledge API route",
  "// GET reading endpoint",
  `// Canonical knowledge endpoint\napp.get("/api/knowledge/moolank/:number", (req, res) => {\n  const moolank = Number.parseInt(req.params.number, 10);\n\n  if (!Number.isInteger(moolank) || moolank < 1 || moolank > 9) {\n    return res.status(400).json({\n      success: false,\n      error: "Moolank must be an integer from 1 to 9."\n    });\n  }\n\n  const canonicalTraits = getCanonicalTraits(moolank);\n\n  return res.json({\n    success: true,\n    moolank,\n    canonicalTraits,\n    canonicalTraitCount: canonicalTraits.length\n  });\n});\n\n// GET reading endpoint`
);

serverSource = replaceOnce(
  serverSource,
  "canonical knowledge lookup",
  `    const moolank = calculateMoolank(dob);\n    const bhagyank = calculateBhagyank(dob);\n    const namank = calculateNamank(name);`,
  `    const moolank = calculateMoolank(dob);\n    const bhagyank = calculateBhagyank(dob);\n    const namank = calculateNamank(name);\n    const canonicalTraits = getCanonicalTraits(moolank);\n    const verifiedKnowledge = JSON.stringify(canonicalTraits, null, 2);`
);

serverSource = replaceOnce(
  serverSource,
  "Gemini canonical grounding",
  `        Calculate details and write high-quality, personalized readings for each of the 8 categories. Make the readings look extremely authentic, wise, encouraging, and rich (do not write generic templates). Each 'deepInsight' should be a comprehensive personalized reading (~2 paragraphs) with practical spiritual/professional details.`,
  `        VERIFIED CANONICAL KNOWLEDGE (source of truth for researched traits):\n        \${verifiedKnowledge}\n\n        Canonical grounding rules:\n        1. Do not contradict the verified canonical knowledge.\n        2. Treat conditional traits as possibilities under stated triggers, never as fixed labels.\n        3. Do not invent medical, psychiatric, diagnostic, criminal, addiction, or clinical claims.\n        4. Preserve the distinction between balanced expression, shadow expression, triggers, and growth guidance.\n        5. When the canonical list is empty, do not pretend that a researched canonical trait exists.\n        6. Traditional numerology interpretation must not be presented as scientific proof.\n\n        Calculate details and write high-quality, personalized readings for each of the 8 categories. Make the readings look extremely authentic, wise, encouraging, and rich (do not write generic templates). Each 'deepInsight' should be a comprehensive personalized reading (~2 paragraphs) with practical spiritual/professional details.`
);

serverSource = replaceOnce(
  serverSource,
  "canonical traits API response",
  `      moolank,\n      bhagyank,\n      namank,\n      isFallback,`,
  `      moolank,\n      bhagyank,\n      namank,\n      canonicalTraits,\n      isFallback,`
);

const banner = `// AUTO-GENERATED FILE. DO NOT EDIT.\n// Generated from server.ts by scripts/generate-integrated-server.mjs.\n// Canonical knowledge remains in knowledge/canonical/.\n\n`;

await writeFile(outputUrl, banner + serverSource, "utf8");
console.log("Generated server.generated.ts with canonical knowledge integration.");
