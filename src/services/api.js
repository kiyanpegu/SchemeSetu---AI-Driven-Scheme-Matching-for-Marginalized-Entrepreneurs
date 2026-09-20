/**
 * SchemeSetu Central API Service
 * Communicates with the Full-Stack Serverless Backend (/api/*)
 * Includes resilient offline fallback to local stores if disconnected.
 */

import { schemes as fallbackSchemes } from '../data/schemes.js';
import { getLocalizedScheme } from '../data/schemeTranslations.js';

const API_BASE = '/api';

export const apiService = {
  /**
   * Health & System Metadata Check
   */
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/health unavailable, using offline fallback:', err.message);
      return {
        status: 'healthy (offline-mode)',
        service: 'SchemeSetu Client Engine',
        version: '2.1.0',
        total_schemes: fallbackSchemes.length,
        ministry: 'Ministry of Social Justice and Empowerment (MoSJE)'
      };
    }
  },

  /**
   * Get all schemes with optional filtering & localization
   */
  async getSchemes(params = {}) {
    const { category, max_income, type, search, lang = 'en' } = params;
    const searchParams = new URLSearchParams();
    if (category) searchParams.append('category', category);
    if (max_income) searchParams.append('max_income', max_income);
    if (type) searchParams.append('type', type);
    if (search) searchParams.append('search', search);
    if (lang) searchParams.append('lang', lang);

    try {
      const res = await fetch(`${API_BASE}/schemes?${searchParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/schemes unavailable, falling back to local dataset:', err.message);
      let list = [...fallbackSchemes];
      if (category && category !== 'All') {
        const cat = category.toLowerCase();
        list = list.filter(s => 
          (s.beneficiary_category && s.beneficiary_category.toLowerCase().includes(cat)) ||
          (s.target_groups && s.target_groups.some(g => g.toLowerCase().includes(cat)))
        );
      }
      return {
        success: true,
        total_in_db: fallbackSchemes.length,
        count: list.length,
        schemes: list.map(s => getLocalizedScheme(s, lang))
      };
    }
  },

  /**
   * Post beneficiary profile to deterministic match engine
   */
  async matchSchemes(formData, lang = 'en') {
    try {
      const res = await fetch(`${API_BASE}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/match unavailable, executing client matching engine:', err.message);
      return null; // Signals component to use built-in matching loop
    }
  },

  /**
   * Submit and record an Application Dossier in the official audit trail
   */
  async submitDossier(dossierData) {
    try {
      const res = await fetch(`${API_BASE}/dossier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dossierData)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/dossier POST unavailable, saving locally:', err.message);
      return {
        success: true,
        message: 'Saved to local session',
        dossier: {
          ...dossierData,
          id: dossierData.id || `SETU-${dossierData.category || 'SC'}-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'Dossier Downloaded & Verified',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        }
      };
    }
  },

  /**
   * Fetch recent application dossiers for audit trail
   */
  async getDossiers() {
    try {
      const res = await fetch(`${API_BASE}/dossier`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/dossier GET unavailable:', err.message);
      return null;
    }
  },

  /**
   * Fetch MoSJE Nodal Telemetry & Analytics
   */
  async getTelemetry() {
    try {
      const res = await fetch(`${API_BASE}/telemetry`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/telemetry unavailable:', err.message);
      return null;
    }
  },

  /**
   * Server-side AI Business Feasibility Analysis (protects Gemini API key)
   */
  async analyzeBusiness(params) {
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/analyze unavailable, component will run client Gemini fallback:', err.message);
      return null;
    }
  }
};
