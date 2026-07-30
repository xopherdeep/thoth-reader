import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8089;

app.use(express.json({ limit: "10mb" }));

// Simple in-memory reading store for shareable short codes if needed
const readingStore = new Map<string, any>();

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Book of Thoth Tarot Companion" });
});

// Save reading endpoint for QR sharing
app.post("/api/readings/save", (req, res) => {
  try {
    const { id, readingData } = req.body;
    if (!id || !readingData) {
      res.status(400).json({ error: "Missing reading ID or data" });
      return;
    }
    readingStore.set(id, {
      ...readingData,
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save reading" });
  }
});

// Fetch saved reading endpoint
app.get("/api/readings/:id", (req, res) => {
  const { id } = req.params;
  const reading = readingStore.get(id);
  if (!reading) {
    res.status(404).json({ error: "Reading not found or expired" });
    return;
  }
  res.json({ success: true, reading });
});

// Helper function to robustly parse JSON from Gemini text response
function parseGeminiJson(rawText: string): any {
  let cleaned = rawText ? rawText.trim() : "{}";
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
    }
    throw e;
  }
}

// Helper function to call Gemini API with retry logic and fallback for transient 503/high-demand errors
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    model?: string;
    contents: any;
    config?: any;
  },
  maxRetries = 3
) {
  const primaryModel = params.model || "gemini-3.6-flash";
  const modelsToTry = Array.from(
    new Set([primaryModel, "gemini-2.5-flash", "gemini-2.5-pro"])
  );
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);
        const isTransient =
          errStr.includes("503") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("high demand") ||
          errStr.includes("429") ||
          errStr.includes("RESOURCE_EXHAUSTED") ||
          errStr.includes("Overloaded");

        console.warn(
          `Gemini API call warning (Model: ${modelName}, Attempt: ${attempt}/${maxRetries}): ${errStr}`
        );

        if (isTransient && attempt < maxRetries) {
          const backoff = Math.min(attempt * 1000 + Math.random() * 500, 4000);
          await new Promise((resolve) => setTimeout(resolve, backoff));
          continue;
        }

        break;
      }
    }
  }

  throw lastError;
}

// Gemini AI Interpretation endpoint for Thoth Tarot readings
app.post("/api/reading/interpret", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured.",
      });
      return;
    }

    const { question, pulledCards, countingLog, deckNote } = req.body;

    if (!pulledCards || !Array.isArray(pulledCards) || pulledCards.length === 0) {
      res.status(400).json({ error: "No cards provided for interpretation." });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Construct deep Thoth Prompt
    const cardSummaryList = pulledCards
      .map((card: any, idx: number) => {
        return `Step ${idx + 1}: [${card.name}] (${card.thothTitle || "Atu"})
  - Category: ${card.category} | Numerology Count: ${card.numerologyCount}
  - Hebrew Letter: ${card.hebrewLetter ? `${card.hebrewLetter.name} (${card.hebrewLetter.letter})` : "N/A"}
  - Astrological Attribution: ${card.astrology ? `${card.astrology.name} (${card.astrology.symbol || ""}) - ${card.astrology.type}` : "N/A"}
  - Alchemical Element/Process: ${card.alchemy ? `${card.alchemy.element} | ${card.alchemy.process || ""}` : "N/A"}
  - Tree of Life: ${card.treeOfLife ? card.treeOfLife.sephiraOrPath : "N/A"}
  - Occult Key Themes: ${card.keyThemes ? card.keyThemes.join(", ") : ""}`;
      })
      .join("\n\n");

    const countingStepDetails = countingLog
      ? countingLog
          .map(
            (log: any, idx: number) =>
              `Step ${idx + 1}: Jumped from "${log.fromCardName}" by +${log.count} steps (Value of card) to land on "${log.toCardName}"`
          )
          .join("\n")
      : "Standard numerological sequence";

    const prompt = `You are the wise, timeless Narrator of the Book of Thoth and Hermetic Grimoires.
You are telling an allegorical, deeply mystical story to the querent using the sequence of cards pulled in their custom Thoth Numerological Counting Spread loop.

THE HOOK OF THE BOOK (PULLED CARDS SEQUENCE):
${cardSummaryList}

QUERENT'S QUESTION & INITIATIVE (THE USER'S VOICE):
"${question || "General Spiritual & Alchemical Guidance for the Querent"}"

COUNTING LOOP DYNAMICS:
${countingStepDetails}

${deckNote ? `ADDITIONAL PRACTITIONER NOTE: ${deckNote}` : ""}

NARRATIVE CORE INSTRUCTIONS:
- You speak as the Narrator of the Book. The pulled card sequence is the "Hook of the Book": introducing the character archetypes and elemental trials.
- Intertwine the user's question directly into the parable. Treat the user as the hero/protagonist writing their own story through their answers.
- Structure the reading as a multi-chapter book (Chapter 1, Chapter 2, Chapter 3, Chapter 4, Epilogue).
- Introduce each drawn card as a character or challenge that the hero encounters in the parable.
- Include Hermetic quotes and quotes from the Book of Thoth inside the narrative.
- When the user reads this back, they are re-reading their own personal parable with full self-insight.

Please provide a deeply insightful, eloquent, and authentic Thoth Tarot Reading structured into JSON with the following key fields:
1. "title": A book title for this personal parable (e.g. "The Book of the Self: The Parable of the Crowned Child").
2. "overview": A comprehensive paragraph summarizing the Hook of the Book and the core parable theme.
3. "bookHook": A 2-sentence description of how the drawn cards set the Hook of the Book.
4. "numerologicalJourney": A step-by-step breakdown analyzing how the numerological values (+${pulledCards.map((c: any) => c.numerologyCount).join(", +")}) created the energetic chain reaction from card to card.
5. "cardByCardAnalysis": An array of objects for each card pulled, containing "cardId", "title", "esotericSignificance", "alchemicalInsight", and "relevanceToQuestion".
6. "deepAnswer": Detailed, direct counsel answering the user's specific question as the Narrator's revelation to the hero.
7. "actionableCounsel": 3 to 4 clear, profound actionable directives or meditation formulas for the querent.
8. "alchemicalFormula": A short Latin or Hermetic alchemical motto synthesizing the reading (e.g. "Solve et Coagula", "Visita Interiora Terrae...").
9. "bookChapters": An array of 4 to 5 chapter objects:
   - "chapterNumber": integer (1, 2, 3, 4, 5)
   - "chapterTitle": string (e.g. "Chapter I: The Hook & The Call", "Chapter II: The Trial of the Elemental Characters", "Chapter III: The Parable of the Inner Path", "Chapter IV: The Hero's Resolution", "Chapter V: The Epilogue of Synthesis")
   - "parableQuote": string (an evocative quote or Hermetic aphorism setting the chapter tone)
   - "narrativeContent": string (rich 2-paragraph narrative telling the querent's story directly, without mentioning a narrator)
   - "characterArchetypes": array of card names appearing in this chapter
10. "poeticNarrative": An object containing "title" (string), "stanzas" (array of 3-4 poetic stanzas), "proseSynthesis" (2 paragraphs of mythic esoteric narrative), and "keyMotto" (short invocation).

Respond strictly in valid JSON format.`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const result = parseGeminiJson(jsonText);

    res.json({ success: true, interpretation: result });
  } catch (err: any) {
    console.error("Gemini Interpretation Error:", err);
    res.status(500).json({
      error: err.message || "An error occurred during Gemini AI interpretation.",
    });
  }
});

// Dedicated AI Narrative Synthesizer endpoint for Poetic & Esoteric Interpretation
app.post("/api/reading/synthesize-narrative", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured.",
      });
      return;
    }

    const { question, pulledCards, style = "crowleyan" } = req.body;

    if (!pulledCards || !Array.isArray(pulledCards) || pulledCards.length === 0) {
      res.status(400).json({ error: "No cards provided for narrative synthesis." });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const cardNames = pulledCards.map((c: any) => c.name).join(" -> ");
    const detailedCards = pulledCards
      .map(
        (c: any, i: number) =>
          `Card ${i + 1}: ${c.name} (${c.thothTitle || "Atu"}) | Element: ${c.alchemy?.element || "N/A"} | Hebrew Letter: ${c.hebrewLetter?.name || "N/A"} | Astrology: ${c.astrology?.name || "N/A"}`
      )
      .join("\n");

    const styleGuideMap: Record<string, string> = {
      crowleyan: "High-occult, rhythmic, fierce Liber AL vel Legis style, weaving Nuit, Hadit, and Ra-Hoor-Khuit symbolism with majestic ceremonial cadence.",
      orphic: "Hymnic Eleusinian/Orphic devotion, invoking the primal gods of the elements, cosmic night, and divine awakening.",
      enochian: "Sublime apocalyptic Enochian calls style, filled with angelic geometry, fiery watchtowers, and heavenly seals.",
      alchemical: "Hermetic manuscript style tracing the soul's transmutation through Nigredo, Albedo, Citrinitas, and Rubedo.",
    };

    const chosenStyleDescription = styleGuideMap[style] || styleGuideMap.crowleyan;

    const prompt = `Synthesize a rich, multi-chapter allegorical book narrative for this Tarot reading where the pulled cards serve as the chapters, the drawn cards are introduced as characters/challenges, and the user's question is intertwined as their own destiny.

QUERENT'S QUESTION / NARRATIVE INITIATIVE:
"${question || "Spiritual Awakening & Divine Alignment"}"

THE HOOK OF THE BOOK - DRAWN CARD SEQUENCE (${pulledCards.length} Cards):
${cardNames}

DETAILED CARD ESOTERIC CORRESPONDENCES & CHARACTERS:
${detailedCards}

DESIRED NARRATIVE POETIC STYLE:
${chosenStyleDescription}

NARRATIVE GUIDELINES:
- Read like a book of parables with page/chapter progression (Chapter 1, Chapter 2, Chapter 3, Chapter 4, Epilogue).
- The drawn cards are characters/forces in the parable that challenge or assist the querent.
- Intertwine the user's question so when they read back, they are reading their own personal story with full insight.
- Embed Hermetic quotes/mottos inside the chapters.
- CRITICAL: Write the story narrating the querent's journey directly (using second-person "you" or third-person as appropriate), as if they are the protagonist living out the story. DO NOT mention a "Narrator", "author", "parchment", or "book". Just tell the story of their journey.

Please output a JSON object containing:
1. "title": A book title for this personal parable narrative.
2. "stanzas": An array of 3 to 5 poetic stanzas (4-6 lines per stanza) depicting the spiritual progression through the drawn cards.
3. "proseSynthesis": A rich, evocative 2-paragraph prose narrative summarizing the overarching parable.
4. "keyMotto": A striking 1-line Hermetic aphorism or invocation summarizing the vision.
5. "bookHook": A 2-sentence description of how the pulled cards form the beginning of their journey.
6. "bookChapters": An array of 4 to 5 chapter objects, each containing:
   - "chapterNumber": integer (1, 2, 3, 4, etc.)
   - "chapterTitle": string (e.g. "Chapter I: The Threshold of Inquiry", "Chapter II: The Trial of the Elemental Characters", "Chapter III: The Parable of Inner Vision", "Chapter IV: The Hero's Awakening", "Chapter V: Epilogue of the Transmuted Self")
   - "parableQuote": string (an evocative Hermetic/Thoth quote)
   - "narrativeContent": string (rich 2-paragraph chapter story telling the querent's journey directly, without mentioning a narrator)
   - "characterArchetypes": array of card names appearing in this chapter
7. "style": "${style}"

Respond strictly in valid JSON format.`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const result = parseGeminiJson(jsonText);

    res.json({ success: true, narrative: result });
  } catch (err: any) {
    console.error("Gemini Narrative Synthesizer Error:", err);
    res.status(500).json({
      error: err.message || "Failed to synthesize esoteric narrative.",
    });
  }
});

// Explicit API catch-all to prevent Vite fallback HTML for unmatched /api routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.path}` });
});

// Global API error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith("/api")) {
    console.error("API Error Middleware caught:", err);
    res.status(500).json({ error: err?.message || "Internal Server Error" });
    return;
  }
  next(err);
});

// Start Express server with Vite middleware integration
async function startServer() {
  // Always serve public static assets directly (e.g. /images/thoth/*.webp)
  app.use(express.static(path.join(process.cwd(), "public")));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Book of Thoth Tarot App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
