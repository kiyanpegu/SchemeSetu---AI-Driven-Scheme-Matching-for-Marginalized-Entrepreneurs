import { schemes } from '../src/data/schemes.js';
import { getLocalizedScheme } from '../src/data/schemeTranslations.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { category, max_income, max_cost, type, search, lang = 'en', id } = req.query || {};

    // Single scheme lookup
    if (id) {
      const found = schemes.find(s => s.id === id);
      if (!found) {
        return res.status(404).json({ success: false, error: 'Scheme not found' });
      }
      return res.status(200).json({
        success: true,
        scheme: getLocalizedScheme(found, lang)
      });
    }

    let filtered = [...schemes];

    if (category && category.toLowerCase() !== 'all') {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(s => 
        (s.beneficiary_category && s.beneficiary_category.toLowerCase().includes(catLower)) ||
        (s.target_groups && s.target_groups.some(tg => tg.toLowerCase().includes(catLower)))
      );
    }

    if (max_income && !isNaN(Number(max_income))) {
      const inc = Number(max_income);
      filtered = filtered.filter(s => !s.annual_family_income_limit || s.annual_family_income_limit >= inc);
    }

    if (max_cost && !isNaN(Number(max_cost))) {
      const cost = Number(max_cost);
      filtered = filtered.filter(s => !s.project_cost_max || s.project_cost_max >= cost);
    }

    if (type) {
      const typeLower = type.toLowerCase();
      filtered = filtered.filter(s => s.scheme_type && s.scheme_type.toLowerCase().includes(typeLower));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.shortDesc.toLowerCase().includes(q) ||
        (s.eligible_activities && s.eligible_activities.some(a => a.toLowerCase().includes(q)))
      );
    }

    const localizedSchemes = filtered.map(s => getLocalizedScheme(s, lang));

    return res.status(200).json({
      success: true,
      total_in_db: schemes.length,
      count: localizedSchemes.length,
      language: lang,
      schemes: localizedSchemes
    });
  } catch (err) {
    console.error('Error in /api/schemes:', err);
    return res.status(500).json({ success: false, error: 'Internal server error processing schemes request' });
  }
}

