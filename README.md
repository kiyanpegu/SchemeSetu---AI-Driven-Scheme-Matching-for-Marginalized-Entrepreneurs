# SchemeSetu

A web app that helps marginalized entrepreneurs figure out which government-backed financial scheme fits their situation and where they actually need to apply.

## 🚀 Live Demo
**[Check out the live deployment here!](https://scheme-setu-ai-driven-scheme-matching.vercel.app)**

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

- Rule-based eligibility matching
- Scheme-specific EMI calculator
- Interactive authorized partner (bank) locator
- Multi-lingual UI (English, Hindi, Assamese)
- AI Chatbot for answering basic scheme-related queries
- Direct links to official government portals

## How It Works

Right now, SchemeSetu is a frontend-only application. 

The eligibility matching runs entirely in the browser using React state. We built static datasets for both the schemes (`schemes.js`) and the channel partners (`partners.js`) based on NSFDC and MoSJE guidelines. 

When a user submits their profile, the app evaluates their inputs against the dataset rules (like checking if their income is below the `annual_family_income_limit` and if their age fits the bracket) to return valid matches.

## Tech Stack

- **Frontend:** React.js, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI Chatbot:** Google Gemini API (`@google/genai`)
- **Routing:** React Router DOM
- **State:** React Hooks and Session Storage

*(Note: There is no backend server or database in this prototype. All data is handled locally via JS files).*

## Data & Sources

Because this app deals with government financial schemes, we tried to be as accurate as possible with the data. The information in `schemes.js` was transcribed from the NSFDC and MoSJE official portals. 

Each scheme detail page includes a "Data Source" section with a link pointing back to the official government page, so users can verify the information themselves.

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
- Core matching engine and static data models
- Multi-lingual UI implementation
- Partner locator and scheme-specific EMI calculator
- Gemini-powered chatbot for basic financial queries
- Active tab routing and UI highlighting

**Planned:**
- Move static datasets to a real backend (Node.js/PostgreSQL)
- Add document OCR to automatically fill the profile form from an uploaded caste/income certificate

## Disclaimer

The platform is intended to help users discover and understand potentially relevant schemes. Final eligibility, approval, financial terms, and application acceptance are determined by the respective government authority or channelizing agency and are subject to their current rules.
