import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Landmark, Calculator, MapPin, Search, BrainCircuit, ShieldCheck, Users, ChevronRight, ChevronLeft, MessageCircle, X, Send, Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GoogleGenAI } from '@google/genai';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- TRANSLATIONS DICTIONARY ---
// --- TRANSLATIONS DICTIONARY ---
const translations = {
  en: {
    schemeEdu: "Education Loan Scheme",
    descEdu: "Up to ₹20L for studies in India at 4% p.a. (3.5% for women).",
    schemeSSY: "Shilpi Samriddhi Yojana (SSY)",
    descSSY: "Financial assistance up to ₹1.4L for traditional artisans and craftsmen at 5% p.a.",
    schemeMSY: "Mahila Samriddhi Yojana (MSY)",
    descMSY: "Highly subsidized loan at 4% p.a. specifically for female entrepreneurs.",
    schemeTerm: "Term Loan Scheme",
    descTerm: "Large scale business funding up to ₹50 Lakhs at 6-10% p.a.",
    schemeNone: "Not Eligible for NSFDC",
    descNone: "NSFDC schemes strictly require a valid SC Caste Certificate and family income under ₹5 Lakhs.",
    qAge: "What is your age?",
    qLoc: "Where are you located?",
    rural: "Rural (Village)",
    urban: "Urban (City)",
    qSkill: "Current Skill Level?",
    unskilled: "Unskilled / Labor",
    skilled: "Skilled Artisan / Trade",
    professional: "Professional / Degree",
    qDocs: "Eligibility Checks",
    hasCaste: "Do you have a valid SC Caste Certificate?",
    yes: "Yes",
    no: "No",
    isDisabled: "Do you have a certified disability (Divyangjan)?",
    eduLabel: "Education Status",
    edu1: "Below 10th",
    edu2: "10th / 12th Pass",
    edu3: "Graduate / Post-Graduate",
    resultsTitle: "Your AI Matches",
    resultsSub: "Based on your needs, here are the best NSFDC schemes.",
    matchText: "98% MATCH",
    mcfTitle: "Micro Credit Finance (MCF)",
    mcfDesc: "Perfect for small income-generating activities.",
    subtitle: "Bridging the gap between SC communities and financial empowerment through intelligent, AI-driven scheme matching.",
    findBtn: "Find Your Scheme",
    emiBtn: "EMI Calculator",
    navFind: "Find Scheme",
    navLocate: "Locate Partner",
    calcTitle: "Advanced Loan EMI Calculator",
    calcSub: "Includes NSFDC Moratorium (Grace Period) Calculations",
    loanAmt: "Loan Amount",
    intRate: "Interest Rate (p.a.)",
    tenure: "Total Loan Tenure",
    moratorium: "Moratorium Period (Grace Period)",
    monthlyEmi: "Your Monthly EMI",
    findTitle: "Find Your Perfect Scheme",
    findSub: "Answer a few questions to get AI-matched recommendations.",
    mapTitle: "Find a Channel Partner",
    mapSub: "Locate SCAs and Banks near you to apply for schemes.",
    search: "Search by city...",
    qPurpose: "Funding Purpose?",
    startBiz: "Start Business",
    expBiz: "Expand Business",
    edu: "Education",
    artisan: "Artisan",
    nextBtn: "Next",
    backBtn: "Back",
    matchBtn: "Find Matches",
    qAmt: "Funding Amount?",
    qInc: "Family Income?",
    qFinal: "Final Details",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    state: "State"
  },
  hi: {
    schemeEdu: "शिक्षा ऋण योजना",
    descEdu: "भारत में पढ़ाई के लिए ₹20 लाख तक 4% प्रति वर्ष (महिलाओं के लिए 3.5%)।",
    schemeSSY: "शिल्पी समृद्धि योजना (SSY)",
    descSSY: "पारंपरिक कारीगरों और शिल्पकारों के लिए 5% प्रति वर्ष पर ₹1.4 लाख तक की सहायता।",
    schemeMSY: "महिला समृद्धि योजना (MSY)",
    descMSY: "विशेष रूप से महिला उद्यमियों के लिए 4% प्रति वर्ष पर अत्यधिक रियायती ऋण।",
    schemeTerm: "टर्म लोन योजना",
    descTerm: "6-10% प्रति वर्ष पर ₹50 लाख तक का बड़े पैमाने पर व्यापार वित्तपोषण।",
    schemeNone: "NSFDC के लिए पात्र नहीं",
    descNone: "NSFDC योजनाओं के लिए वैध एससी जाति प्रमाण पत्र और पारिवारिक आय ₹5 लाख से कम होना अनिवार्य है।",
    qAge: "आपकी आयु क्या है?",
    qLoc: "आप कहाँ स्थित हैं?",
    rural: "ग्रामीण (गाँव)",
    urban: "शहरी (शहर)",
    qSkill: "वर्तमान कौशल स्तर?",
    unskilled: "अकुशल",
    skilled: "कुशल कारीगर",
    professional: "पेशेवर / डिग्री",
    qDocs: "पात्रता जांच",
    hasCaste: "क्या आपके पास वैध एससी जाति प्रमाण पत्र है?",
    yes: "हाँ",
    no: "नहीं",
    isDisabled: "क्या आपके पास प्रमाणित विकलांगता (दिव्यांगजन) है?",
    eduLabel: "शिक्षा की स्थिति",
    edu1: "10वीं से नीचे",
    edu2: "10वीं / 12वीं पास",
    edu3: "स्नातक / स्नातकोत्तर",
    resultsTitle: "आपके एआई मिलान",
    resultsSub: "आपकी आवश्यकताओं के आधार पर, यहाँ सर्वश्रेष्ठ NSFDC योजनाएँ हैं।",
    matchText: "98% मिलान",
    mcfTitle: "माइक्रो क्रेडिट फाइनेंस (MCF)",
    mcfDesc: "छोटे आय-सृजन गतिविधियों के लिए बिल्कुल सही।",
    subtitle: "बुद्धिमान एआई-संचालित योजना मिलान के माध्यम से एससी समुदायों और वित्तीय सशक्तिकरण के बीच की खाई को पाटना।",
    findBtn: "अपनी योजना खोजें",
    emiBtn: "ईएमआई कैलकुलेटर",
    navFind: "योजना खोजें",
    navLocate: "पार्टनर खोजें",
    calcTitle: "उन्नत ऋण ईएमआई कैलकुलेटर",
    calcSub: "NSFDC मोरेटोरियम (रियायती अवधि) गणना शामिल है",
    loanAmt: "ऋण राशि",
    intRate: "ब्याज दर (प्रति वर्ष)",
    tenure: "कुल ऋण अवधि",
    moratorium: "मोरेटोरियम अवधि",
    monthlyEmi: "आपकी मासिक ईएमआई",
    findTitle: "अपनी आदर्श योजना खोजें",
    findSub: "AI अनुशंसाएं प्राप्त करने के लिए कुछ प्रश्नों के उत्तर दें।",
    mapTitle: "चैनल पार्टनर खोजें",
    mapSub: "योजनाओं के लिए आवेदन करने के लिए अपने आस-पास SCA और बैंक खोजें।",
    search: "शहर से खोजें...",
    qPurpose: "फंडिंग का उद्देश्य?",
    startBiz: "व्यवसाय शुरू करें",
    expBiz: "व्यवसाय बढ़ाएं",
    edu: "शिक्षा",
    artisan: "शिल्पकार",
    nextBtn: "अगला",
    backBtn: "पीछे",
    matchBtn: "मिलान खोजें",
    qAmt: "फंडिंग राशि?",
    qInc: "पारिवारिक आय?",
    qFinal: "अंतिम विवरण",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    state: "राज्य"
  },
  as: {
    schemeEdu: "শিক্ষা ঋণ আঁচনি",
    descEdu: "ভাৰতত অধ্যয়নৰ বাবে বাৰ্ষিক ৪% হাৰত (মহিলাৰ বাবে ৩.৫%) ২০ লাখ টকালৈকে।",
    schemeSSY: "শিল্পী সমৃদ্ধি যোজনা (SSY)",
    descSSY: "পৰম্পৰাগত শিল্পী আৰু কাৰিকৰসকলৰ বাবে বাৰ্ষিক ৫% হাৰত ১.৪ লাখ টকালৈকে সাহায্য।",
    schemeMSY: "মহিলা সমৃদ্ধি যোজনা (MSY)",
    descMSY: "বিশেষকৈ মহিলা উদ্যোগীসকলৰ বাবে বাৰ্ষিক ৪% হাৰত ৰাজসাহায্য যুক্ত ঋণ।",
    schemeTerm: "ম্যাদী ঋণ আঁচনি",
    descTerm: "বাৰ্ষিক ৬-১০% হাৰত ৫০ লাখ টকালৈকে বৃহৎ ব্যৱসায়িক পুঁজি।",
    schemeNone: "NSFDC ৰ বাবে যোগ্য নহয়",
    descNone: "NSFDC আঁচনিসমূহৰ বাবে বৈধ অনুসূচিত জাতিৰ প্ৰমাণপত্ৰ আৰু আয় ৫ লাখতকৈ কম হোৱাটো অপৰিহাৰ্য।",
    qAge: "আপোনাৰ বয়স কিমান?",
    qLoc: "আপুনি ক'ত অৱস্থিত?",
    rural: "গ্ৰাম্য (গাওঁ)",
    urban: "নগৰীয়া (চহৰ)",
    qSkill: "বৰ্তমানৰ দক্ষতাৰ স্তৰ?",
    unskilled: "অদক্ষ",
    skilled: "দক্ষ শিল্পী",
    professional: "পেছাদাৰী / ডিগ্ৰী",
    qDocs: "যোগ্যতা পৰীক্ষা",
    hasCaste: "আপোনাৰ বৈধ অনুসূচিত জাতিৰ প্ৰমাণপত্ৰ আছে নেকি?",
    yes: "হয়",
    no: "নহয়",
    isDisabled: "আপোনাৰ প্ৰমাণিত অক্ষমতা আছে নেকি?",
    eduLabel: "শিক্ষাৰ অৱস্থা",
    edu1: "দশম শ্ৰেণীৰ তলত",
    edu2: "দশম / দ্বাদশ উত্তীৰ্ণ",
    edu3: "স্নাতক / স্নাতকোত্তৰ",
    resultsTitle: "আপোনাৰ এআই মেচ",
    resultsSub: "আপোনাৰ প্ৰয়োজনৰ ভিত্তিত, ইয়াত শ্ৰেষ্ঠ NSFDC আঁচনিসমূহ দিয়া হ'ল।",
    matchText: "৯৮% মেচ",
    mcfTitle: "মাইক্ৰ' ক্ৰেডিট ফাইনেঞ্চ (MCF)",
    mcfDesc: "সৰু আয়-উপাৰ্জনমূলক কাৰ্যকলাপৰ বাবে নিখুঁত।",
    subtitle: "এআইৰ জৰিয়তে অনুসূচিত জাতিৰ লোকসকলক বিত্তীয়ভাৱে সৱলীকৰণ কৰা আৰু ব্যৱধান দূৰ কৰা।",
    findBtn: "আপোনাৰ আঁচনি বিচাৰক",
    emiBtn: "ইএমআই কেলকুলেটৰ",
    navFind: "আঁচনি বিচাৰক",
    navLocate: "অংশীদাৰ বিচাৰক",
    calcTitle: "উন্নত ঋণ ইএমআই কেলকুলেটৰ",
    calcSub: "NSFDC মৰেটৰিয়াম (গ্ৰেছ পিৰিয়ড) গণনা অন্তৰ্ভুক্ত",
    loanAmt: "ঋণৰ পৰিমাণ",
    intRate: "সুদৰ হাৰ",
    tenure: "মুঠ ঋণৰ ম্যাদ",
    moratorium: "মৰেটৰিয়ামৰ ম্যাদ",
    monthlyEmi: "আপোনাৰ মাহেকীয়া ইএমআই",
    findTitle: "আপোনাৰ নিখুঁত আঁচনি বিচাৰক",
    findSub: "AI পৰামৰ্শ পাবলৈ কেইটামান প্ৰশ্নৰ উত্তৰ দিয়ক।",
    mapTitle: "চেনেল অংশীদাৰ বিচাৰক",
    mapSub: "আঁচনিৰ বাবে আবেদন কৰিবলৈ আপোনাৰ ওচৰৰ SCA আৰু বেংক বিচাৰক।",
    search: "চহৰ অনুসৰি বিচাৰক...",
    qPurpose: "পুঁজিৰ উদ্দেশ্য?",
    startBiz: "ব্যৱসায় আৰম্ভ কৰক",
    expBiz: "ব্যৱসায় সম্প্ৰসাৰণ কৰক",
    edu: "শিক্ষা",
    artisan: "শিল্পকাৰ",
    nextBtn: "পৰৱৰ্তী",
    backBtn: "উভতি যাওক",
    matchBtn: "মিলন বিচাৰক",
    qAmt: "পুঁজিৰ পৰিমাণ?",
    qInc: "পৰিয়ালৰ আয়?",
    qFinal: "চূড়ান্ত বিৱৰণ",
    gender: "লিংগ",
    male: "পুৰুষ",
    female: "মহিলা",
    other: "অন্য",
    state: "ৰাজ্য"
  }
};

// --- INITIAL LANGUAGE MODAL ---
const LanguageModal = ({ setLang }) => (
  <div className="fixed inset-0 bg-blue-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-500">
      <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
        <Globe size={32} />
      </div>
      <h2 className="text-3xl font-extrabold text-brand-blue mb-2">Welcome to SchemeSetu</h2>
      <p className="text-gray-600 mb-8">Please select your preferred language to continue</p>
      
      <div className="flex flex-col gap-4">
        <button onClick={() => setLang('en')} className="p-4 rounded-xl border-2 border-gray-200 hover:border-brand-blue hover:bg-blue-50 font-bold text-xl text-gray-800 transition-all flex justify-between items-center group">
          <span>🇺🇸 English</span> <ChevronRight className="text-gray-400 group-hover:text-brand-blue" />
        </button>
        <button onClick={() => setLang('hi')} className="p-4 rounded-xl border-2 border-gray-200 hover:border-brand-blue hover:bg-blue-50 font-bold text-xl text-gray-800 transition-all flex justify-between items-center group">
          <span>🇮🇳 हिन्दी</span> <ChevronRight className="text-gray-400 group-hover:text-brand-blue" />
        </button>
        <button onClick={() => setLang('as')} className="p-4 rounded-xl border-2 border-gray-200 hover:border-brand-blue hover:bg-blue-50 font-bold text-xl text-gray-800 transition-all flex justify-between items-center group">
          <span>🦏 অসমীয়া</span> <ChevronRight className="text-gray-400 group-hover:text-brand-blue" />
        </button>
      </div>
    </div>
  </div>
);

// --- HOME COMPONENT ---
const Home = ({ lang }) => {
  const t = translations[lang];
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 animate-in fade-in duration-700">
      <div className="bg-white/60 backdrop-blur-sm p-2 pr-6 rounded-full inline-flex items-center gap-3 mb-8 border border-blue-100 shadow-sm">
        <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">SIH 2026</span>
        <span className="text-sm font-medium text-gray-700">Built by Team MISFITS</span>
      </div>
      <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-500 drop-shadow-sm">
        SchemeSetu
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl leading-relaxed">{t.subtitle}</p>
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <Link to="/find" className="bg-gradient-to-r from-brand-orange to-orange-400 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:-translate-y-1 flex items-center transition-all duration-300 text-lg">
          <Search className="mr-3" size={24} /> {t.findBtn}
        </Link>
        <Link to="/calculator" className="bg-white hover:bg-gray-50 text-brand-blue font-bold py-4 px-8 rounded-xl shadow-md border-2 border-transparent hover:border-blue-100 flex items-center hover:-translate-y-1 transition-all duration-300 text-lg">
          <Calculator className="mr-3" size={24} /> {t.emiBtn}
        </Link>
      </div>
    </div>
  );
};

// --- ADVANCED EMI CALCULATOR ---
const CalculatorPage = ({ lang }) => {
  const t = translations[lang];
  const [loanAmount, setLoanAmount] = useState(140000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [moratorium, setMoratorium] = useState(6);

  const p = Number(loanAmount);
  const r = Number(interestRate) / 12 / 100;
  const emiMonths = (Number(tenureYears) * 12) - Number(moratorium);
  let emi = 0, totalPayable = 0, totalInterest = 0;
  
  if (p > 0 && r > 0 && emiMonths > 0) {
    const accruedInterest = p * r * Number(moratorium);
    const adjustedPrincipal = p + accruedInterest;
    emi = (adjustedPrincipal * r * Math.pow(1 + r, emiMonths)) / (Math.pow(1 + r, emiMonths) - 1);
    totalPayable = emi * emiMonths;
    totalInterest = totalPayable - p;
  }

    const formatCurrency = (amount) => new Intl.NumberFormat(lang + '-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0,
    numberingSystem: lang === 'hi' ? 'deva' : lang === 'as' ? 'beng' : 'latn'
  }).format(amount);

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500 px-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-brand-blue">{t.calcTitle}</h2>
        <p className="text-gray-600 mt-2 text-lg">{t.calcSub}</p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="p-8 md:w-3/5 bg-white space-y-8">
          <div>
            <div className="flex justify-between mb-2"><label className="font-semibold text-gray-700">{t.loanAmt}</label><span className="font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-md">{formatCurrency(loanAmount)}</span></div>
            <input type="range" min="10000" max="5000000" step="10000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange" />
          </div>
          <div>
            <div className="flex justify-between mb-2"><label className="font-semibold text-gray-700">{t.intRate}</label><span className="font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-md">{interestRate}%</span></div>
            <input type="range" min="4" max="15" step="0.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange" />
          </div>
          <div>
            <div className="flex justify-between mb-2"><label className="font-semibold text-gray-700">{t.tenure}</label><span className="font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-md">{tenureYears} Yrs</span></div>
            <input type="range" min="1" max="15" step="1" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange" />
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div className="flex justify-between mb-2">
              <label className="font-semibold text-brand-orange">{t.moratorium}</label>
              <span className="font-bold text-white bg-brand-orange px-3 py-1 rounded-md">{moratorium} M</span>
            </div>
            <input type="range" min="0" max="12" step="3" value={moratorium} onChange={(e) => setMoratorium(e.target.value)} className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-brand-orange" />
          </div>
        </div>
        <div className="p-8 md:w-2/5 bg-gradient-to-br from-brand-blue to-blue-800 text-white flex flex-col justify-center">
          <div className="text-center mb-8">
            <p className="text-blue-200 mb-1 font-medium">{t.monthlyEmi}</p>
            <h3 className="text-5xl font-bold text-white drop-shadow-md">{formatCurrency(emi)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MULTI-STEP SCHEME FINDER ---
// --- MULTI-STEP SCHEME FINDER ---
// --- MULTI-STEP SCHEME FINDER ---
// --- MULTI-STEP SCHEME FINDER ---
const FindScheme = ({ lang }) => {
  const t = translations[lang];
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Expanded Data Model for the AI Engine
  const [formData, setFormData] = useState({ 
    purpose: '', 
    age: '25',
    gender: 'male', 
    state: 'Assam',
    area: 'rural', 
    amount: '100000', 
    income: '200000', 
    education: 'edu2',
    skill: 'unskilled',
    hasCaste: 'yes',
    isDisabled: 'no'
  });

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-brand-blue">{t.findTitle}</h2>
        <p className="text-gray-600 mt-2">{t.findSub}</p>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        
        {/* Progress Bar (Now 7 steps) */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div className="bg-brand-orange h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }}></div>
        </div>
        
        <div className="min-h-[280px]">
          {/* STEP 1: PURPOSE */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t.qPurpose}</h3>
              <div className="grid grid-cols-2 gap-4">
                {[{ id: 'startBiz', label: t.startBiz }, { id: 'expBiz', label: t.expBiz }, { id: 'edu', label: t.edu }, { id: 'artisan', label: t.artisan }].map(opt => (
                  <button key={opt.id} onClick={() => setFormData({...formData, purpose: opt.id})} 
                    className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${formData.purpose === opt.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: AGE & GENDER */}
          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t.qAge}</h3>
              <div className="mb-4 text-center text-4xl font-bold text-brand-blue">{formData.age}</div>
              <input type="range" min="18" max="65" step="1" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange mb-8" />
              
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.gender}</label>
              <div className="flex gap-4">
                {[{ id: 'male', label: t.male }, { id: 'female', label: t.female }, { id: 'other', label: t.other }].map(g => (
                  <button key={g.id} onClick={() => setFormData({...formData, gender: g.id})} 
                    className={`flex-1 p-3 rounded-lg border-2 font-semibold transition-all ${formData.gender === g.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {step === 3 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t.qLoc}</h3>
              
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.state}</label>
              <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-4 rounded-lg border-2 border-gray-200 font-semibold text-gray-700 focus:outline-none focus:border-brand-blue mb-6">
                <option value="Assam">Assam</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>

              <div className="flex gap-4">
                {[{ id: 'rural', label: t.rural }, { id: 'urban', label: t.urban }].map(a => (
                  <button key={a.id} onClick={() => setFormData({...formData, area: a.id})} 
                    className={`flex-1 p-3 rounded-lg border-2 font-semibold transition-all ${formData.area === a.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: AMOUNT */}
          {step === 4 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t.qAmt}</h3>
              <div className="mb-4 text-center text-4xl font-bold text-brand-blue">
                ₹ {new Intl.NumberFormat(lang + '-IN', { numberingSystem: lang === 'hi' ? 'deva' : lang === 'as' ? 'beng' : 'latn' }).format(formData.amount)}
              </div>
              <input type="range" min="10000" max="5000000" step="10000" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange mb-8" />
            </div>
          )}

          {/* STEP 5: INCOME */}
          {step === 5 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t.qInc}</h3>
              <div className="mb-4 text-center text-4xl font-bold text-brand-blue">
                ₹ {new Intl.NumberFormat(lang + '-IN', { numberingSystem: lang === 'hi' ? 'deva' : lang === 'as' ? 'beng' : 'latn' }).format(formData.income)}
              </div>
              <input type="range" min="50000" max="500000" step="10000" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange mb-8" />
            </div>
          )}

          {/* STEP 6: EDUCATION & SKILL */}
          {step === 6 && (
            <div className="animate-in fade-in duration-300">
              <label className="block text-lg font-bold text-gray-800 mb-2">{t.eduLabel}</label>
              <select value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full p-4 rounded-lg border-2 border-gray-200 font-semibold text-gray-700 mb-6 focus:outline-none focus:border-brand-blue">
                <option value="edu1">{t.edu1}</option>
                <option value="edu2">{t.edu2}</option>
                <option value="edu3">{t.edu3}</option>
              </select>

              <label className="block text-lg font-bold text-gray-800 mb-2">{t.qSkill}</label>
              <div className="flex flex-col gap-3">
                {[{ id: 'unskilled', label: t.unskilled }, { id: 'skilled', label: t.skilled }, { id: 'professional', label: t.professional }].map(s => (
                  <button key={s.id} onClick={() => setFormData({...formData, skill: s.id})} 
                    className={`w-full p-3 rounded-lg border-2 text-left font-semibold transition-all ${formData.skill === s.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: DOCUMENTS / ELIGIBILITY */}
          {step === 7 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t.qDocs}</h3>
              
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.hasCaste}</label>
              <div className="flex gap-4 mb-6">
                {[{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }].map(ans => (
                  <button key={ans.id} onClick={() => setFormData({...formData, hasCaste: ans.id})} 
                    className={`flex-1 p-3 rounded-lg border-2 font-semibold transition-all ${formData.hasCaste === ans.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                    {ans.label}
                  </button>
                ))}
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.isDisabled}</label>
              <div className="flex gap-4">
                {[{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }].map(ans => (
                  <button key={ans.id} onClick={() => setFormData({...formData, isDisabled: ans.id})} 
                    className={`flex-1 p-3 rounded-lg border-2 font-semibold transition-all ${formData.isDisabled === ans.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                    {ans.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={() => setStep(step - 1)} disabled={step === 1} className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0' : 'text-gray-500 hover:bg-gray-100'}`}>
            <ChevronLeft size={20} className="mr-1" /> {t.backBtn}
          </button>
          {step < 7 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 1 && !formData.purpose} className="flex items-center px-8 py-3 bg-brand-blue hover:bg-blue-700 text-white rounded-xl font-bold shadow-md disabled:opacity-50 transition-all">
              {t.nextBtn} <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button onClick={() => navigate('/results', { state: { formData } })} className="flex items-center px-8 py-3 bg-brand-orange hover:bg-orange-600 text-white rounded-xl font-bold shadow-md transition-all hover:scale-105">
  {t.matchBtn} <BrainCircuit size={20} className="ml-2" />
</button>
          )}
        </div>
      </div>
    </div>
  );
};


// --- RESULTS PAGE & EMBEDDED AI CHATBOT ---
const ResultsPage = ({ lang }) => {
  const t = translations[lang];
  const location = useLocation();
  const data = location.state?.formData; // The answers from the form

  // Run the rule-based engine first
  let matchedScheme = { title: t.mcfTitle, desc: t.mcfDesc };
  let matchPercentage = "98% MATCH";
  let isEligible = true;

  if (data) {
    if (data.hasCaste === 'no' || Number(data.income) > 500000) {
      matchedScheme = { title: t.schemeNone, desc: t.descNone };
      matchPercentage = "0% MATCH";
      isEligible = false;
    } else if (data.purpose === 'edu') {
      matchedScheme = { title: t.schemeEdu, desc: t.descEdu };
    } else if (data.purpose === 'artisan' || data.skill === 'skilled') {
      matchedScheme = { title: t.schemeSSY, desc: t.descSSY };
    } else if (data.gender === 'female' && Number(data.amount) <= 140000) {
      matchedScheme = { title: t.schemeMSY, desc: t.descMSY };
    } else if (Number(data.amount) <= 140000) {
      matchedScheme = { title: t.mcfTitle, desc: t.mcfDesc };
    } else {
      matchedScheme = { title: t.schemeTerm, desc: t.descTerm };
    }
  }

  // AI Chatbot State
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: data 
        ? `I matched you with the ${matchedScheme.title}! However, there are 4 other schemes you might qualify for depending on your exact business. Tell me a bit more about what you want to do, and I'll find the absolute perfect one.`
        : `Hi! I'm the SchemeSetu AI. Tell me what you need funding for, and I'll find the perfect government scheme for you.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

    const handleSend = async () => {
    console.log("1. Button clicked!");
    if (!input.trim()) return;
    const userText = input;
    
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);
    console.log("2. State updated, starting try block...");

      try {
      console.log("3. Initializing AI Key...");
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY }); 
      
      const prompt = `You are a helpful AI assistant for marginalized entrepreneurs in India looking for NSFDC schemes. 
      The user previously inputted these details in a form: ${JSON.stringify(data || {})}.
      The system recommended: ${matchedScheme?.title}.
      The user just said: "${userText}".
      Keep your answer short, friendly, under 3 sentences, and ask a follow up question to help them.`;
      
      console.log("4. Sending bulletproof request...");
      
      // USING THE STABLE GENERATE CONTENT METHOD
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      });
      
      console.log("5. Got response!");
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      console.log("6. Finished updating chat!");
      
    } catch (err) {
      console.error("7. ERROR CAUGHT:", err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting." }]);
    } finally {
      console.log("8. Turning off 'AI is thinking' animation...");
      setIsTyping(false); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: The Rule-Based Match */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-brand-blue">{t.resultsTitle}</h2>
          <p className="text-gray-600">{t.resultsSub}</p>
          
          <div className={`bg-white p-6 rounded-3xl border-2 ${isEligible ? 'border-brand-orange' : 'border-red-500'} shadow-xl relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 ${isEligible ? 'bg-brand-orange' : 'bg-red-500'} text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl`}>
              {matchPercentage}
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isEligible ? 'bg-orange-50 text-brand-orange' : 'bg-red-50 text-red-500'}`}>
              {isEligible ? <ShieldCheck size={24} /> : <X size={24} />}
            </div>
            <h3 className={`text-2xl font-bold ${isEligible ? 'text-brand-blue' : 'text-red-600'} mb-3`}>
              {matchedScheme.title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{matchedScheme.desc}</p>
            
            {isEligible && (
              <Link to="/partners" className="w-full block text-center bg-brand-blue text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-800 transition-all shadow-md">
                {t.navLocate}
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: The AI Chat Interface */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col h-[600px] overflow-hidden">
          <div className="bg-gradient-to-r from-brand-blue to-blue-800 p-6 text-white flex justify-between items-center shadow-md z-10">
            <div>
              <h3 className="font-bold text-xl flex items-center"><BrainCircuit className="mr-3" size={28}/> SchemeSetu AI Advisor</h3>
              <p className="text-blue-200 text-sm mt-1">Smarter than filters. Ask me anything.</p>
            </div>
          </div>
          
          <div className="flex-grow p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${m.role === 'model' ? 'bg-white border border-gray-200 text-gray-800 self-start rounded-tl-sm' : 'bg-brand-blue text-white self-end rounded-tr-sm'}`}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className="text-gray-500 text-sm italic bg-white w-fit px-4 py-2 rounded-full border border-gray-200 animate-pulse">
                AI is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSend()} 
              placeholder="Type your message here..." 
              className="flex-grow bg-gray-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue transition-all" 
            />
            <button onClick={handleSend} disabled={isTyping} className="bg-brand-orange hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 rounded-xl transition-all hover:scale-105 shadow-md flex items-center justify-center">
              <Send size={24}/>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- PARTNERS MAP PAGE ---
// --- PARTNERS MAP PAGE ---
const PartnersPage = ({ lang }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [userLoc, setUserLoc] = useState(null);

  // MOCK DATA: Notice how Bank #2 has eligible: false because of high NPA!
  const dummyPartners = [
    { id: 1, name: "Assam Financial Corp", type: "SCA", city: "Guwahati", lat: 26.1445, lng: 91.7362, eligible: true, npa: "2.1%" },
    { id: 2, name: "Guwahati Co-op Bank", type: "Bank", city: "Guwahati", lat: 26.1800, lng: 91.7500, eligible: false, npa: "18.4%" },
    { id: 3, name: "Nagaon Rural Bank", type: "RRB", city: "Nagaon", lat: 26.3480, lng: 92.6840, eligible: true, npa: "4.5%" }
  ];

  const filteredPartners = dummyPartners.filter(p => p.city.toLowerCase().includes(searchTerm.toLowerCase()));

  // Get User's real GPS Location
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLoc([pos.coords.latitude, pos.coords.longitude]);
      }, () => alert("Location access denied. Please enable location permissions."));
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 h-[80vh] flex flex-col animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-brand-blue">{t.mapTitle}</h2>
        <p className="text-gray-600 mt-2 text-lg">{t.mapSub}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        
        {/* Left Side: Smart Partner List */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden h-full border border-gray-100">
          <div className="p-4 border-b bg-gray-50 flex flex-col gap-4">
            <button onClick={handleLocate} className="w-full bg-blue-50 hover:bg-brand-blue text-brand-blue hover:text-white font-bold py-3 rounded-xl flex items-center justify-center transition-all border border-blue-100 shadow-sm">
              <MapPin size={18} className="mr-2" /> Find My Location
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-grow p-4 space-y-4">
            {filteredPartners.map(p => (
              <div key={p.id} className={`p-4 rounded-xl border-2 transition-all shadow-sm ${p.eligible ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50 opacity-80'}`}>
                <h4 className="font-bold text-gray-800">{p.name}</h4>
                <p className="text-sm text-gray-600 mb-3 font-medium">{p.type} • {p.city}</p>
                {p.eligible ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1.5 rounded-md border border-green-200">✅ Eligible for Routing</span>
                ) : (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1.5 rounded-md border border-red-200">❌ Blocked (NPA: {p.npa})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="w-full md:w-2/3 bg-gray-200 rounded-2xl shadow-md overflow-hidden h-[50vh] md:h-full z-0 relative border border-gray-200">
          {/* We use a 'key' here so the map instantly recenters if the user clicks Find My Location */}
          <MapContainer key={userLoc ? userLoc.join(',') : 'default'} center={userLoc || [26.2006, 92.9376]} zoom={userLoc ? 9 : 7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Blue pin for User's real location */}
            {userLoc && (
              <Marker position={userLoc}>
                <Popup><strong>📍 You are here!</strong></Popup>
              </Marker>
            )}

            {/* Pins for Channel Partners */}
            {dummyPartners.map(p => (
              <Marker key={p.id} position={[p.lat, p.lng]}>
                <Popup>
                  <strong className="text-sm">{p.name}</strong><br/>
                  <span className="text-xs text-gray-600">{p.type} • {p.city}</span><br/><br/>
                  {p.eligible ? '✅ Accepting Applications' : `❌ Not Eligible (NPA: ${p.npa})`}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

// --- APP SHELL ---
function App() {
  const [lang, setLang] = useState(null); // NULL forces the modal to show first!

  if (!lang) {
    return <LanguageModal setLang={setLang} />;
  }

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600 font-extrabold text-3xl tracking-tight">
                <Landmark className="mr-2 text-brand-blue" size={32} />
                SchemeSetu
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <Link to="/find" className="hidden sm:block text-gray-600 font-semibold">{t.navFind}</Link>
              <Link to="/calculator" className="hidden sm:block text-gray-600 font-semibold">{t.emiBtn}</Link>
              <Link to="/partners" className="hidden sm:flex text-brand-blue bg-blue-50 font-semibold items-center px-4 py-2 rounded-lg"><MapPin className="mr-1.5" size={18} /> {t.navLocate}</Link>
              
              {/* Dropdown to change language later */}
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="ml-4 bg-gray-50 border border-gray-200 text-gray-700 font-bold py-2 px-3 rounded-lg focus:outline-none">
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 हिन्दी</option>
                <option value="as">🦏 অসমীয়া</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/find" element={<FindScheme lang={lang} />} />
          <Route path="/results" element={<ResultsPage lang={lang} />} />
          <Route path="/calculator" element={<CalculatorPage lang={lang} />} />
          <Route path="/partners" element={<PartnersPage lang={lang} />} />
        </Routes>
      </main>
        
    </div>
  );
}

export default App;