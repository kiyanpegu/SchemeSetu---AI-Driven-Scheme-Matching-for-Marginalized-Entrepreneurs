import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import { schemes as allSchemesData } from './data/schemes';
import { partners } from './data/partners';
import { Landmark, Calculator, MapPin, Search, BrainCircuit, ShieldCheck, ChevronRight, ChevronLeft, MessageCircle, Globe, Bot, X, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
    calcTitle: "Loan EMI Calculator",
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
    state: "State",
    purchaseEq: "Purchase Equipment",
    workingCap: "Working Capital",
    continueBtn: "Continue",
    step: "STEP",
    of: "OF",
    tellUs: "Tell us what you need",
    smartMatchBoxTitle: "Smart Matching",
    smartMatchBoxDesc: "Your answers help us find the exact scheme you qualify for. We cross-reference over 400 local and federal grants based on these parameters.",
    matchString: "MATCH",
    whyMatch: "WHY IT'S A MATCH",
    maxLoanAmt: "MAX LOAN AMOUNT",
    interestRate: "INTEREST RATE",
    viewDetailsApply: "View Details & Apply",
    findPartnerBtn: "Find Partner",
    emiCalcTitle: "Estimated EMI Calculator",
    emiCalcDesc: "Quickly see how different amounts affect your monthly payments based on typical scheme rates.",
    years: "Years",
    adjustCalc: "Adjust Calculator",
    homeTitle: "Find the Right Financial Scheme for Your Business",
    howItWorks: "How It Works",
    hwNeeds: "Your Needs",
    hwNeedsDesc: "Tell us about your business profile.",
    hwMatch: "Smart Matching",
    hwMatchDesc: "AI cross-references hundreds of schemes.",
    hwBest: "Best Scheme",
    hwBestDesc: "Review tailored financing options.",
    hwPartner: "Nearest Partner",
    hwPartnerDesc: "Connect with local application centers.",
    exploreSchemes: "Explore Schemes",
    exploreTitle: "Explore Government Schemes",
    exploreSub: "Browse through all available financial assistance programs for marginalized communities.",
    schemeDetailsTitle: "Scheme Details",
    eligibilityCriteria: "Eligibility Criteria",
    keyBenefits: "Key Benefits",
    targetAudience: "Target Audience",
    noMatchTitle: "No Direct Matches Found",
    noMatchDesc: "Your profile doesn't strictly match the available specialized schemes. Consider browsing all schemes or adjusting your loan amount.",
    notEligibleTitle: "Eligibility Requirements Not Met",
    editProfileBtn: "Edit Profile"
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
    resultsTitle: "आपके अनुशंसित योजनाएँ",
    resultsSub: "आपकी आवश्यकताओं के आधार पर, यहाँ सर्वश्रेष्ठ योजनाएँ हैं।",
    matchText: "98% मिलान",
    mcfTitle: "माइक्रो क्रेडिट फाइनेंस (MCF)",
    mcfDesc: "छोटे आय-सृजन गतिविधियों के लिए बिल्कुल सही।",
    subtitle: "बुद्धिमान एआई-संचालित योजना मिलान के माध्यम से एससी समुदायों और वित्तीय सशक्तिकरण के बीच की खाई को पाटना।",
    findBtn: "अपनी योजना खोजें",
    emiBtn: "ईएमआई कैलकुलेटर",
    navFind: "योजना खोजें",
    navLocate: "पार्टनर खोजें",
    calcTitle: "ऋण ईएमआई कैलकुलेटर",
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
    state: "राज्य",
    purchaseEq: "उपकरण खरीदें",
    workingCap: "कार्यशील पूंजी",
    continueBtn: "जारी रखें",
    step: "चरण",
    of: "/",
    tellUs: "हमें बताएं कि आपको क्या चाहिए",
    smartMatchBoxTitle: "स्मार्ट मिलान",
    smartMatchBoxDesc: "आपके उत्तर हमें उस सटीक योजना को खोजने में मदद करते हैं जिसके लिए आप योग्य हैं। हम इन मापदंडों के आधार पर 400 से अधिक स्थानीय और संघीय अनुदानों को क्रॉस-रेफरेंस करते हैं।",
    matchString: "मिलान",
    whyMatch: "यह एक मिलान क्यों है",
    maxLoanAmt: "अधिकतम ऋण राशि",
    interestRate: "ब्याज दर",
    viewDetailsApply: "विवरण देखें और आवेदन करें",
    findPartnerBtn: "पार्टनर खोजें",
    emiCalcTitle: "अनुमानित ईएमआई कैलकुलेटर",
    emiCalcDesc: "जल्दी से देखें कि विभिन्न राशियाँ विशिष्ट योजना दरों के आधार पर आपके मासिक भुगतान को कैसे प्रभावित करती हैं।",
    years: "वर्ष",
    adjustCalc: "कैलकुलेटर समायोजित करें",
    homeTitle: "अपने व्यवसाय के लिए सही वित्तीय योजना खोजें",
    howItWorks: "यह कैसे काम करता है",
    hwNeeds: "आपकी ज़रूरतें",
    hwNeedsDesc: "हमें अपने व्यावसायिक प्रोफ़ाइल के बारे में बताएं।",
    hwMatch: "स्मार्ट मिलान",
    hwMatchDesc: "एआई सैकड़ों योजनाओं का क्रॉस-रेफरेंस करता है।",
    hwBest: "सर्वश्रेष्ठ योजना",
    hwBestDesc: "अनुकूलित वित्तपोषण विकल्पों की समीक्षा करें।",
    hwPartner: "निकटतम पार्टनर",
    hwPartnerDesc: "स्थानीय आवेदन केंद्रों से जुड़ें।",
    exploreSchemes: "योजनाओं का अन्वेषण करें",
    exploreTitle: "सरकारी योजनाओं का अन्वेषण करें",
    exploreSub: "हाशिए पर रहने वाले समुदायों के लिए उपलब्ध सभी वित्तीय सहायता कार्यक्रमों को ब्राउज़ करें।",
    schemeDetailsTitle: "योजना का विवरण",
    eligibilityCriteria: "पात्रता मापदंड",
    keyBenefits: "प्रमुख लाभ",
    targetAudience: "लक्षित दर्शक",
    noMatchTitle: "कोई सीधा मिलान नहीं मिला",
    noMatchDesc: "आपकी प्रोफ़ाइल उपलब्ध विशेष योजनाओं से पूरी तरह मेल नहीं खाती। सभी योजनाओं को ब्राउज़ करने या अपनी ऋण राशि को समायोजित करने पर विचार करें।",
    notEligibleTitle: "पात्रता आवश्यकताएँ पूरी नहीं हुईं",
    editProfileBtn: "प्रोफ़ाइल संपादित करें"
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
    resultsTitle: "আপোনাৰ পৰামৰ্শপ্ৰাপ্ত আঁচনিসমূহ",
    resultsSub: "আপোনাৰ প্ৰয়োজনৰ ভিত্তিত, ইয়াত শ্ৰেষ্ঠ আঁচনিসমূহ দিয়া হ'ল।",
    matchText: "৯৮% মেচ",
    mcfTitle: "মাইক্ৰ' ক্ৰেডিট ফাইনেঞ্চ (MCF)",
    mcfDesc: "সৰু আয়-উপাৰ্জনমূলক কাৰ্যকলাপৰ বাবে নিখুঁত।",
    subtitle: "এআইৰ জৰিয়তে অনুসূচিত জাতিৰ লোকসকলক বিত্তীয়ভাৱে সৱলীকৰণ কৰা আৰু ব্যৱধান দূৰ কৰা।",
    findBtn: "আপোনাৰ আঁচনি বিচাৰক",
    emiBtn: "ইএমআই কেলকুলেটৰ",
    navFind: "আঁচনি বিচাৰক",
    navLocate: "অংশীদাৰ বিচাৰক",
    calcTitle: "ঋণ ইএমআই কেলকুলেটৰ",
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
    state: "ৰাজ্য",
    purchaseEq: "সঁজুলি ক্ৰয় কৰক",
    workingCap: "কাৰ্যকৰী মূলধন",
    continueBtn: "অব্যাহত ৰাখক",
    step: "পদক্ষেপ",
    of: "/",
    tellUs: "আপোনাক কি প্ৰয়োজন আমাক জনাওক",
    smartMatchBoxTitle: "স্মাৰ্ট মেচিং",
    smartMatchBoxDesc: "আপোনাৰ উত্তৰসমূহে আপুনি যোগ্য হোৱা সঠিক আঁচনিখন বিচাৰি উলিওৱাত আমাক সহায় কৰে। আমি এই পেৰামিটাৰসমূহৰ ওপৰত ভিত্তি কৰি ৪০০ ৰো অধিক স্থানীয় আৰু ফেডাৰেল অনুদান ক্ৰছ-ৰেফাৰেন্স কৰো।",
    matchString: "মেচ",
    whyMatch: "এয়া কিয় এটা মেচ",
    maxLoanAmt: "সৰ্বোচ্চ ঋণৰ পৰিমাণ",
    interestRate: "সুদৰ হাৰ",
    viewDetailsApply: "বিৱৰণ চাওক আৰু আবেদন কৰক",
    findPartnerBtn: "অংশীদাৰ বিচাৰক",
    emiCalcTitle: "আনুমানিক ইএমআই কেলকুলেটৰ",
    emiCalcDesc: "সাধাৰণ আঁচনিৰ হাৰৰ ওপৰত ভিত্তি কৰি বিভিন্ন পৰিমাণে আপোনাৰ মাহেকীয়া পৰিশোধত কেনেদৰে প্ৰভাৱ পেলায় সেয়া সোনকালে চাওক।",
    years: "বছৰ",
    adjustCalc: "কেলকুলেটৰ সামঞ্জস্য কৰক",
    homeTitle: "আপোনাৰ ব্যৱসায়ৰ বাবে সঠিক বিত্তীয় আঁচনি বিচাৰক",
    howItWorks: "ই কেনেদৰে কাম কৰে",
    hwNeeds: "আপোনাৰ প্ৰয়োজনসমূহ",
    hwNeedsDesc: "আপোনাৰ ব্যৱসায়িক প্ৰফাইলৰ বিষয়ে আমাক জনাওক।",
    hwMatch: "স্মাৰ্ট মেচিং",
    hwMatchDesc: "এআইয়ে শ শ আঁচনিৰ ক্ৰছ-ৰেফাৰেন্স কৰে।",
    hwBest: "শ্ৰেষ্ঠ আঁচনি",
    hwBestDesc: "অনুকূলিত বিত্তীয় বিকল্পসমূহ পৰ্যালোচনা কৰক।",
    hwPartner: "নিকটতম অংশীদাৰ",
    hwPartnerDesc: "স্থানীয় আবেদন কেন্দ্ৰসমূহৰ সৈতে সংযোগ কৰক।",
    exploreSchemes: "আঁচনিসমূহ অন্বেষণ কৰক",
    exploreTitle: "চৰকাৰী আঁচনিসমূহ অন্বেষণ কৰক",
    exploreSub: "প্ৰান্তীয় সম্প্ৰদায়সমূহৰ বাবে উপলব্ধ সকলো বিত্তীয় সাহায্য কাৰ্যসূচী ব্ৰাউজ কৰক।",
    schemeDetailsTitle: "আঁচনিৰ বিৱৰণ",
    eligibilityCriteria: "যোগ্যতাৰ মাপকাঠী",
    keyBenefits: "প্ৰধান লাভালাভ",
    targetAudience: "লক্ষ্য দৰ্শক",
    noMatchTitle: "কোনো পোনপটীয়া মেচ পোৱা নগ'ল",
    noMatchDesc: "আপোনাৰ প্ৰফাইল উপলব্ধ বিশেষ আঁচনিসমূহৰ সৈতে সম্পূৰ্ণৰূপে মিলি নাযায়। সকলো আঁচনি ব্ৰাউজ কৰা বা আপোনাৰ ঋণৰ পৰিমাণ সামঞ্জস্য কৰাৰ কথা বিবেচনা কৰক।",
    notEligibleTitle: "যোগ্যতাৰ প্ৰয়োজনীয়তা পূৰণ হোৱা নাই",
    editProfileBtn: "প্ৰফাইল সম্পাদনা কৰক"
  }
};

// --- INITIAL LANGUAGE MODAL ---
const LanguageModal = ({ setLang }) => (
  <div className="fixed inset-0 bg-surface/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="card-ambient max-w-md w-full text-center border border-surface-container">
      <div className="w-16 h-16 bg-surface-container-highest text-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <Globe size={32} />
      </div>
      <h2 className="headline-lg text-primary mb-2">Welcome to SchemeSetu</h2>
      <p className="body-lg text-on-surface-variant mb-8">Please select your preferred language to continue</p>
      
      <div className="flex flex-col gap-4">
        <button onClick={() => setLang('en')} className="p-4 rounded-xl border border-surface-container hover:border-secondary hover:bg-surface-container-lowest font-semibold text-lg text-on-surface transition-all flex justify-between items-center group">
          <div className="flex items-center gap-3"><span className="text-2xl">🇺🇸</span> English</div> <ChevronRight className="text-outline group-hover:text-secondary" />
        </button>
        <button onClick={() => setLang('hi')} className="p-4 rounded-xl border border-surface-container hover:border-secondary hover:bg-surface-container-lowest font-semibold text-lg text-on-surface transition-all flex justify-between items-center group">
          <div className="flex items-center gap-3"><span className="text-2xl">🇮🇳</span> हिन्दी</div> <ChevronRight className="text-outline group-hover:text-secondary" />
        </button>
        <button onClick={() => setLang('as')} className="p-4 rounded-xl border border-surface-container hover:border-secondary hover:bg-surface-container-lowest font-semibold text-lg text-on-surface transition-all flex justify-between items-center group">
          <div className="flex items-center gap-3"><span className="text-2xl">🦏</span> অসমীয়া</div> <ChevronRight className="text-outline group-hover:text-secondary" />
        </button>
      </div>
    </div>
  </div>
);

// --- HOME COMPONENT ---
const Home = ({ lang }) => {
  const t = translations[lang];
  return (
    <section className="relative pt-12 pb-24 px-4 overflow-hidden animate-in fade-in duration-700 w-full">
      <div className="absolute inset-0 z-[-1] opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(214, 227, 255, 0.5) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(216, 226, 255, 0.4) 0%, transparent 50%)' }}></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Text */}
        <div className="lg:col-span-6 flex flex-col gap-6 z-10 text-left">
          <div className="inline-flex items-center gap-2 bg-secondary-fixed text-secondary px-3 py-1.5 rounded-full w-max text-xs font-semibold tracking-wide uppercase shadow-sm">
            <BrainCircuit size={16} />
            {t.smartMatchBoxTitle}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight">
            {t.homeTitle}
          </h1>
          
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/find" className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center">
              {t.findBtn} <ChevronRight className="ml-2" size={18} />
            </Link>
            <Link to="/explore" className="bg-transparent border border-outline-variant text-on-surface font-bold px-6 py-3 rounded-lg hover:bg-surface-container-low transition-colors duration-200 flex items-center justify-center">
              {t.exploreSchemes}
            </Link>
          </div>
        </div>

        {/* Hero Visual / Journey Graphic */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
          <div className="card-ambient w-full max-w-md rounded-2xl p-8 shadow-ambient relative z-10 border-l-2 border-secondary-container hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold text-primary mb-6">{t.howItWorks}</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-surface-variant">
              
              {/* Step 1 */}
              <div className="flex gap-4 relative group cursor-default">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center z-10 border-2 border-surface-container-lowest shrink-0 text-on-surface-variant group-hover:scale-110 group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
                  <Search size={20} />
                </div>
                <div className="pt-2 group-hover:translate-x-1 transition-transform duration-300">
                  <h4 className="font-bold text-primary">{t.hwNeeds}</h4>
                  <p className="text-sm text-on-surface-variant mt-1">{t.hwNeedsDesc}</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-4 relative group cursor-default">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center z-10 border-2 border-surface-container-lowest shrink-0 text-secondary relative group-hover:scale-110 transition-all duration-300">
                  <div className="absolute inset-0 border-2 border-secondary rounded-full animate-ping opacity-20"></div>
                  <BrainCircuit size={20} />
                </div>
                <div className="pt-2 group-hover:translate-x-1 transition-transform duration-300">
                  <h4 className="font-bold text-secondary">{t.hwMatch}</h4>
                  <p className="text-sm text-on-surface-variant mt-1">{t.hwMatchDesc}</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex gap-4 relative group cursor-default">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center z-10 border-2 border-surface-container-lowest shrink-0 text-on-surface-variant group-hover:scale-110 group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
                  <ShieldCheck size={20} />
                </div>
                <div className="pt-2 group-hover:translate-x-1 transition-transform duration-300">
                  <h4 className="font-bold text-primary">{t.hwBest}</h4>
                  <p className="text-sm text-on-surface-variant mt-1">{t.hwBestDesc}</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 relative group cursor-default">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center z-10 border-2 border-surface-container-lowest shrink-0 text-on-surface-variant group-hover:scale-110 group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
                  <MapPin size={20} />
                </div>
                <div className="pt-2 group-hover:translate-x-1 transition-transform duration-300">
                  <h4 className="font-bold text-primary">{t.hwPartner}</h4>
                  <p className="text-sm text-on-surface-variant mt-1">{t.hwPartnerDesc}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
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
  let emi = 0;
  
  if (p > 0 && r > 0 && emiMonths > 0) {
    const accruedInterest = p * r * Number(moratorium);
    const adjustedPrincipal = p + accruedInterest;
    emi = (adjustedPrincipal * r * Math.pow(1 + r, emiMonths)) / (Math.pow(1 + r, emiMonths) - 1);
  }

    const formatCurrency = (amount) => new Intl.NumberFormat(lang + '-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0,
    numberingSystem: lang === 'hi' ? 'deva' : lang === 'as' ? 'beng' : 'latn'
  }).format(amount);

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-500 px-4">
      <div className="text-center mb-10">
        <h2 className="headline-lg text-primary">{t.calcTitle}</h2>
        <p className="body-lg text-on-surface-variant mt-2">{t.calcSub}</p>
      </div>
      <div className="card-ambient p-0 overflow-hidden flex flex-col md:flex-row border border-surface-container">
        <div className="p-8 md:w-3/5 bg-surface-container-lowest space-y-8">
          <div>
            <div className="flex justify-between mb-2"><label className="label-md text-on-surface">{t.loanAmt}</label><span className="font-bold text-primary bg-surface-container px-3 py-1 rounded-md">{formatCurrency(loanAmount)}</span></div>
            <input type="range" min="10000" max="5000000" step="10000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary" />
          </div>
          <div>
            <div className="flex justify-between mb-2"><label className="label-md text-on-surface">{t.intRate}</label><span className="font-bold text-primary bg-surface-container px-3 py-1 rounded-md">{interestRate}%</span></div>
            <input type="range" min="4" max="15" step="0.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary" />
          </div>
          <div>
            <div className="flex justify-between mb-2"><label className="label-md text-on-surface">{t.tenure}</label><span className="font-bold text-primary bg-surface-container px-3 py-1 rounded-md">{tenureYears} {t.years || (lang === 'hi' ? 'वर्ष' : lang === 'as' ? 'বছৰ' : 'Yrs')}</span></div>
            <input type="range" min="1" max="15" step="1" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="label-md text-on-surface">{t.moratorium}</label>
              <span className="font-bold text-primary bg-surface-container px-3 py-1 rounded-md">{moratorium} {lang === 'hi' ? 'महीने' : lang === 'as' ? 'মাহ' : 'Months'}</span>
            </div>
            <input type="range" min="0" max="12" step="3" value={moratorium} onChange={(e) => setMoratorium(e.target.value)} className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary" />
          </div>
        </div>
        <div className="p-8 md:w-2/5 bg-primary-container text-on-primary-container flex flex-col justify-center">
          <div className="text-center mb-8">
            <p className="body-md mb-1">{t.monthlyEmi}</p>
            <h3 className="display-lg text-on-primary drop-shadow-md">{formatCurrency(emi)}</h3>
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
    <div className="w-full max-w-7xl mx-auto py-8 px-4 h-full flex flex-col items-center">
      
      {/* Progress Header */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between items-center mb-2 relative">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} 
            className="absolute -left-16 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center font-semibold text-sm hidden md:flex"
            title="Go Back"
          >
            <ChevronLeft size={20} /> {t.backBtn}
          </button>
          <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t.step} {step} {t.of} 7</span>
          <span className="text-sm font-medium text-secondary">{t.tellUs}</span>
        </div>
        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }}></div>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Questions Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="min-h-[400px]">
              {/* STEP 1: PURPOSE */}
              {step === 1 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-3xl font-bold text-on-surface mb-8">{t.qPurpose}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'startBiz', label: t.startBiz, icon: <Landmark size={24} /> },
                      { id: 'expBiz', label: t.expBiz, icon: <BrainCircuit size={24} /> },
                      { id: 'purchaseEq', label: t.purchaseEq, icon: <MapPin size={24} /> },
                      { id: 'workingCap', label: t.workingCap, icon: <ShieldCheck size={24} /> },
                      { id: 'edu', label: t.edu, icon: <Calculator size={24} /> }
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setFormData({...formData, purpose: opt.id})} 
                        className={`p-6 rounded-xl border flex flex-col items-start gap-4 transition-all text-left ${formData.purpose === opt.id ? 'border-secondary bg-surface text-on-surface shadow-sm ring-1 ring-secondary' : 'border-surface-container text-on-surface hover:border-outline-variant hover:bg-surface-container-lowest bg-surface-container-lowest shadow-sm'}`}>
                        <div className={`p-2 rounded-lg ${formData.purpose === opt.id ? 'bg-secondary-fixed text-secondary' : 'bg-surface-container text-on-surface-variant'}`}>
                          {opt.icon}
                        </div>
                        <span className="font-semibold text-lg">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: AGE & GENDER */}
              {step === 2 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-3xl font-bold text-on-surface mb-8">{t.qAge}</h3>
                  <div className="mb-4 text-center display-lg text-primary">{formData.age}</div>
                  <input type="range" min="18" max="65" step="1" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary mb-12" />
                  
                  <h3 className="text-3xl font-bold text-on-surface mb-8">{t.gender}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[{ id: 'male', label: t.male }, { id: 'female', label: t.female }, { id: 'other', label: t.other }].map(g => (
                      <button key={g.id} onClick={() => setFormData({...formData, gender: g.id})} 
                        className={`p-4 rounded-xl border flex justify-center items-center font-semibold transition-all ${formData.gender === g.id ? 'border-secondary bg-surface text-on-surface shadow-sm ring-1 ring-secondary' : 'border-surface-container text-on-surface hover:border-outline-variant hover:bg-surface-container-lowest bg-surface-container-lowest shadow-sm'}`}>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: LOCATION */}
              {step === 3 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-3xl font-bold text-on-surface mb-8">{t.qLoc}</h3>
                  
                  <label className="block label-md text-on-surface mb-2">{t.state}</label>
                  <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="form-input w-full p-4 text-on-surface mb-8 bg-surface-container-lowest shadow-sm">
                    <option value="Assam">{lang === 'hi' ? 'असम' : lang === 'as' ? 'অসম' : 'Assam'}</option>
                    <option value="Delhi">{lang === 'hi' ? 'दिल्ली' : lang === 'as' ? 'দিল্লী' : 'Delhi'}</option>
                    <option value="Maharashtra">{lang === 'hi' ? 'महाराष्ट्र' : lang === 'as' ? 'মহাৰাষ্ট্ৰ' : 'Maharashtra'}</option>
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    {[{ id: 'rural', label: t.rural }, { id: 'urban', label: t.urban }].map(a => (
                      <button key={a.id} onClick={() => setFormData({...formData, area: a.id})} 
                        className={`p-6 rounded-xl border flex justify-center items-center font-semibold text-lg transition-all ${formData.area === a.id ? 'border-secondary bg-surface text-on-surface shadow-sm ring-1 ring-secondary' : 'border-surface-container text-on-surface hover:border-outline-variant hover:bg-surface-container-lowest bg-surface-container-lowest shadow-sm'}`}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: AMOUNT */}
              {step === 4 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-3xl font-bold text-on-surface mb-8">{t.qAmt}</h3>
                  <div className="mb-4 text-center display-lg text-primary">
                    ₹ {new Intl.NumberFormat(lang + '-IN', { numberingSystem: lang === 'hi' ? 'deva' : lang === 'as' ? 'beng' : 'latn' }).format(formData.amount)}
                  </div>
                  <input type="range" min="10000" max="5000000" step="10000" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary mb-8" />
                </div>
              )}

              {/* STEP 5: INCOME */}
              {step === 5 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-3xl font-bold text-on-surface mb-8">{t.qInc}</h3>
                  <div className="mb-4 text-center display-lg text-primary">
                    ₹ {new Intl.NumberFormat(lang + '-IN', { numberingSystem: lang === 'hi' ? 'deva' : lang === 'as' ? 'beng' : 'latn' }).format(formData.income)}
                  </div>
                  <input type="range" min="50000" max="500000" step="10000" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary mb-8" />
                </div>
              )}

              {/* STEP 6: EDUCATION & SKILL */}
              {step === 6 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-3xl font-bold text-on-surface mb-8">{t.eduLabel}</h3>
                  <select value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="form-input w-full p-4 text-on-surface mb-8 bg-surface-container-lowest shadow-sm">
                    <option value="edu1">{t.edu1}</option>
                    <option value="edu2">{t.edu2}</option>
                    <option value="edu3">{t.edu3}</option>
                  </select>

                  {formData.purpose !== 'edu' && (
                    <>
                      <h3 className="text-3xl font-bold text-on-surface mb-8">{t.qSkill}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[{ id: 'unskilled', label: t.unskilled }, { id: 'skilled', label: t.skilled }, { id: 'professional', label: t.professional }].map(s => (
                          <button key={s.id} onClick={() => setFormData({...formData, skill: s.id})} 
                            className={`p-4 rounded-xl border flex justify-center items-center font-semibold text-center transition-all ${formData.skill === s.id ? 'border-secondary bg-surface text-on-surface shadow-sm ring-1 ring-secondary' : 'border-surface-container text-on-surface hover:border-outline-variant hover:bg-surface-container-lowest bg-surface-container-lowest shadow-sm'}`}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 7: DOCUMENTS / ELIGIBILITY */}
              {step === 7 && (
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-3xl font-bold text-on-surface mb-8">{t.qDocs}</h3>
                  
                  <label className="block text-lg font-bold text-on-surface mb-4">{t.hasCaste}</label>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }].map(ans => (
                      <button key={ans.id} onClick={() => setFormData({...formData, hasCaste: ans.id})} 
                        className={`p-4 rounded-xl border font-semibold text-center transition-all ${formData.hasCaste === ans.id ? 'border-secondary bg-surface text-on-surface shadow-sm ring-1 ring-secondary' : 'border-surface-container text-on-surface hover:border-outline-variant hover:bg-surface-container-lowest bg-surface-container-lowest shadow-sm'}`}>
                        {ans.label}
                      </button>
                    ))}
                  </div>

                  <label className="block text-lg font-bold text-on-surface mb-4">{t.isDisabled}</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }].map(ans => (
                      <button key={ans.id} onClick={() => setFormData({...formData, isDisabled: ans.id})} 
                        className={`p-4 rounded-xl border font-semibold text-center transition-all ${formData.isDisabled === ans.id ? 'border-secondary bg-surface text-on-surface shadow-sm ring-1 ring-secondary' : 'border-surface-container text-on-surface hover:border-outline-variant hover:bg-surface-container-lowest bg-surface-container-lowest shadow-sm'}`}>
                        {ans.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end items-center w-full mt-6">
            {step < 7 ? (
              <button onClick={() => setStep(step + 1)} disabled={step === 1 && !formData.purpose} className="px-6 py-3 rounded-lg bg-primary-container text-white font-medium hover:bg-primary transition-colors flex items-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50">
                {t.continueBtn}
                <ChevronRight size={20} />
              </button>
            ) : (
              <button onClick={() => navigate('/results', { state: { formData } })} className="px-6 py-3 rounded-lg bg-primary-container text-white font-medium hover:bg-primary transition-colors flex items-center gap-2 shadow-sm hover:shadow-md">
                {t.matchBtn}
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar / Helper */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border-l-4 border-secondary sticky top-24">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <BrainCircuit size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">{t.smartMatchBoxTitle}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t.smartMatchBoxDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


// --- RESULTS PAGE ---
const ResultsPage = ({ lang }) => {
  const t = translations[lang];
  const location = useLocation();
  const formData = location.state?.formData;
  const navigate = useNavigate();

  // SMART MATCHING ENGINE (AI / Rules-based)
  let engineMatches = [];
  let isEligible = true;
  let ineligibilityReason = "";

  if (formData) {
    if (formData.hasCaste === 'no') {
      isEligible = false;
      ineligibilityReason = "NSFDC schemes strictly require a valid Scheduled Caste (SC) certificate. Based on your input, you do not meet this mandatory criteria.";
    } else if (Number(formData.income) > 300000) {
      isEligible = false;
      ineligibilityReason = "Your family income exceeds the ₹3.00 Lakh limit for NSFDC schemes. These schemes are strictly targeted at marginalized entrepreneurs.";
    }

    if (isEligible) {
        allSchemesData.forEach(scheme => {
          let score = 0;
          let reasons = [];
          
          let isMatch = true;
          const userAmt = Number(formData.amount);
          const userInc = Number(formData.income);
          const userAge = Number(formData.age);
          const purpose = formData.purpose;

          // Purpose Matching
          if (purpose === 'edu' && !scheme.education_eligibility) {
             isMatch = false;
          }
          if (purpose !== 'edu' && !scheme.business_eligibility) {
             isMatch = false;
          }

          // Income Matching
          if (scheme.annual_family_income_limit && userInc > scheme.annual_family_income_limit) {
             isMatch = false; 
          }

          if (isMatch) {
             score += 50; // base match
             reasons.push("Meets base eligibility criteria.");

             // Amount matching
             if (scheme.loan_amount_max && userAmt <= scheme.loan_amount_max) {
                 score += 15;
                 reasons.push(`Amount (₹${userAmt}) is within the scheme limit of ₹${scheme.loan_amount_max}.`);
             } else if (scheme.loan_amount_max) {
                 reasons.push(`Note: Requested amount exceeds scheme limit of ₹${scheme.loan_amount_max}.`);
             }
             
             if (scheme.loan_amount_min && userAmt >= scheme.loan_amount_min) {
                 score += 5;
             }

             // Gender specific targeting
             if (scheme.beneficiary_category?.includes('Women') || scheme.target_groups?.includes('Women')) {
                 if (formData.gender === 'female') {
                     score += 25;
                     reasons.push("Specialized scheme for female entrepreneurs.");
                 } else {
                     // Scheme is strictly for women, disqualify men
                     isMatch = false;
                 }
             }

             // Age targeting
             if (scheme.minimum_age && userAge >= scheme.minimum_age && scheme.maximum_age && userAge <= scheme.maximum_age) {
                 score += 5;
             }
          }
          
          if (isMatch && score > 0) {
            // Cap score at 99
            score = Math.min(score, 99);
            
            // use verified interest rate if available
            let intVal = scheme.interest_rate_min || 4;
            
            engineMatches.push({
              ...scheme,
              matchScore: score,
              match: `${score}%`,
              desc: scheme.shortDesc,
              why: reasons.join(" "),
              amount: scheme.maxAmount,
              calcInterest: intVal
            });
          }
        });
        engineMatches.sort((a, b) => b.matchScore - a.matchScore);
      }
  }

  const matchedSchemes = engineMatches;
  const topScheme = matchedSchemes[0];

  // Mini EMI Calculator State
  const [loanAmt, setLoanAmt] = useState(formData?.amount || '300000');
  const [tenure, setTenure] = useState('5');

  const p = Number(loanAmt);
  const r = (topScheme?.calcInterest || 4) / 12 / 100;
  const emiMonths = Number(tenure) * 12;
  const emi = (p > 0 && emiMonths > 0) ? (p * r * Math.pow(1 + r, emiMonths)) / (Math.pow(1 + r, emiMonths) - 1) : 0;

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-12 flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">{t.resultsTitle}</h1>
        {isEligible && matchedSchemes.length > 0 ? (
          <p className="text-lg text-on-surface-variant">{t.resultsSub}</p>
        ) : (
          <p className="text-lg text-red-600">{t.noMatchDesc}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Recommended Schemes */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!isEligible ? (
             <div className="p-8 bg-red-50 text-red-900 rounded-xl border border-red-200">
               <h3 className="text-2xl font-bold mb-4 text-red-800">{t.notEligibleTitle}</h3>
               <p className="text-lg mb-6">{ineligibilityReason}</p>
               <button onClick={() => navigate('/find')} className="btn-primary px-6 py-2.5 font-bold">{t.editProfileBtn}</button>
             </div>
          ) : matchedSchemes.length === 0 ? (
             <div className="p-8 bg-surface-container rounded-xl border border-outline-variant">
               <h3 className="text-2xl font-bold mb-4">{t.noMatchTitle}</h3>
               <p className="text-lg mb-6">{t.noMatchDesc}</p>
               <div className="flex gap-4 mt-2">
                 <button onClick={() => navigate('/find')} className="btn-primary px-6 py-2.5 font-bold">{t.editProfileBtn}</button>
                 <button onClick={() => navigate('/explore')} className="btn-ghost px-6 py-2.5 font-bold">{t.exploreSchemes}</button>
               </div>
             </div>
          ) : (
            matchedSchemes.map((s, idx) => (
              <div key={idx} className={`card-ambient border bg-surface-container-lowest ${idx === 0 ? 'border-secondary shadow-md' : 'border-surface-container'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="headline-md text-on-surface">{s.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {s.online_application_available && (
                           <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-md">Online Application</span>
                        )}
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">{s.implementing_agency}</span>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-2">{s.desc}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${idx === 0 ? 'bg-secondary-fixed text-secondary border-secondary/30' : 'bg-surface-container text-on-surface border-outline'}`}>
                      <BrainCircuit size={12} className="inline mr-1" /> {s.matchScore}% {t.matchString}
                    </div>
                  </div>

                {/* detailed match reason for top match */}
                {idx === 0 && s.why && (
                  <div className="mb-6 p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">{t.whyMatch}</p>
                    <p className="text-sm text-on-surface flex items-start gap-2">
                      <ShieldCheck size={16} className="text-status-eligible flex-shrink-0 mt-0.5" /> 
                      {s.why}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container">
                    <p className="text-xs text-on-surface-variant mb-1 uppercase">{t.maxLoanAmt}</p>
                    <p className="font-bold text-on-surface">{s.amount}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container">
                    <p className="text-xs text-on-surface-variant mb-1 uppercase">Interest Rate</p>
                    <p className="font-bold text-on-surface">{s.interest || 'Varies'}</p>
                  </div>
                  {s.emi && (
                    <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container">
                      <p className="text-xs text-on-surface-variant mb-1 uppercase">Est. EMI</p>
                      <p className="font-bold text-on-surface">{s.emi}</p>
                    </div>
                  )}
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-container">
                    <p className="text-xs text-on-surface-variant mb-1 uppercase">{t.interestRate}</p>
                    <p className="font-bold text-on-surface">{s.interest}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {idx === 0 ? (
                    <>
                      <button onClick={() => s.id && navigate(`/scheme/${s.id}`)} className="btn-primary flex-1 py-2.5 font-bold">{t.viewDetailsApply}</button>
                      {s.online_application_available ? (
                         <a href={s.official_application_portal} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 py-2.5 bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 text-center font-bold">
                           Apply Online Portal
                         </a>
                      ) : (
                         <button onClick={() => navigate('/partners', { state: { topSchemeId: s.id } })} className="btn-ghost flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant font-bold">
                           <MapPin size={16} className="mr-2 inline" /> {t.findPartnerBtn}
                         </button>
                      )}
                    </>
                  ) : (
                    <button onClick={() => s.id && navigate(`/scheme/${s.id}`)} className="text-secondary font-bold hover:underline flex items-center ml-auto">
                      {t.viewDetailsApply} <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Calculator & Guidance */}
        <aside className="lg:col-span-4 flex flex-col gap-6 mt-6 lg:mt-0">
          
          {/* Dark EMI Calculator Card */}
          <div className="bg-primary text-on-primary rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calculator size={24} className="text-secondary-fixed" />
                <h3 className="text-lg font-bold">{t.emiCalcTitle || "Estimated EMI Calculator"}</h3>
              </div>
              <p className="text-sm text-primary-container-light opacity-80 leading-relaxed">
                {t.emiCalcDesc || "Quickly see how different amounts affect your monthly payments based on typical scheme rates."}
              </p>

              <div className="bg-surface/10 rounded-lg p-4 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-primary-container-light uppercase tracking-wider">{t.loanAmt || "Loan Amount"}</span>
                  <span className="font-bold">₹{new Intl.NumberFormat(lang + '-IN').format(loanAmt)}</span>
                </div>
                <input type="range" min="50000" max="5000000" step="10000" value={loanAmt} onChange={(e) => setLoanAmt(e.target.value)} className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-secondary-fixed" />
              </div>
              
              <div className="bg-surface/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-primary-container-light uppercase tracking-wider">{t.tenure || "Tenure"}</span>
                  <span className="font-bold">{tenure} {t.years || "Years"}</span>
                </div>
                <input type="range" min="1" max="15" step="1" value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-secondary-fixed" />
              </div>

              <div className="mt-2 flex justify-between items-end border-t border-white/20 pt-4">
                <span className="text-sm opacity-90">{t.monthlyEmi || "Monthly EMI"}</span>
                <span className="text-3xl font-bold tracking-tight">₹{new Intl.NumberFormat(lang + '-IN', { maximumFractionDigits: 0 }).format(emi)}</span>
              </div>

              <button onClick={() => navigate('/calculator')} className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors mt-2 text-center">
                {t.adjustCalc || "Adjust Calculator"}
              </button>
            </div>
          </div>

          {/* Support Callout */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient flex flex-col gap-3 border border-outline-variant/30">
            <div className="flex items-center gap-2 text-primary">
              <MessageCircle size={24} />
              <h3 className="text-lg font-bold">Need Guidance?</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">Navigating schemes can be complex. Connect with an official partner for free assistance.</p>
            <button onClick={() => navigate('/partners')} className="text-secondary font-bold text-sm mt-2 flex items-center gap-1 hover:underline">
              {t.findPartnerBtn || "Find a local partner"} <ChevronRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

// --- EXPLORE SCHEMES PAGE ---
const ExploreSchemes = ({ lang }) => {
  const t = translations[lang];
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">{t.exploreTitle}</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">{t.exploreSub}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSchemesData.map((scheme) => (
          <div key={scheme.id} className="card-ambient border border-surface-container bg-surface-container-lowest rounded-xl p-6 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-secondary-fixed text-secondary text-xs font-bold rounded-full">
                  {scheme.target}
                </span>
                {scheme.online_application_available && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                    Online Application
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {scheme.implementing_agency}
                </span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2 leading-tight">{scheme.name}</h3>
              <p className="text-sm text-on-surface-variant line-clamp-2">{scheme.shortDesc}</p>
            </div>
            
            <div className="mt-auto pt-4 border-t border-surface-container grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">{t.maxLoanAmt}</p>
                <p className="font-bold text-primary">{scheme.maxAmount}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">{t.interestRate}</p>
                <p className="font-bold text-primary">{scheme.interest}</p>
              </div>
            </div>

            <Link to={`/scheme/${scheme.id}`} className="w-full bg-primary-container text-primary font-bold py-2.5 rounded-lg text-center hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
              {t.viewDetailsApply} <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const SchemeDetails = ({ lang }) => {
  const t = translations[lang];
  const { id } = useParams();
  const navigate = useNavigate();
  const scheme = allSchemesData.find(s => s.id === id);

  if (!scheme) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-on-surface">Scheme not found</h2>
        <button onClick={() => navigate('/explore')} className="mt-4 text-secondary hover:underline">Back to Explore</button>
      </div>
    );
  }

  const schemePartners = partners.filter(p => p.supported_schemes?.includes(scheme.id) && p.eligible);
  const uniquePartnerNames = [...new Set(schemePartners.map(p => p.name))].join(', ');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in slide-in-from-bottom-4 duration-500">
      
      <button onClick={() => navigate('/explore')} className="flex items-center text-sm font-bold text-on-surface-variant hover:text-primary mb-6 transition-colors">
        <ChevronLeft size={16} className="mr-1" /> {t.backBtn}
      </button>

      <div className="card-ambient bg-surface-container-lowest border border-surface-container rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-primary p-8 text-on-primary">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-4">
            {scheme.target}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{scheme.name}</h1>
          <p className="text-primary-container-light text-lg leading-relaxed max-w-2xl">{scheme.shortDesc}</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">{t.maxLoanAmt}</p>
              <p className="text-xl font-bold text-primary">{scheme.maxAmount}</p>
            </div>
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">{t.interestRate}</p>
              <p className="text-xl font-bold text-primary">{scheme.interest}</p>
            </div>
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex items-center justify-center">
               <button onClick={() => navigate('/calculator')} className="text-secondary font-bold hover:underline flex items-center gap-1">
                 <Calculator size={16} /> {t.emiBtn}
               </button>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                <ShieldCheck className="text-secondary" /> {t.eligibilityCriteria}
              </h3>
              <ul className="space-y-3">
                {scheme.eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-on-surface">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0"></div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                <Landmark className="text-secondary" /> {t.keyBenefits}
              </h3>
              <ul className="space-y-3">
                {scheme.benefits.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-on-surface">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0"></div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-surface-container-highest p-6 rounded-xl border border-outline-variant/30 mt-8">
              <h3 className="text-lg font-bold text-on-surface mb-4">Application & Provenance</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Application Route</span>
                  <span className="text-on-surface">{scheme.application_method}</span>
                </div>
                {scheme.online_application_available ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Official Portal</span>
                    <a href={scheme.official_application_portal} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">
                      {scheme.official_application_portal}
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Offline Application</span>
                    <span className="text-on-surface">Must apply via authorized channel partners: <span className="font-bold">{uniquePartnerNames || scheme.implementing_agency}</span></span>
                  </div>
                )}
                <div className="flex flex-col gap-1 pt-4 border-t border-outline-variant/30">
                  <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Data Source (Provenance)</span>
                  <a href={scheme.source_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">
                    {scheme.source_url}
                  </a>
                  <span className="text-xs text-on-surface-variant mt-1">Status: {scheme.verification_status} | Last Verified: {new Date(scheme.last_verified_at).toLocaleDateString()}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-surface-container flex flex-col sm:flex-row gap-4 items-center justify-between">
             <p className="text-sm text-on-surface-variant">{lang === 'hi' ? 'क्या आप आगे बढ़ने के लिए तैयार हैं?' : lang === 'as' ? 'আপুনি আগবাঢ়িবলৈ সাজুনে?' : 'Ready to move forward?'}</p>
             <button onClick={() => navigate('/partners')} className="w-full sm:w-auto bg-secondary text-white font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm">
               {t.findPartnerBtn} <MapPin size={18} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- PARTNERS MAP PAGE ---
const PartnersPage = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLoc] = useState(null);
  const [eligibleOnly, setEligibleOnly] = useState(true);
    const [partnerType, setPartnerType] = useState('');
  const navigate = useNavigate();

  const filteredPartners = partners
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.type.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => eligibleOnly ? p.eligible : true)
      .filter(p => partnerType === '' ? true : p.partner_type === partnerType);

  return (
    <div className="max-w-7xl mx-auto h-[85vh] flex flex-col animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="headline-lg text-primary">{lang === 'hi' ? 'पार्टनर लोकेटर' : lang === 'as' ? 'অংশীদাৰ লোকেটৰ' : 'Partner Locator'}</h2>
          <p className="body-lg text-on-surface-variant mt-1">{lang === 'hi' ? 'अपने आस-पास अधिकृत वित्तीय संस्थान खोजें।' : lang === 'as' ? 'আপোনাৰ ওচৰৰ কৰ্তৃত্বপ্ৰাপ্ত বিত্তীয় প্ৰতিষ্ঠানসমূহ বিচাৰক।' : 'Find authorized financial institutions near you.'}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-full rounded-2xl shadow-ambient overflow-hidden border border-surface-container bg-surface">
        
        {/* Left Side: Smart Partner List */}
        <div className="w-full md:w-[400px] flex flex-col bg-surface border-r border-surface-container z-10">
          
          <div className="p-4 border-b border-surface-container bg-surface-container-lowest space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-on-surface text-sm flex items-center gap-2">
                <ShieldCheck size={16} className="text-secondary" /> {lang === 'hi' ? 'मेरी योजना के लिए योग्य' : lang === 'as' ? 'মোৰ আঁচনিৰ বাবে যোগ্য' : 'Eligible for my scheme'}
              </span>
              <button 
                onClick={() => setEligibleOnly(!eligibleOnly)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${eligibleOnly ? 'bg-secondary' : 'bg-surface-container-high'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${eligibleOnly ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-grow p-4 space-y-4 bg-surface-container-lowest/50">
            <h3 className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-2">
              {filteredPartners.length} {lang === 'hi' ? 'योग्य पार्टनर आस-पास मिले' : lang === 'as' ? 'ওচৰত পোৱা যোগ্য অংশীদাৰ' : 'ELIGIBLE PARTNERS FOUND NEAR YOU'}
            </h3>
            
            {filteredPartners.map(p => (
              <div key={p.id} className="p-4 rounded-xl border border-surface-container bg-surface shadow-sm hover:border-outline-variant transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-on-surface text-lg">{p.name}</h4>
                  <span className="bg-surface-container px-2 py-0.5 rounded text-xs font-medium text-on-surface-variant flex items-center gap-1">
                    <MapPin size={10} /> {p.dist}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mb-3">{p.type}</p>
                
                <div className="mb-4">
                  <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-md ${p.eligible ? 'bg-secondary-fixed text-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {p.eligible ? <ShieldCheck size={12} className="mr-1" /> : null}
                    {p.badge}
                  </span>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => alert(lang === 'hi' ? 'कृपया अपनी केवाईसी, जाति प्रमाण पत्र और व्यवसाय योजना के साथ इस शाखा पर जाएं।' : lang === 'as' ? 'অনুগ্ৰহ কৰি আপোনাৰ কেৱাইচি, জাতিগত প্ৰমাণপত্ৰ আৰু ব্যৱসায়িক পৰিকল্পনাৰ সৈতে এই শাখাত উপস্থিত হওক।' : `Please visit ${p.name} branch with your KYC, SC Certificate, and Business Plan to apply offline.`)} className="btn-primary flex-1 py-2 text-sm text-center">
                      {lang === 'hi' ? 'ऑफ़लाइन आवेदन' : lang === 'as' ? 'অফলাইন আৱেদন' : 'Offline Application'}
                    </button>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 py-2 text-sm border border-outline-variant hover:bg-surface-container text-center flex items-center justify-center no-underline">
                      {lang === 'hi' ? 'दिशा-निर्देश' : lang === 'as' ? 'নিৰ্দেশনা' : 'Get Directions'}
                    </a>
                  </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="w-full flex-grow bg-surface-container-lowest relative z-0">
          <div className="absolute top-4 left-4 right-4 z-[400] flex gap-2">
            <div className="relative flex-grow shadow-md">
              <Search className="absolute left-3 top-3 text-on-surface-variant" size={18} />
              <input 
                type="text" 
                placeholder={lang === 'hi' ? 'स्थान या नाम से खोजें' : lang === 'as' ? 'স্থান বা নামৰ দ্বাৰা বিচাৰক' : 'Search by Location or Name'}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg border-none focus:ring-2 focus:ring-secondary text-sm font-medium" 
              />
            </div>
            <select value={partnerType} onChange={(e) => setPartnerType(e.target.value)} className="bg-surface px-4 py-2.5 rounded-lg shadow-md text-sm font-bold text-on-surface-variant flex items-center border-none focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer">
                <option value="">{lang === 'hi' ? 'सभी' : lang === 'as' ? 'সকলো' : 'All Banks'}</option>
                <option value="Public Sector Bank">Public Sector</option>
                <option value="Private Sector Bank">Private Sector</option>
                <option value="Regional Rural Bank">Rural Banks</option>
              </select>
          </div>

          {/* We use a 'key' here so the map instantly recenters if the user clicks Find My Location */}
          <MapContainer key={userLoc ? userLoc.join(',') : 'default'} center={userLoc || [26.2006, 92.9376]} zoom={userLoc ? 9 : 7} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
            <ZoomControl position="bottomright" />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Blue pin for User's real location */}
            {userLoc && (
              <Marker position={userLoc}>
                <Popup><strong>{lang === 'hi' ? '📍 आप यहाँ हैं!' : lang === 'as' ? '📍 আপুনি ইয়াতে আছে!' : '📍 You are here!'}</strong></Popup>
              </Marker>
            )}

            {/* Pins for Channel Partners */}
            {filteredPartners.map(p => (
              <Marker key={p.id} position={[p.lat, p.lng]}>
                <Popup>
                  <strong className="text-sm">{p.name}</strong><br/>
                  <span className="text-xs text-gray-600">{p.type} • {p.dist}</span><br/><br/>
                  {p.eligible ? (lang === 'hi' ? '✅ आवेदन स्वीकार कर रहे हैं' : lang === 'as' ? '✅ আবেদন গ্ৰহণ কৰি আছে' : '✅ Accepting Applications') : (lang === 'hi' ? '❌ केवल सामान्य ऋण' : lang === 'as' ? '❌ কেৱল সাধাৰণ ঋণ' : '❌ General Loans Only')}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

// --- ABOUT PAGE ---
const AboutPage = ({ lang }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <h2 className="display-md text-primary mb-6 text-center">{lang === 'hi' ? 'हमारे बारे में' : lang === 'as' ? 'আমাৰ বিষয়ে' : 'About SchemeSetu'}</h2>
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-container space-y-6">
        <p className="body-lg text-on-surface">
          {lang === 'hi' ? 'SchemeSetu एक अभिनव AI-संचालित मंच है जिसे हाशिए पर रहने वाले उद्यमियों और सरकारी वित्तीय योजनाओं के बीच की खाई को पाटने के लिए डिज़ाइन किया गया है।' : lang === 'as' ? 'SchemeSetu হৈছে এক উদ্ভাৱনীমূলক AI-চালিত মঞ্চ যিটো প্ৰান্তীয় উদ্যোগী আৰু চৰকাৰী বিত্তীয় আঁচনিসমূহৰ মাজৰ ব্যৱধান দূৰ কৰিবলৈ নিৰ্মাণ কৰা হৈছে।' : 'SchemeSetu is an innovative AI-driven platform designed to bridge the gap between marginalized entrepreneurs and government financial schemes.'}
        </p>
        <p className="body-lg text-on-surface">
          {lang === 'hi' ? 'सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE) के तहत, हम ऋण, अनुदान और माइक्रो-क्रेडिट विकल्पों की खोज और आवेदन प्रक्रिया को सरल बनाते हैं, विशेष रूप से एससी समुदायों के लिए।' : lang === 'as' ? 'সামাজিক ন্যায় আৰু সৱলীকৰণ মন্ত্ৰালয় (MoSJE) ৰ অধীনত, আমি বিশেষকৈ অনুসূচিত জাতিৰ সম্প্ৰদায়সমূহৰ বাবে ঋণ, অনুদান আৰু মাইক্ৰ\'-ক্ৰেডিট বিকল্পসমূহৰ সন্ধান আৰু আবেদন প্ৰক্ৰিয়া সৰল কৰোঁ।' : 'Under the Ministry of Social Justice and Empowerment (MoSJE), we simplify the discovery and application process for loans, grants, and micro-credit options, particularly for SC communities.'}
        </p>
        <div className="mt-8 pt-8 border-t border-surface-container">
          <h3 className="headline-sm text-secondary mb-4">{lang === 'hi' ? 'हमारा मिशन' : lang === 'as' ? 'আমাৰ লক্ষ্য' : 'Our Mission'}</h3>
          <p className="body-md text-on-surface-variant">
            {lang === 'hi' ? 'स्मार्ट स्वचालन और व्यक्तिगत अनुशंसाओं के माध्यम से सुलभ, पारदर्शी और कुशल वित्तीय सहायता सुनिश्चित करके समुदायों को सशक्त बनाना।' : lang === 'as' ? 'স্মাৰ্ট স্বয়ংক্ৰিয়কৰণ আৰু ব্যক্তিগতকৃত পৰামৰ্শৰ জৰিয়তে সুলভ, স্বচ্ছ আৰু দক্ষ বিত্তীয় সাহায্য নিশ্চিত কৰি সম্প্ৰদায়সমূহক সৱলীকৰণ কৰা।' : 'To empower communities by ensuring accessible, transparent, and efficient financial assistance through smart automation and personalized recommendations.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- CONTACT PAGE ---
const ContactPage = ({ lang }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <h2 className="display-md text-primary mb-6 text-center">{lang === 'hi' ? 'हमसे संपर्क करें' : lang === 'as' ? 'আমাৰ সৈতে যোগাযোগ কৰক' : 'Reach Out to Us'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-container">
          <h3 className="headline-sm text-on-surface mb-6">{lang === 'hi' ? 'संपर्क जानकारी' : lang === 'as' ? 'যোগাযোগৰ তথ্য' : 'Contact Information'}</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-container text-on-primary-container rounded-full"><MapPin size={24}/></div>
              <div>
                <h4 className="font-bold text-on-surface">{lang === 'hi' ? 'मुख्यालय' : lang === 'as' ? 'মুখ্য কাৰ্যালয়' : 'Headquarters'}</h4>
                <p className="text-on-surface-variant mt-1">Ministry of Social Justice & Empowerment<br/>Shastri Bhawan, New Delhi - 110001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-container text-on-secondary-container rounded-full"><MessageCircle size={24}/></div>
              <div>
                <h4 className="font-bold text-on-surface">{lang === 'hi' ? 'ईमेल और फ़ोन' : lang === 'as' ? 'ইমেইল আৰু ফোন' : 'Email & Phone'}</h4>
                <p className="text-on-surface-variant mt-1">support@schemesetu.gov.in<br/>+91-11-2338XXXX</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-container">
          <h3 className="headline-sm text-on-surface mb-6">{lang === 'hi' ? 'हमें एक संदेश भेजें' : lang === 'as' ? 'আমালৈ বাৰ্তা প্ৰেৰণ কৰক' : 'Send us a message'}</h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert(lang === 'hi' ? 'संदेश भेजा गया!' : lang === 'as' ? 'বাৰ্তা প্ৰেৰণ কৰা হ\'ল!' : 'Message Sent!'); }}>
            <div>
              <label className="block label-md text-on-surface mb-1">{lang === 'hi' ? 'नाम' : lang === 'as' ? 'নাম' : 'Name'}</label>
              <input type="text" required className="w-full p-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block label-md text-on-surface mb-1">{lang === 'hi' ? 'ईमेल' : lang === 'as' ? 'ইমেইল' : 'Email'}</label>
              <input type="email" required className="w-full p-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block label-md text-on-surface mb-1">{lang === 'hi' ? 'संदेश' : lang === 'as' ? 'বাৰ্তা' : 'Message'}</label>
              <textarea required rows="4" className="w-full p-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"></textarea>
            </div>
            <button type="submit" className="w-full btn-primary py-3">{lang === 'hi' ? 'सबमिट करें' : lang === 'as' ? 'জমা দিয়ক' : 'Submit'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- AI CHATBOT COMPONENT ---
const AIChatbot = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          role: 'model',
          content: lang === 'hi' 
            ? 'नमस्ते! मैं SchemeSetu AI हूँ। मैं आपको सरकारी योजनाओं को समझने में कैसे मदद कर सकता हूँ?' 
            : lang === 'as' 
            ? 'নমস্কাৰ! মই SchemeSetu AI। মই আপোনাক চৰকাৰী আঁচনিসমূহ বুজাত কেনেকৈ সহায় কৰিব পাৰোঁ?' 
            : 'Hello! I am SchemeSetu AI. How can I help you understand government financial schemes today?'
        }]);
      }, 0);
    }
  }, [isOpen, lang, messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-3.6-flash',
        systemInstruction: "You are SchemeSetu AI, a helpful, friendly assistant for marginalized entrepreneurs in India. You help users understand government financial schemes, grants, and loans, especially from the Ministry of Social Justice and Empowerment (MoSJE). Provide short, clear, and direct answers in the user's language. Never use markdown formatting like bolding or lists, just use plain text."
      });

      const contents = [];
      // Gemini requires the first message to be from the user
      if (messages.length > 0 && messages[0].role === 'model') {
        contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
      }
      
      messages.forEach(m => {
        contents.push({ role: m.role, parts: [{ text: m.content }] });
      });
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const result = await model.generateContent({ contents });
      const text = result.response.text();

      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: lang === 'hi' ? 'क्षमा करें, मुझे इस समय आपसे जुड़ने में परेशानी हो रही है। कृपया सुनिश्चित करें कि API कुंजी कॉन्फ़िगर की गई है।' : 
                 lang === 'as' ? 'ক্ষমা কৰিব, এই মুহূৰ্তত আপোনাৰ সৈতে সংযোগ স্থাপন কৰাত মোৰ অসুবিধা হৈছে। অনুগ্ৰহ কৰি নিশ্চিত কৰক যে API চাবিটো কনফিগাৰ কৰা হৈছে।' : 
                 'Sorry, I am having trouble connecting right now. Please ensure the API key is configured in your .env file.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <Bot size={28} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-surface border border-surface-container shadow-xl rounded-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-primary p-4 text-on-primary flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">SchemeSetu AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-container/20 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto bg-surface-container-lowest space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-secondary text-on-secondary rounded-br-none' : 'bg-surface-container text-on-surface rounded-bl-none'}`}>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface-container text-on-surface max-w-[80%] p-3 rounded-2xl rounded-bl-none flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-surface border-t border-surface-container flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'hi' ? 'अपना प्रश्न पूछें...' : lang === 'as' ? 'আপোনাৰ প্ৰশ্ন সোধক...' : 'Ask a question...'}
              className="flex-grow bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              <Send size={16} className="-ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

// --- APP SHELL ---
function App() {
  const [lang, setLang] = useState(() => {
    return sessionStorage.getItem('schemeSetuLang') || null;
  });

  useEffect(() => {
    if (lang) {
      sessionStorage.setItem('schemeSetuLang', lang);
    }
  }, [lang]);

  if (!lang) {
    return <LanguageModal setLang={setLang} />;
  }

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-secondary selection:text-on-secondary">
      <nav className="bg-surface/80 backdrop-blur-md shadow-sm border-b border-surface-container sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-primary font-extrabold text-3xl tracking-tight">
                <Landmark className="mr-2 text-primary" size={32} />
                SchemeSetu
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <NavLink to="/" className={({ isActive }) => `hidden lg:block font-semibold transition-colors ${isActive ? 'text-secondary underline underline-offset-8 decoration-2' : 'text-on-surface hover:text-secondary'}`}>{lang === 'hi' ? 'होम' : lang === 'as' ? 'হোম' : 'Home'}</NavLink>
              <NavLink to="/about" className={({ isActive }) => `hidden lg:block font-semibold transition-colors ${isActive ? 'text-secondary underline underline-offset-8 decoration-2' : 'text-on-surface hover:text-secondary'}`}>{lang === 'hi' ? 'हमारे बारे में' : lang === 'as' ? 'আমাৰ বিষয়ে' : 'About'}</NavLink>
              <NavLink to="/find" className={({ isActive }) => `hidden sm:block font-semibold transition-colors ${isActive ? 'text-secondary underline underline-offset-8 decoration-2' : 'text-on-surface hover:text-secondary'}`}>{t.navFind}</NavLink>
              <NavLink to="/calculator" className={({ isActive }) => `hidden sm:block font-semibold transition-colors ${isActive ? 'text-secondary underline underline-offset-8 decoration-2' : 'text-on-surface hover:text-secondary'}`}>{t.emiBtn}</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `hidden lg:block font-semibold transition-colors ${isActive ? 'text-secondary underline underline-offset-8 decoration-2' : 'text-on-surface hover:text-secondary'}`}>{lang === 'hi' ? 'संपर्क करें' : lang === 'as' ? 'যোগাযোগ' : 'Contact'}</NavLink>
              <NavLink to="/partners" className={({ isActive }) => `hidden sm:flex font-semibold items-center px-4 py-2 rounded-lg transition-colors text-on-secondary-fixed bg-secondary-fixed hover:bg-secondary-fixed-dim ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}><MapPin className="mr-1.5" size={18} /> {t.navLocate}</NavLink>
              
              {/* Dropdown to change language later */}
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="ml-2 sm:ml-4 bg-surface border border-surface-container text-on-surface font-bold py-2 px-2 sm:px-3 rounded-lg focus:outline-none focus:border-secondary">
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
          <Route path="/about" element={<AboutPage lang={lang} />} />
          <Route path="/contact" element={<ContactPage lang={lang} />} />
          <Route path="/explore" element={<ExploreSchemes lang={lang} />} />
          <Route path="/scheme/:id" element={<SchemeDetails lang={lang} />} />
          <Route path="/find" element={<FindScheme lang={lang} />} />
          <Route path="/results" element={<ResultsPage lang={lang} />} />
          <Route path="/calculator" element={<CalculatorPage lang={lang} />} />
          <Route path="/partners" element={<PartnersPage lang={lang} />} />
          <Route path="*" element={<div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in"><h1 className="display-lg text-primary mb-4">404</h1><p className="body-lg text-on-surface-variant mb-8">Page Not Found</p><Link to="/" className="btn-primary">Return Home</Link></div>} />
        </Routes>
      </main>
      
      <AIChatbot lang={lang} />
    </div>
  );
}

export default App;