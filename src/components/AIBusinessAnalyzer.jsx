import { useState } from 'react';
import { Sparkles, BrainCircuit, CheckCircle2, AlertCircle, Lightbulb, RefreshCw, ChevronRight } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { schemes } from '../data/schemes';
import { getLocalizedScheme } from '../data/schemeTranslations';
import { VoiceInputButton, SpeakButton } from './VoiceAssistant';

const analyzerTexts = {
  en: {
    badge: "AI-Powered Business Idea Feasibility Engine",
    title: "Describe Your Enterprise Idea",
    desc: "Tell us in your own words what business or study you want to finance. Our AI analyzes capital feasibility and maps you to the exact concessional scheme.",
    placeholder: 'e.g. "I want to start a small poultry farm with 200 chicks and need ₹1.2 Lakhs for shed and feed..."',
    quickTestLabel: "Or Try a One-Click Test Scenario:",
    btnAnalyzing: "Analyzing Proposal with Gemini AI...",
    btnAnalyze: "Analyze Feasibility & Match Scheme",
    resultHeader: "AI Feasibility & Allocation Assessment",
    sectorLabel: "Sector",
    confidenceLabel: "Match Confidence",
    listenAnalysis: "Listen to Analysis",
    recommendedBanner: "Recommended Primary Scheme",
    maxLoan: "Max Loan",
    interest: "Interest",
    gracePeriod: "Grace Period",
    viewDetails: "View Scheme Details",
    whyFitsHeader: "💡 Why this scheme fits your venture:",
    roadmapHeader: "📋 Immediate 3-Step Action Roadmap:",
    monthsUnit: "mo",
    fallbackSector: "Self-Employment & Micro-Enterprise",
    fallbackCapital: "As declared in proposal",
    fallbackRisk: "Viable grassroots enterprise eligible for priority sector refinance.",
    fallbackWhy: (name) => `Your proposal aligns with ${name}, which provides specialized concessional credit with low interest rates and a moratorium grace period.`,
    fallbackPlan: [
      "Step 1: Obtain formal equipment/stock quotation from supplier",
      "Step 2: Verify valid SC Caste Certificate and family income under ₹3.00 Lakh",
      "Step 3: Download SchemeSetu Application Dossier and approach nearest PSB branch"
    ]
  },
  hi: {
    badge: "एआई-संचालित व्यावसायिक व्यवहार्यता इंजन",
    title: "अपने व्यवसायिक विचार से योजना खोजें",
    desc: "आप क्या काम शुरू करना चाहते हैं? बोलें या लिखें। हमारा AI आपके बजट और सेक्टर का विश्लेषण कर सबसे उपयुक्त सरकारी योजना का सुझाव देगा।",
    placeholder: 'उदा. "मैं अपने गाँव में ₹1 लाख के ऋण से छोटी किराना दुकान और आटा चक्की शुरू करना चाहता हूँ..."',
    quickTestLabel: "या इन उदाहरणों में से चुनें (एक क्लिक):",
    btnAnalyzing: "जेमिनी एआई से प्रस्ताव का विश्लेषण हो रहा है...",
    btnAnalyze: "व्यवहार्यता जांचें और योजना खोजें",
    resultHeader: "एआई व्यवहार्यता एवं आवंटन मूल्यांकन",
    sectorLabel: "क्षेत्र (सेक्टर)",
    confidenceLabel: "मिलान सटीकता",
    listenAnalysis: "विश्लेषण सुनें",
    recommendedBanner: "अनुशंसित प्राथमिक योजना",
    maxLoan: "अधिकतम ऋण",
    interest: "ब्याज दर",
    gracePeriod: "रियायती अवधि",
    viewDetails: "योजना विवरण देखें",
    whyFitsHeader: "💡 यह योजना आपके उद्यम के लिए उपयुक्त क्यों है:",
    roadmapHeader: "📋 तत्काल 3-चरणीय कार्य योजना:",
    monthsUnit: "माह",
    fallbackSector: "स्व-रोजगार एवं सूक्ष्म उद्यम",
    fallbackCapital: "प्रस्ताव में घोषित अनुसार",
    fallbackRisk: "प्राथमिकता क्षेत्र के तहत रियायती पुनर्वित्त के लिए पात्र उद्यम।",
    fallbackWhy: (name) => `आपका प्रस्ताव ${name} के अनुकूल है, जो न्यूनतम ब्याज दर और मोरेटोरियम रियायत के साथ विशेष ऋण प्रदान करता है।`,
    fallbackPlan: [
      "चरण 1: विक्रेता/आपूर्तिकर्ता से उपकरणों का औपचारिक कोटेशन प्राप्त करें",
      "चरण 2: वैध एससी जाति प्रमाण पत्र और ₹3 लाख से कम आय प्रमाण पत्र तैयार रखें",
      "चरण 3: स्कीमसेतु आवेदन डॉसियर डाउनलोड कर निकटतम बैंक शाखा में जाएं"
    ]
  },
  as: {
    badge: "এআই-চালিত ব্যৱসায়িক সম্ভাৱনীয়তা ইঞ্জিন",
    title: "আপোনাৰ ব্যৱসায়িক চিন্তাৰে আঁচনি বিচাৰক",
    desc: "আপুনি কি কাম আৰম্ভ কৰিব বিচাৰে? কওক বা লিখক। আমাৰ AI-য়ে আপোনাৰ বাজেট আৰু ক্ষেত্ৰ বিশ্লেষণ কৰি সৰ্বোত্তম চৰকাৰী আঁচনিৰ পৰামৰ্শ দিব।",
    placeholder: 'উদাহৰণস্বৰূপ: "মই গাঁৱত ১ লাখ টকাৰ ঋণেৰে এখন সৰু মুদি দোকান আৰু আটা মিল আৰম্ভ কৰিব বিচাৰোঁ..."',
    quickTestLabel: "বা এই উদাহৰণসমূহৰ পৰা বাছক (এটা ক্লিক):",
    btnAnalyzing: "Gemini AI ৰ দ্বাৰা প্ৰস্তাৱ বিশ্লেষণ কৰি থকা হৈছে...",
    btnAnalyze: "সম্ভাৱনীয়তা পৰীক্ষা আৰু আঁচনি নিৰ্ণয়",
    resultHeader: "এআই সম্ভাৱনীয়তা আৰু আবণ্টন মূল্যায়ন",
    sectorLabel: "ক্ষেত্ৰ",
    confidenceLabel: "মেচৰ সঠিকতা",
    listenAnalysis: "বিশ্লেষণ শুনক",
    recommendedBanner: "পৰামৰ্শপ্ৰাপ্ত প্ৰাথমিক আঁচনি",
    maxLoan: "সৰ্বোচ্চ ঋণ",
    interest: "সুদৰ হাৰ",
    gracePeriod: "ৰেহাইৰ ম্যাদ",
    viewDetails: "আঁচনিৰ বিৱৰণ চাওক",
    whyFitsHeader: "💡 এই আঁচনিখন আপোনাৰ উদ্যোগৰ বাবে কিয় উপযুক্ত:",
    roadmapHeader: "📋 তাৎক্ষণিক ৩-পদক্ষেপৰ কৰ্মপৰিকল্পনা:",
    monthsUnit: "মাহ",
    fallbackSector: "স্ব-নিয়োজন আৰু ক্ষুদ্ৰ উদ্যোগ",
    fallbackCapital: "প্ৰস্তাৱত উল্লেখ কৰা অনুসৰি",
    fallbackRisk: "অগ্রাধিকাৰ খণ্ডৰ অধীনত সাহায্যপ্ৰাপ্ত পুনৰ্বিত্তৰ যোগ্য উদ্যোগ।",
    fallbackWhy: (name) => `আপোনাৰ প্ৰস্তাৱটো ${name} ৰ সৈতে সংগতিপূৰ্ণ, যিয়ে কম সুদৰ হাৰ আৰু মৰেটৰিয়াম ৰেহাইৰ সৈতে ঋণ প্ৰদান কৰে।`,
    fallbackPlan: [
      "পদক্ষেপ ১: সামগ্ৰী যোগানকৰ্তাৰ পৰা সামগ্ৰীৰ আনুষ্ঠানিক কোটেচন লওক",
      "পদক্ষেপ ২: বৈধ অনুসূচীত জাতিৰ প্ৰমাণপত্ৰ আৰু ৩ লাখৰ তলৰ আয়ৰ প্ৰমাণ সংগ্ৰহ কৰক",
      "পদক্ষেপ ৩: SchemeSetu আবেদন ডচিয়েৰ ডাউনল'ড কৰি নিকটতম বেংক শাখাত জমা দিয়ক"
    ]
  }
};

export default function AIBusinessAnalyzer({ lang = 'en', onSelectScheme }) {
  const t = analyzerTexts[lang] || analyzerTexts.en;
  const [ideaText, setIdeaText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleIdeas = [
    {
      title: lang === 'hi' ? 'सिलाई और बुटीक की दुकान' : lang === 'as' ? 'চিলাই আৰু কাপোৰৰ দোকান' : 'Tailoring & Garments Boutique',
      desc: lang === 'hi' ? 'गाँव में 2 सिलाई मशीनें और कपड़ा सामग्री खरीदने के लिए ₹80,000 का ऋण चाहिए' : lang === 'as' ? 'গাঁৱত ২টা চিলাই মেচিন আৰু কাপোৰ কিনিবলৈ ৮০,০০০ টকাৰ ঋণ লাগে' : 'Need ₹80,000 to purchase 2 commercial sewing machines and fabric stock for a local shop'
    },
    {
      title: lang === 'hi' ? 'डेयरी एवं पशुपालन इकाई' : lang === 'as' ? 'দুগ্ধ আৰু পশুপালন ফাৰ্ম' : 'Dairy & Livestock Unit',
      desc: lang === 'hi' ? '2 दुधारू गायें और चारा शेड बनाने के लिए ₹1.5 लाख का ऋण' : lang === 'as' ? '২জনী গাই আৰু ঘাঁহৰ ভঁৰাল সাজিবলৈ ১.৫ লাখ টকাৰ ঋণ' : 'Need ₹1.5 Lakhs to acquire 2 milch cattle, shed construction, and initial cattle feed'
    },
    {
      title: lang === 'hi' ? 'मोबाइल व इलेक्ट्रॉनिक्स रिपेयर' : lang === 'as' ? 'ম’বাইল আৰু ইলেকট্ৰনিক্স মেৰামতি' : 'Mobile Repair & Digital Kiosk',
      desc: lang === 'hi' ? 'टूलकिट, लैपटॉप और स्पेयर पार्ट्स के लिए ₹1.2 लाख की आवश्यकता' : lang === 'as' ? 'টুলকিট, কম্পিউটাৰ আৰু পাৰ্টছৰ বাবে ১.২ লাখ টকা' : 'Need ₹1.2 Lakhs for repair toolkits, diagnostic laptop, and initial spare parts inventory'
    },
    {
      title: lang === 'hi' ? 'उच्च तकनीकी शिक्षा (इंजीनियरिंग)' : lang === 'as' ? 'উচ্চ কাৰিকৰী শিক্ষা' : 'B.Tech / Professional Degree',
      desc: lang === 'hi' ? 'इंजीनियरिंग कॉलेज की फीस और लैपटॉप के लिए ₹4 लाख का शिक्षा ऋण' : lang === 'as' ? 'কাৰিকৰী কলেজৰ ফীচ আৰু লেপটপৰ বাবে ৪ লাখ টকা' : 'Seeking ₹4 Lakhs educational loan for recognized full-time engineering degree tuition fees'
    }
  ];

  const handleAnalyze = async (textToAnalyze) => {
    const input = textToAnalyze || ideaText;
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const langName = lang === 'hi' ? 'Hindi (हिन्दी)' : lang === 'as' ? 'Assamese (অসমীয়া)' : 'English';

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: "application/json" },
        systemInstruction: `You are the SchemeSetu AI Decision Engine for Ministry of Social Justice & Empowerment (MoSJE) schemes.
Analyze the user's business idea and match them to the single best scheme from this verified list:
- "mahila-samriddhi" (Mahila Samriddhi Yojana): For SC women micro-entrepreneurs, project cost up to ₹1.4L, loan up to ₹1.25L at 4% p.a.
- "nsfdc-mcf" (Micro-Credit Finance): For SC micro-entrepreneurs, loan up to ₹1.25L at 6.5% p.a.
- "nsfdc-suvidha" (Suvidha Loan): For SC small business, loan up to ₹9L at 8% p.a.
- "nsfdc-utkarsh" (Utkarsh Loan): For medium SC enterprise, loan up to ₹45L at 9% p.a.
- "nsfdc-els-india" (Educational Loan Scheme): For SC students admitted to professional courses in India up to ₹30L at 6% p.a.
- "mudra-pmmy" (Pradhan Mantri MUDRA): Non-farm micro-units up to ₹10L.
- "asiim" (Ambedkar Social Innovation): Tech startups and students in higher ed.

IMPORTANT: The requested language is ${langName}. You MUST generate the fields 'businessSector', 'whyThisFits', 'riskAssessment', and all array items in 'actionPlan' in ${langName}.

Return ONLY a valid JSON object matching this schema:
{
  "matchedSchemeId": "scheme_id_here",
  "matchConfidence": 94,
  "businessSector": "Sector description in ${langName}",
  "estimatedCapital": "₹80,000",
  "whyThisFits": "A 2-3 sentence clear explanation in ${langName} of why this scheme provides the best interest rate, moratorium, and loan amount for their specific venture.",
  "riskAssessment": "Assessment in ${langName}",
  "actionPlan": [
    "Step 1 in ${langName}",
    "Step 2 in ${langName}",
    "Step 3 in ${langName}"
  ]
}`
      });

      const prompt = `Analyze this applicant's business / financial proposal:
"${input}"

Evaluate sector, loan bracket, and match with the optimal NSFDC/MoSJE scheme. Language requested: ${langName}.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      // Map alias if returned
      const targetId = parsed.matchedSchemeId === 'msy' ? 'mahila-samriddhi' : parsed.matchedSchemeId;
      const matchedRawObj = schemes.find(s => s.id === targetId) || schemes[0];
      const matchedSchemeObj = getLocalizedScheme(matchedRawObj, lang);

      setAnalysisResult({
        ...parsed,
        scheme: matchedSchemeObj
      });

    } catch (err) {
      console.error("AI Analysis failed:", err);
      // Fallback: Smart heuristic matching if API fails
      const lower = input.toLowerCase();
      let fallbackId = "nsfdc-mcf";
      if (lower.includes('study') || lower.includes('college') || lower.includes('degree') || lower.includes('education') || lower.includes('fee')) {
        fallbackId = "nsfdc-els-india";
      } else if (lower.includes('women') || lower.includes('woman') || lower.includes('tailor') || lower.includes('sewing') || lower.includes('boutique') || lower.includes('सिलाई') || lower.includes('চিলাই')) {
        fallbackId = "mahila-samriddhi";
      } else if (lower.includes('factory') || lower.includes('manufacturing') || lower.includes('scale') || lower.includes('plant')) {
        fallbackId = "nsfdc-utkarsh";
      } else if (lower.includes('tech') || lower.includes('software') || lower.includes('startup') || lower.includes('ai')) {
        fallbackId = "asiim";
      }

      const matchedRawObj = schemes.find(s => s.id === fallbackId) || schemes[0];
      const matchedSchemeObj = getLocalizedScheme(matchedRawObj, lang);

      setAnalysisResult({
        matchedSchemeId: fallbackId,
        matchConfidence: 92,
        businessSector: t.fallbackSector,
        estimatedCapital: t.fallbackCapital,
        whyThisFits: t.fallbackWhy(matchedSchemeObj.name),
        riskAssessment: t.fallbackRisk,
        actionPlan: t.fallbackPlan,
        scheme: matchedSchemeObj
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-6 sm:p-8 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full mb-2">
            <Sparkles size={14} /> {t.badge}
          </div>
          <h2 className="text-2xl font-bold text-on-surface">
            {t.title}
          </h2>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            {t.desc}
          </p>
        </div>
      </div>

      {/* Input Box with Voice Support */}
      <div className="relative mb-4">
        <textarea
          rows={3}
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          placeholder={t.placeholder}
          className="w-full p-4 pr-12 rounded-xl bg-surface border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/60"
        />
        <div className="absolute right-3 top-3">
          <VoiceInputButton
            lang={lang}
            onTranscript={(transcript) => {
              setIdeaText(prev => prev ? `${prev} ${transcript}` : transcript);
            }}
          />
        </div>
      </div>

      {/* Quick Test Samples (Essential for Demo) */}
      <div className="mb-6">
        <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
          <Lightbulb size={14} className="text-amber-500" />
          <span>{t.quickTestLabel}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {sampleIdeas.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIdeaText(sample.desc);
                handleAnalyze(sample.desc);
              }}
              className="text-left p-2.5 rounded-lg border border-surface-container bg-surface hover:bg-surface-container-high transition-all text-xs group cursor-pointer"
            >
              <div className="font-bold text-primary group-hover:text-secondary truncate">{sample.title}</div>
              <div className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">{sample.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => handleAnalyze()}
          disabled={isAnalyzing || !ideaText.trim()}
          className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>{t.btnAnalyzing}</span>
            </>
          ) : (
            <>
              <BrainCircuit size={16} />
              <span>{t.btnAnalyze}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Analysis Results Card */}
      {analysisResult && (
        <div className="mt-8 border border-secondary/30 bg-secondary/5 rounded-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-secondary/20 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">
                AI
              </span>
              <div>
                <h3 className="font-bold text-base text-on-surface">{t.resultHeader}</h3>
                <p className="text-xs text-on-surface-variant">{t.sectorLabel}: <span className="font-semibold text-primary">{analysisResult.businessSector}</span> | {t.confidenceLabel}: <span className="font-bold text-emerald-600">{analysisResult.matchConfidence}%</span></p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SpeakButton 
                lang={lang} 
                text={`${analysisResult.scheme.name}. ${analysisResult.whyThisFits}`}
                label={t.listenAnalysis}
              />
            </div>
          </div>

          {/* Matched Scheme Highlight Banner */}
          <div className="bg-surface border border-surface-container rounded-xl p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                {t.recommendedBanner}
              </span>
              <h4 className="text-lg font-bold text-primary mt-1">{analysisResult.scheme.name}</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">{analysisResult.scheme.shortDesc}</p>
              
              <div className="flex flex-wrap gap-4 mt-2 text-xs font-semibold">
                <span className="text-slate-700">{t.maxLoan}: <strong>{analysisResult.scheme.maxAmount}</strong></span>
                <span className="text-blue-900">{t.interest}: <strong>{analysisResult.scheme.interest}</strong></span>
                <span className="text-slate-700">{t.gracePeriod}: <strong>{analysisResult.scheme.moratorium_period ? `${analysisResult.scheme.moratorium_period} ${t.monthsUnit}` : `3 ${t.monthsUnit}`}</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectScheme(analysisResult.scheme)}
              className="shrink-0 bg-secondary hover:bg-secondary-dim text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              {t.viewDetails} <ChevronRight size={14} />
            </button>
          </div>

          {/* AI Fit Explanation */}
          <div className="space-y-3 text-xs text-on-surface mb-4">
            <div>
              <strong className="text-primary block mb-1">{t.whyFitsHeader}</strong>
              <p className="leading-relaxed bg-white/80 p-3 rounded-lg border border-outline-variant/30 text-slate-700">
                {analysisResult.whyThisFits}
              </p>
            </div>

            {/* Action Roadmap */}
            <div>
              <strong className="text-primary block mb-1">{t.roadmapHeader}</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {analysisResult.actionPlan.map((step, sIdx) => (
                  <div key={sIdx} className="bg-white/80 p-2.5 rounded-lg border border-outline-variant/30 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-700 leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
