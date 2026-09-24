import { schemes } from "../src/data/schemes.js";
import { getLocalizedScheme } from "../src/data/schemeTranslations.js";

function matchesPurpose(scheme, purpose) {
  return purpose === "edu"
    ? scheme.education_eligibility
    : scheme.business_eligibility;
}

function matchesIncome(scheme, income) {
  return !scheme.annual_family_income_limit || income <= scheme.annual_family_income_limit;
}

function getSchemeCategories(scheme) {
  return {
    category: (scheme.beneficiary_category || "").toLowerCase(),
    groups: (scheme.target_groups || []).map((group) => group.toLowerCase()),
  };
}

function matchesNoCaste(scheme, gender, categories) {
  const isWomenAllowed =
    (categories.category.includes("women") || categories.groups.includes("women")) &&
    gender === "female";
  const isVendorAllowed = categories.category.includes("vendor") || scheme.id === "pm-svanidhi";
  const isArtisanAllowed = categories.category.includes("artisan") || scheme.id === "pm-vishwakarma";
  return isWomenAllowed || isVendorAllowed || isArtisanAllowed;
}

function matchesCaste(scheme, caste, categories) {
  if (!caste || caste === "Any") return true;
  const casteLower = caste.toLowerCase();
  return (
    categories.category.includes(casteLower) ||
    categories.groups.some((group) => group.includes(casteLower)) ||
    categories.category.includes("special category") ||
    ["pm-svanidhi", "pm-vishwakarma", "mudra-pmmy"].includes(scheme.id)
  );
}

function matchesGender(categories, gender) {
  const isWomenOnly =
    (categories.category.includes("women") || categories.groups.includes("women")) &&
    !categories.category.includes("sc / st / women");
  return !isWomenOnly || gender === "female";
}

function matchesAge(scheme, age) {
  return (
    (!scheme.minimum_age || age >= scheme.minimum_age) &&
    (!scheme.maximum_age || age <= scheme.maximum_age)
  );
}

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

    const matches = schemes
      .filter((scheme) => {
        const categories = getSchemeCategories(scheme);
        return (
          matchesPurpose(scheme, purpose) &&
          matchesIncome(scheme, userInc) &&
          (hasCaste !== "no" || matchesNoCaste(scheme, gender, categories)) &&
          matchesCaste(scheme, caste, categories) &&
          matchesGender(categories, gender) &&
          matchesAge(scheme, userAge)
        );
      })
      .map((scheme) => {
        let score = 50; // Base qualification match
        let reasons = ["Meets primary social and financial eligibility criteria"];

        // Loan amount fit
        if (scheme.loan_amount_max && userAmt <= scheme.loan_amount_max) {
          score += 20;
          reasons.push(`Requested ₹${userAmt.toLocaleString("en-IN")} is within maximum ceiling of ${scheme.maxAmount}`);
        } else if (scheme.loan_amount_max) {
          score += 5;
          reasons.push(`Can fund up to maximum ceiling of ${scheme.maxAmount}`);
        }

        // Gender bonus
        const schemeCat = (scheme.beneficiary_category || "").toLowerCase();
        const schemeTg = (scheme.target_groups || []).map((g) => g.toLowerCase());
        if (gender === "female" && (schemeCat.includes("women") || schemeTg.includes("women"))) {
          score += 20;
          reasons.push("Special interest concession and priority quota for women entrepreneurs");
        }

        // Area & subsidy bonus
        if (urbanRural === "rural" && (scheme.subsidy_percentage > 0 || scheme.id === "pmegp")) {
          score += 9;
          reasons.push("Qualifies for highest rural capital subsidy rate");
        }

        const subsidyAmount = scheme.subsidy_percentage > 0 ? Math.round((userAmt * scheme.subsidy_percentage) / 100) : 0;

        return {
          ...getLocalizedScheme(scheme, lang),
          matchScore: Math.min(score, 99),
          match: `${Math.min(score, 99)}%`,
          reasons,
          estimatedSubsidy: subsidyAmount > 0 ? `₹${subsidyAmount.toLocaleString("en-IN")}` : "Nil",
          calcInterest: scheme.interest_rate_min || 5,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

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
