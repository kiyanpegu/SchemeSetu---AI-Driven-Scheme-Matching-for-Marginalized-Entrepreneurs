import { getLocalizedScheme } from "./schemeTranslations";

export function matchSchemes(formData, schemes, lang, t) {
  const userAmt = Number(formData.amount);
  const userInc = Number(formData.income);
  const userAge = Number(formData.age);
  const purpose = formData.purpose;
  const gender = formData.gender;
  const hasCaste = formData.hasCaste;
  const caste = formData.caste || "Any";
  const urbanRural = formData.area;

  return schemes
    .filter((scheme) => {
      // 1. Purpose Filter
      if (purpose === "edu" && !scheme.education_eligibility) return false;
      if (purpose !== "edu" && !scheme.business_eligibility) return false;

      // 2. Income Limit Check
      if (scheme.annual_family_income_limit && userInc > scheme.annual_family_income_limit) return false;

      // 3. Caste & Category Check
      const schemeCat = (scheme.beneficiary_category || "").toLowerCase();
      const schemeTg = (scheme.target_groups || []).map((g) => g.toLowerCase());

      if (hasCaste === "no") {
        const isWomenAllowed = (schemeCat.includes("women") || schemeTg.includes("women")) && gender === "female";
        const isVendorAllowed = schemeCat.includes("vendor") || scheme.id === "pm-svanidhi";
        const isArtisanAllowed = schemeCat.includes("artisan") || scheme.id === "pm-vishwakarma";
        if (!isWomenAllowed && !isVendorAllowed && !isArtisanAllowed) return false;
      }

      if (caste && caste !== "Any") {
        const casteLower = caste.toLowerCase();
        const matchesCategory =
          schemeCat.includes(casteLower) ||
          schemeTg.some((t) => t.includes(casteLower)) ||
          schemeCat.includes("special category") ||
          ["pm-svanidhi", "pm-vishwakarma", "mudra-pmmy"].includes(scheme.id);
        if (!matchesCategory) return false;
      }

      // 4. Gender check
      const isWomenOnly = (schemeCat.includes("women") || schemeTg.includes("women")) && !schemeCat.includes("sc / st / women");
      if (isWomenOnly && gender !== "female") return false;

      // 5. Age check
      if (scheme.minimum_age && userAge < scheme.minimum_age) return false;
      if (scheme.maximum_age && userAge > scheme.maximum_age) return false;

      return true;
    })
    .map((scheme) => {
      let score = 50; // Base qualification match
      let reasons = [t?.reasonBase || "Meets primary social and financial eligibility criteria"];

      // Amount matching
      if (scheme.loan_amount_max && userAmt <= scheme.loan_amount_max) {
        score += 15;
        reasons.push(t?.reasonAmountWithin ? t.reasonAmountWithin(userAmt, scheme.loan_amount_max) : `Requested ₹${userAmt.toLocaleString("en-IN")} is within maximum ceiling of ${scheme.maxAmount}`);
      } else if (scheme.loan_amount_max) {
        reasons.push(t?.reasonAmountExceed ? t.reasonAmountExceed(scheme.loan_amount_max) : `Can fund up to maximum ceiling of ${scheme.maxAmount}`);
      }

      if (scheme.loan_amount_min && userAmt >= scheme.loan_amount_min) {
        score += 5;
      }

      // Gender specific targeting
      const schemeCat = (scheme.beneficiary_category || "");
      const schemeTg = (scheme.target_groups || []).join(" ");
      if (schemeCat.includes("Women") || schemeTg.includes("Women")) {
        if (gender === "female") {
          score += 25;
          if (t?.reasonWomen) reasons.push(t.reasonWomen);
        }
      }

      // Age targeting
      if (scheme.minimum_age && userAge >= scheme.minimum_age && scheme.maximum_age && userAge <= scheme.maximum_age) {
        score += 5;
      }

      // Area & subsidy bonus
      if (urbanRural === "rural" && (scheme.subsidy_percentage > 0 || scheme.id === "pmegp")) {
        score += 9;
        if (t?.reasonRuralBonus) reasons.push(t.reasonRuralBonus);
      }

      const subsidyAmount = scheme.subsidy_percentage > 0 ? Math.round((userAmt * scheme.subsidy_percentage) / 100) : 0;

      return {
        ...getLocalizedScheme(scheme, lang),
        matchScore: Math.min(score, 99),
        match: `${Math.min(score, 99)}%`,
        reasons,
        desc: scheme.shortDesc,
        why: reasons.join(" "),
        amount: scheme.maxAmount,
        calcInterest: scheme.interest_rate_min || 4,
        estimatedSubsidy: subsidyAmount > 0 ? `₹${subsidyAmount.toLocaleString("en-IN")}` : "Nil"
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
