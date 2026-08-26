# AI Handoff & Project Context

## 🎯 Project Overview
- **Event:** Smart India Hackathon 2024/2025
- **Problem Statement ID:** 26092
- **Title:** AI-Driven Scheme Matching for Marginalized Entrepreneurs
- **Organization:** Ministry of Social Justice and Empowerment (MoSJE)
- **Current Status:** Feature-complete (Frontend Architecture). Ready for deployment.

## 🏗️ Architecture & Tech Stack (Path A)
- **Framework:** React.js + Vite (Frontend-only)
- **Styling:** Tailwind CSS
- **AI Integration:** Google Generative AI (Gemini SDK) for chatbot.
- **Routing:** React Router DOM
- **State:** React Hooks + `sessionStorage` (for language modal)
- **Database:** Local hardcoded datasets (`src/data/schemes.js` and `src/data/partners.js`) acting as the mock backend.

## ✅ Completed Tasks (Current State)
1. **Data Overhaul:** Injected realistic, comprehensive MoSJE/NSFDC scheme data including `annual_family_income_limit`, `subsidy_percentage`, `verification_status`, and `online_application_available` flags.
2. **Dynamic Matching Engine:** Rewrote `engineMatches` in `App.jsx` to dynamically filter schemes based on user inputs (income, purpose, age, gender) instead of static IDs.
3. **Geospatial Partner Locator:** Interactive map filtering State Channelizing Agencies (SCAs) and Public Sector Banks (PSBs). Includes "Get Directions" logic utilizing universal Google Maps `dir` API.
4. **UI Improvements:** EMI Calculator formatting fixed, Language Modal configured to persist via `sessionStorage`, and "Apply Now" buttons updated to display dynamic partner agency names and offline application requirements.
5. **Provenance:** Added transparency UI to Scheme Details showing the exact source URL and verification timestamps to comply with strict SIH data rules.

## 🚀 Next Steps / Pending Tasks (For Teammate)
The primary remaining goal is **Deployment**.

1. **Pull Latest Code:** Ensure you are on the latest commit of the `main` branch.
2. **Create Local Env (Optional):** If testing locally, duplicate `.env.example` to `.env` and add the `VITE_GEMINI_API_KEY`.
3. **Deploy to Cloud:** Deploy the project using Vercel, Netlify, or Firebase Hosting. 
   - *Build Command:* `npm run build`
   - *Output Directory:* `dist`
4. **Configure Environment Variables:** **CRITICAL:** Ensure you add `VITE_GEMINI_API_KEY` to the Environment Variables settings in your Vercel/Netlify dashboard, otherwise the AI Chatbot will crash in production.
5. **Test Live Site:** Verify that the matching engine, map routing, and Gemini chatbot function correctly on the live URL.

---
*Note to AI Assistants (Antigravity/Cursor/Copilot): Read this file to understand the project's current state and strict frontend-only architecture before suggesting backend databases or full-stack rewrites.*
