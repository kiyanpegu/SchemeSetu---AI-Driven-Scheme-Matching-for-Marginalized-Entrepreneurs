/* global process */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { evaluateBusinessIdea, isMaleApplicant } from "../src/data/ideaMatcher.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed. Use POST." });
  }

  const { businessIdea = "", language = "en" } = req.body || {};

  const input = (businessIdea || "").trim();
  const languageNames = {
    hi: "Hindi (हिन्दी)",
    as: "Assamese (অসমীয়া)",
  };
  const langName = languageNames[language] || "English";

  // Base smart evaluation (guaranteed gender-safe and domain-accurate)
  const baseEvaluation = evaluateBusinessIdea(input, language);

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (apiKey?.startsWith("AIzaSy")) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are the Official Government Business Feasibility and Scheme Advisor for the Ministry of Social Justice and Empowerment (MoSJE), Government of India.
Analyze this applicant's business proposal:
"${input}"

CRITICAL GENDER AND DOMAIN RULES:
1. GENDER CHECK: If the user states they are male (e.g. "man", "male", "boy", "guy", "पुरुष", "পুৰুষ"), DO NOT EVER recommend "mahila-samriddhi" or "nbcfdc-new-swarnima". Those schemes are strictly illegal for male applicants.
2. SECTOR SPECIFICS:
   - For piggery, pig farming, poultry, dairy, animal husbandry, aquaculture, fish farming: Match with "nsfdc-term-loan" (NSFDC Term Loan) or "pmegp".
   - For traditional artisans, blacksmiths, carpenters, potters, cobblers, weavers: Match with "pm-vishwakarma".
   - For street vendors, tea stalls, chai carts, hawkers: Match with "pm-svanidhi" or "nsfdc-lvy".
   - For e-rickshaws, solar, clean energy: Match with "nsfdc-green-business".
   - For small retail, tailoring by men, mobile repair: Match with "nsfdc-lvy".
   - For SC women micro-enterprises (tailoring, boutique, salon): Match with "mahila-samriddhi".

Language required: ${langName}.
Respond STRICTLY in JSON with these exact keys:
{
  "matchedSchemeId": (exact scheme id string, e.g. "nsfdc-term-loan", "pm-vishwakarma", "nsfdc-green-business", "pm-svanidhi", "nsfdc-lvy", "mahila-samriddhi"),
  "matchConfidence": (integer between 88 and 98),
  "businessSector": (string in ${langName}),
  "estimatedCapital": (string, e.g. "₹2,00,000 - ₹5,00,000"),
  "whyThisFits": (2-3 sentences in ${langName} explaining why this scheme provides the best interest rate, moratorium, and loan amount),
  "riskAssessment": (string in ${langName}),
  "actionPlan": (array of 3 specific actionable steps in ${langName})
}`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      // Gender safety post-validation
      if (
        isMaleApplicant(input) &&
        (parsed.matchedSchemeId === "mahila-samriddhi" ||
          parsed.matchedSchemeId === "nbcfdc-new-swarnima")
      ) {
        parsed.matchedSchemeId = baseEvaluation.matchedSchemeId;
        parsed.businessSector = baseEvaluation.businessSector;
        parsed.whyThisFits = baseEvaluation.whyThisFits;
        parsed.actionPlan = baseEvaluation.actionPlan;
      }

      return res.status(200).json({
        success: true,
        source: "gemini-2.5-flash",
        analysis: {
          ...parsed,
          matchConfidence:
            Number(parsed.matchConfidence) || baseEvaluation.matchConfidence,
        },
      });
    } catch (aiErr) {
      console.warn(
        "Gemini API call failed on backend, using smart domain heuristic engine:",
        aiErr.message,
      );
    }
  }

  // Guaranteed intelligent domain & gender-safe heuristic evaluation
  return res.status(200).json({
    success: true,
    source: "domain-heuristic-engine",
    analysis: baseEvaluation,
  });
}
