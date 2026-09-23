import { schemes } from "../src/data/schemes.js";
import { getLocalizedScheme } from "../src/data/schemeTranslations.js";

export default function handler(req, res) {
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

  try {
    const {
      caste = "SC",
      income = 180000,
      loanAmount = 300000,
      age = 28,
      gender = "female",
      purpose = "startBiz",
      urbanRural = "rural",
      hasCaste = "yes",
      lang = "en",
    } = req.body || {};

    const userAmt = Number(loanAmount);
    const userInc = Number(income);
    const userAge = Number(age);

    const matches = [];

    schemes.forEach((scheme) => {
      let score = 0;
      let reasons = [];
      let isMatch = true;

      // 1. Purpose Filter
      if (purpose === "edu" && !scheme.education_eligibility) {
        isMatch = false;
      }
      if (purpose !== "edu" && !scheme.business_eligibility) {
        isMatch = false;
      }

      // 2. Income Limit Check
      if (
        scheme.annual_family_income_limit &&
        userInc > scheme.annual_family_income_limit
      ) {
        isMatch = false;
      }

      // 3. Caste & Category Check
      const schemeCat = (scheme.beneficiary_category || "").toLowerCase();
      const schemeTg = (scheme.target_groups || []).map((g) => g.toLowerCase());

      if (hasCaste === "no") {
        // Only universal or trade-specific schemes allowed (e.g. Stand-Up India for women, PM Vishwakarma, PM SVANidhi)
        const isWomenAllowed =
          (schemeCat.includes("women") || schemeTg.includes("women")) &&
          gender === "female";
        const isVendorAllowed =
          schemeCat.includes("vendor") || scheme.id === "pm-svanidhi";
        const isArtisanAllowed =
          schemeCat.includes("artisan") || scheme.id === "pm-vishwakarma";

        if (!isWomenAllowed && !isVendorAllowed && !isArtisanAllowed) {
          isMatch = false;
        }
      }

      // If user specified a specific caste category
      if (caste && caste !== "Any" && isMatch) {
        const casteLower = caste.toLowerCase();
        const matchesCategory =
          schemeCat.includes(casteLower) ||
          schemeTg.some((t) => t.includes(casteLower)) ||
          schemeCat.includes("special category") ||
          scheme.id === "pm-svanidhi" ||
          scheme.id === "pm-vishwakarma" ||
          scheme.id === "mudra-pmmy";

        if (!matchesCategory) {
          isMatch = false;
        }
      }

      // 4. Gender check
      if (isMatch) {
        const isWomenOnly =
          (schemeCat.includes("women") || schemeTg.includes("women")) &&
          !schemeCat.includes("sc / st / women");
        if (isWomenOnly && gender !== "female") {
          isMatch = false;
        }
      }

      // 5. Age check
      if (isMatch) {
        if (scheme.minimum_age && userAge < scheme.minimum_age) isMatch = false;
        if (scheme.maximum_age && userAge > scheme.maximum_age) isMatch = false;
      }

      if (isMatch) {
        // Calculate Match Score
        score += 50; // Base qualification match
        reasons.push("Meets primary social and financial eligibility criteria");

        // Loan amount fit
        if (scheme.loan_amount_max && userAmt <= scheme.loan_amount_max) {
          score += 20;
          reasons.push(
            `Requested ₹${userAmt.toLocaleString("en-IN")} is within maximum ceiling of ${scheme.maxAmount}`,
          );
        } else if (scheme.loan_amount_max) {
          score += 5;
          reasons.push(`Can fund up to maximum ceiling of ${scheme.maxAmount}`);
        }

        // Gender bonus
        if (
          gender === "female" &&
          (schemeCat.includes("women") || schemeTg.includes("women"))
        ) {
          score += 20;
          reasons.push(
            "Special interest concession and priority quota for women entrepreneurs",
          );
        }

        // Area & subsidy bonus
        if (
          urbanRural === "rural" &&
          (scheme.subsidy_percentage > 0 || scheme.id === "pmegp")
        ) {
          score += 9;
          reasons.push("Qualifies for highest rural capital subsidy rate");
        }

        score = Math.min(score, 99);

        // Calculate potential subsidy
        let subsidyAmount = 0;
        if (scheme.subsidy_percentage > 0) {
          subsidyAmount = Math.round(
            (userAmt * scheme.subsidy_percentage) / 100,
          );
        }

        const localized = getLocalizedScheme(scheme, lang);

        matches.push({
          ...localized,
          matchScore: score,
          match: `${score}%`,
          reasons,
          estimatedSubsidy:
            subsidyAmount > 0
              ? `₹${subsidyAmount.toLocaleString("en-IN")}`
              : "Nil",
          calcInterest: scheme.interest_rate_min || 5,
        });
      }
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      query: {
        caste,
        income: userInc,
        loanAmount: userAmt,
        age: userAge,
        gender,
        urbanRural,
      },
      total_matched: matches.length,
      top_match: matches[0] || null,
      matches,
    });
  } catch (err) {
    console.error("Error in /api/match:", err);
    return res
      .status(500)
      .json({
        success: false,
        error: "Internal server error in matching engine",
      });
  }
}
