/* global process */
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  const {
    businessIdea = 'Poultry Farming Unit',
    capital = 250000,
    targetScheme = 'Mahila Samriddhi Yojana',
    language = 'en'
  } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `You are the Official Government Business Feasibility and Scheme Advisor for the Ministry of Social Justice and Empowerment (MoSJE), Government of India.
Analyze the following small business proposal from a marginalized entrepreneur seeking credit assistance:
- Business Idea: ${businessIdea}
- Estimated Capital Requirement: ₹${capital}
- Target Scheme: ${targetScheme}
- Output Language: ${language === 'hi' ? 'Hindi (हिन्दी)' : language === 'as' ? 'Assamese (অসমীয়া)' : 'English'}

Provide a structured, encouraging, bank-defensible assessment.
Respond strictly in JSON format with these exact keys:
{
  "feasibilityScore": (number between 70 and 96),
  "capitalAssessment": (string - detailed capital breakdown: machinery/equipment, initial working capital, own contribution needed),
  "bestFitScheme": (string - exact government scheme name and why it fits this specific venture),
  "mandatoryLicenses": (array of 3 to 4 required local permits or licenses, e.g., Trade License from Municipal Body/Panchayat, Udyam Registration, FSSAI if food),
  "roadmap": (array of 3 sequential, actionable steps to prepare before walking into the bank branch),
  "estimatedMonthlyNetProfit": (string - realistic monthly net profit after debt service, e.g. "₹18,000 - ₹25,000"),
  "bankCautionAdvice": (string - key advice to avoid rejection at the bank branch)
}`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      });

      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      return res.status(200).json({
        success: true,
        source: 'gemini-2.5-flash',
        analysis: parsed
      });
    } catch (aiErr) {
      console.warn('Gemini API call failed on backend, falling back to heuristic engine:', aiErr.message);
    }
  }

  // Resilient Heuristic Fallback Engine
  const capNum = Number(capital) || 250000;
  const isHi = language === 'hi';
  const isAs = language === 'as';

  const fallbackAnalysis = {
    feasibilityScore: 88,
    capitalAssessment: isHi 
      ? `₹${capNum.toLocaleString('en-IN')} की अनुमानित पूंजी में 65% उपकरण/परिसंपत्ति, 25% कार्यशील पूंजी और 10% प्रमोटर का स्वयं का अंशदान शामिल है।`
      : isAs
      ? `₹${capNum.toLocaleString('en-IN')} ৰ আনুমানিক মূলধনৰ ভিতৰত ৬৫% সা-সঁজুলি, ২৫% কাৰ্য্যকৰী মূলধন আৰু ১০% নিজা বিনিয়োগ থাকিব লাগিব।`
      : `Estimated capital of ₹${capNum.toLocaleString('en-IN')} comprises 65% for capital assets/machinery, 25% initial working capital, and 10% own promoter contribution.`,
    bestFitScheme: targetScheme || 'NSFDC Term Loan / Mahila Samriddhi Yojana',
    mandatoryLicenses: isHi 
      ? ["स्थानीय नगर निगम या ग्राम पंचायत ट्रेड लाइसेंस", "एमएसएमई उद्यम आधार पंजीकरण (निःशुल्क)", "पैन कार्ड एवं आधार से लिंक बैंक खाता", "खाद्य व्यवसाय होने पर एफएसएसएआई पंजीकरण"]
      : isAs
      ? ["গাঁও পঞ্চায়ত বা পৌৰসভাৰ ব্যৱসায়িক অনুজ্ঞাপত্ৰ (ট্ৰেড লাইচেঞ্চ)", "এমএছএমই উদ্যোগ আধাৰ পঞ্জীয়ন", "আধাৰ সংযুক্ত বেংক একাউণ্ট", "খাদ্য প্ৰস্তুতৰ ক্ষেত্ৰত এফএছএছএআই অনুজ্ঞাপত্ৰ"]
      : ["Local Trade License (Urban Local Body or Gram Panchayat)", "Free MSME Udyam Registration Certificate", "Aadhaar-linked Savings/Current Bank Account", "FSSAI Registration (if food/agri related)"],
    roadmap: isHi
      ? [
          "कच्चे माल और उपकरणों का अधिकृत विक्रेताओं से कोटेशन (दर-सूची) प्राप्त करें।",
          "जाति प्रमाण पत्र और पिछले 6 महीने का बैंक स्टेटमेंट तैयार रखें।",
          "स्कीमसेतु का आवेदन डोजियर प्रिंट करें और निकटतम अधिकृत बैंक शाखा में प्रस्तुत करें।"
        ]
      : isAs
      ? [
          "প্ৰয়োজনীয় সা-সঁজুলিৰ স্থানীয় ব্যৱসায়ীৰ পৰা লিখিত মূল্য তালিকা সংগ্ৰহ কৰক।",
          "জাতি প্ৰমাণপত্ৰ আৰু যোৱা ৬ মাহৰ বেংক একাউণ্ট ষ্টেটমেণ্ট সংগ্ৰহ কৰক।",
          "স্কিমসেতুৰ আবেদন ডজিয়াৰ প্ৰিণ্ট কৰি নিকটতম বেংক শাখাত জমা দিয়ক।"
        ]
      : [
          "Obtain written quotation for tools/machinery from authorized equipment vendors.",
          "Assemble caste certificate, Aadhaar, and recent 6-month bank statement.",
          "Download the SchemeSetu Application Dossier and submit directly at designated channel partner branch."
        ],
    estimatedMonthlyNetProfit: `₹${Math.round(capNum * 0.08).toLocaleString('en-IN')} - ₹${Math.round(capNum * 0.14).toLocaleString('en-IN')}`,
    bankCautionAdvice: isHi
      ? "बैंक में कभी भी बिचौलियों के माध्यम से न जाएं। सीधे शाखा प्रबंधक या कृषि/ऋण अधिकारी से योजना का नाम लेकर मिलें।"
      : isAs
      ? "বেংকত কোনো মধ্যভোগী বা দালালৰ সহায় নল'ব। পোনপটীয়াকৈ শাখা প্ৰবন্ধক বা ঋণ বিষয়াৰ সৈতে কথা পাতক।"
      : "Never approach the bank through unauthorized middlemen. Meet the Branch Manager or Credit Officer directly citing the exact MoSJE scheme."
  };

  return res.status(200).json({
    success: true,
    source: 'heuristic-engine-fallback',
    analysis: fallbackAnalysis
  });
}
