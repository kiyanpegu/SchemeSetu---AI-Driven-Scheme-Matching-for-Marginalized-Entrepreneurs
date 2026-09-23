# SchemeSetu

A web app that helps marginalized entrepreneurs figure out which government-backed financial scheme fits their situation and where they actually need to apply.

## 🚀 Live Demo

**[Check out the live deployment here!](https://schemesetuai.vercel.app/)**

## About

We built SchemeSetu for the Smart India Hackathon to solve a practical problem. There are plenty of government financial schemes for marginalized entrepreneurs (like those from MoSJE and NSFDC), but they often go underutilized. The main issues are lack of awareness, complicated eligibility rules, and confusion about which local bank branch actually processes the applications.

We wanted to build something simple. A user can enter basic details about their financial situation, immediately see what schemes they qualify for, figure out how much the loan might cost them, and find the nearest authorized bank branch to start the process.

## What It Does

The main flow works like this:

1. **Language Selection:** The user picks their preferred language (English, Hindi, or Assamese).
2. **Basic Profiling:** They fill out a quick form with their caste, family income, age, and the loan amount they need.
3. **Eligibility Matching:** The app filters out schemes they don't qualify for and recommends the ones that fit.
4. **Financial Planning:** Users can calculate estimated EMIs based on the specific interest rates of their matched schemes.
5. **Partner Routing:** A locator map shows them the nearest authorized bank or State Channelizing Agency (SCA) to physically apply at, along with Google Maps directions.

## Key Features

- **Trilingual Localization (`en`, `hi`, `as`):** Full language support across English, Hindi (हिन्दी), and Assamese (অসমীয়া) with native Web Speech STT/TTS.
- **Comprehensive Scheme Library (27 Verified Schemes):** Complete coverage across MoSJE, NSFDC, NBCFDC, NSKFDC, and central programs (SC, ST, OBC, Safai Karamcharis, Women, Artisans, Street Vendors).
- **Deterministic AI Matching Engine:** Real-time eligibility evaluation based on caste, income, age, gender, and project cost ceilings.
- **AI Business Feasibility Engine:** Powered by Gemini 2.5 Flash to convert enterprise ideas into bank-defensible capital allocations, license lists, and roadmaps.
- **AI Caste Certificate OCR Scanner:** Gemini Vision document scanner with 1-click sample demo mode for zero-typing applicant onboarding.
- **Bank Application Readiness Dossier:** Standardized, printable A4 verification slip with official seals and document checklists to eliminate last-mile bank counter rejection.
- **MoSJE Nodal Telemetry Dashboard:** District-level demand heatmaps, channel partner absorption charts, and live dossier audit logs.
- **Geospatial Channel Partner Locator:** Interactive map routing beneficiaries to nearby PSBs, RRBs (Assam Gramin Vikash Bank), and SCAs with Google Maps GPS directions.

## Full-Stack Architecture & REST API

SchemeSetu operates as a **Full-Stack Application** featuring an integrated Vercel Serverless REST API layer with resilient offline fallback:

### Serverless REST Endpoints (`/api/*`)

- `GET /api/health` — System status, scheme database count, and uptime metrics.
- `GET /api/schemes` — Filter schemes by `category`, `max_income`, `type`, `search`, and `lang`.
- `POST /api/match` — Server-side deterministic scheme matching with capital subsidy calculations.
- `POST /api/analyze` — Server-side Gemini 2.5 Flash feasibility generation (shields API keys).
- `POST & GET /api/dossier` — Registers and retrieves beneficiary application dossiers with official tracking IDs (`SETU-2026-XXXXX`).
- `GET /api/telemetry` — Live ministry analytics, district demand heatmaps, and partner disbursement rates.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4
- **Backend:** Node.js Serverless Functions (Vercel API Architecture & Vite Dev Middleware)
- **AI & Vision:** Google Gemini 2.5 Flash & Multimodal Vision (`@google/generative-ai`)
- **Mapping:** React Leaflet, OpenStreetMap, Google Maps Navigation
- **Voice Accessibility:** Web Speech API (Bidirectional Speech-to-Text & Text-to-Speech)
- **Deployment:** Vercel Edge Network with SSL & OpenGraph Optimization

## Data & Verified Sources

SchemeSetu indexes **27 verified government financial assistance schemes** transcribed directly from official gazettes and statutory corporations:

- **Ministry of Social Justice and Empowerment (MoSJE):** [https://socialjustice.gov.in/](https://socialjustice.gov.in/)
- **National Scheduled Castes Finance and Development Corporation (NSFDC):** [https://nsfdc.nic.in/](https://nsfdc.nic.in/)
- **National Backward Classes Finance & Development Corporation (NBCFDC):** [https://nbcfdc.gov.in/](https://nbcfdc.gov.in/)
- **National Safai Karamcharis Finance & Development Corporation (NSKFDC):** [https://nskfdc.nic.in/](https://nskfdc.nic.in/)
- **Stand-Up India / PM Vishwakarma / PMEGP / MUDRA:** Official guidelines linked per scheme card.

## Application Process

The app doesn't collect or submit loan applications itself. Instead, it acts as a bridge:

- If a scheme has an official online application portal, we provide the direct link.
- If it requires an offline application, we map the user to the nearest authorized Public Sector Bank (PSB) or State Channelizing Agency (SCA) and list the documents they need to bring.

## Project Structure

- `src/App.jsx`: The main application file containing the routing, matching logic, and most UI components.
- `src/data/schemes.js`: The dataset containing scheme rules, interest rates, and eligibility criteria.
- `src/data/partners.js`: The dataset of physical bank branches and SCAs.
- `src/index.css`: Tailwind imports and global styles.

## Running Locally

### Prerequisites

- Node.js installed

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd SchemeSetu/schemesetu
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

3. Create a `.env` file in the root directory (you can copy `.env.example`).
4. Add your Gemini API key (needed for the chatbot):
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### Running the App

5. Start the Vite development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:5173` in your browser.

## Environment Variables

- `VITE_GEMINI_API_KEY` (Optional, but required for the chatbot to work)

## Current Status

This is our SIH development prototype. The frontend, matching engine, UI translation, and data models are fully implemented.

## SIH Context

Built for the Smart India Hackathon.
**Problem Statement:** 26092 - AI-Driven Scheme Matching for Marginalized Entrepreneurs (Ministry of Social Justice and Empowerment).

## Roadmap

**Implemented:**

- Core deterministic rule-based matching engine for 100% legal compliance
- Multi-lingual UI implementation (English, Hindi, Assamese)
- Multilingual Voice Accessibility (Web Speech API STT voice input and TTS scheme narration)
- AI Business Idea Feasibility & Scheme Fit Analyzer (Gemini-powered feasibility assessment & 3-step action roadmap)
- AI Document OCR & Certificate Scanner (Auto-extracts applicant name, caste, and income to pre-fill profile)
- Official Printable Bank Application Dossier (A4 readiness slip with mandatory checklist & partner branch routing)
- MoSJE & Channel Partner Nodal Administration Portal (`/admin` district demand telemetry & absorption rates)
- Interactive Partner Bank Locator (PSBs, RRBs, SCAs) with Google Maps intent links
- Scheme-specific EMI Calculator with NSFDC moratorium grace period logic
- Gemini-powered Conversational Assistant with voice input and audio readout

**Planned (Production Scale):**

- Centralized PostgreSQL/Supabase database for live scheme updates without redeploying code
- DigiLocker API integration for automated government credential fetching
- Aadhaar-based e-KYC and direct SCA application forwarding

## Disclaimer

The platform is intended to help users discover and understand potentially relevant schemes. Final eligibility, approval, financial terms, and application acceptance are determined by the respective government authority or channelizing agency and are subject to their current rules.
