# SchemeSetu - AI-Driven Scheme Matching for Marginalized Entrepreneurs

**Smart India Hackathon 2026 
**Problem Statement ID:** 26092  
**Organization:** Ministry of Social Justice and Empowerment (MoSJE)  
**Theme:** Smart Automation  
**Category:** Software  

## 📖 Overview

SchemeSetu is an intelligent, multi-lingual, web-based platform designed to bridge the gap between marginalized entrepreneurs (Scheduled Castes, Scheduled Tribes, Women, etc.) and vital government financial schemes.

Many government schemes provided by the MoSJE, NSFDC, and others are underutilized because the target demographic often lacks awareness, struggles to understand complex eligibility criteria, or doesn't know where to apply. SchemeSetu solves this by using a **Dynamic AI Matching Engine** to pair users with the exact financial schemes they are eligible for, and then geographically mapping them to the nearest authorized channel partners (SCAs / PSBs) to complete their application.

## 🚀 Key Features

* **Intelligent Scheme Matching:** A robust, rule-based engine that evaluates user criteria (family income, caste, age, gender, business purpose, loan amount) against strict scheme parameters.
* **Comprehensive Government Database:** Integrated with detailed, verifiable data on schemes like NSFDC Term Loan, Mahila Samriddhi Yojana, VCF-SC, PMMY, and more.
* **Geospatial Partner Locator:** Interactive map filtering nearest State Channelizing Agencies (SCAs) and Public Sector Banks (PSBs) authorized to process the user's matched schemes.
* **Multi-Lingual Support:** Fully translated UI in English, Hindi, and Assamese to cater to rural and marginalized communities.
* **AI Chatbot Assistant:** Powered by the Gemini API, an interactive chatbot that answers queries about financial literacy, business planning, and scheme details in plain language.
* **Provenance & Verification:** Full transparency with direct links to official government portals and verification timestamps, ensuring users are not misled by fabricated data.
* **Dynamic EMI Calculator:** Built-in financial planning tool tailored to the specific interest rates and moratorium periods of the recommended schemes.

## 🛠️ Technology Stack

* **Frontend:** React.js, Vite
* **Styling:** Tailwind CSS, Lucide Icons
* **Maps Integration:** React Leaflet / Leaflet.js
* **AI Integration:** Google Generative AI (Gemini) SDK
* **State Management:** React Hooks, Session Storage
* **Routing:** React Router DOM

## ⚙️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd SchemeSetu/schemesetu
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory (`schemesetu/.env`) and add your Gemini API Key for the chatbot:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Visit `http://localhost:5173` in your browser.

## 🗺️ Application Flow

1. **Language Selection:** User selects their preferred language (persisted via session storage).
2. **Profile Creation:** User enters their demographic and financial details.
3. **AI Matching:** The engine processes the data and outputs a ranked list of eligible schemes with match percentages and explicit reasons for the match.
4. **Scheme Details:** User reviews the scheme parameters (subsidy, interest, max loan).
5. **Application Route:** The platform directs the user to either the official online portal or the nearest authorized physical branch (Partner Locator).
6. **Navigation:** User clicks "Get Directions" to open Google Maps natively to the chosen branch.

## 📜 License

This project was developed for the Smart India Hackathon.
