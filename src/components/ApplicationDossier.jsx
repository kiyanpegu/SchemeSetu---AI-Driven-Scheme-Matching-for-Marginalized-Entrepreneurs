import { useRef } from 'react';
import { Printer, X, CheckSquare, Landmark, ShieldCheck, MapPin, FileText } from 'lucide-react';
import { getLocalizedScheme } from '../data/schemeTranslations';
import { apiService } from '../services/api';

export default function ApplicationDossier({ scheme: rawScheme, userData, lang = 'en', onClose }) {
  const dossierRef = useRef(null);

  if (!rawScheme) return null;

  const scheme = getLocalizedScheme(rawScheme, lang);

  // Generate deterministic reference number based on scheme id
  const schemeCode = scheme.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5) || 'NSFDC';
  const numericSeed = scheme.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 48201);
  const refCode = `SETU-SC-2026-${schemeCode}-${(numericSeed % 89999) + 10000}`;

  const currentDate = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'as' ? 'as-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    // Register to serverless backend audit trail
    apiService.submitDossier({
      id: refCode,
      applicant: userData?.name || 'Beneficiary Applicant',
      purpose: userData?.purpose === 'edu' ? 'Higher Education Finance' : 'Micro-Enterprise Self-Employment',
      scheme: scheme.name,
      amount: userData?.amount || scheme.loan_amount_max || 250000,
      branch: 'Designated Public Sector Bank',
      district: userData?.district || 'Kamrup Metropolitan',
      state: userData?.state || 'Assam'
    }).catch(() => {});

    window.print();
  };

  const dossierTexts = {
    en: {
      barTitle: "Official Application Readiness Dossier",
      barSub: "Carry this document to the bank for priority scheme processing",
      printBtn: "Print / Save PDF",
      channelTag: "MoSJE / NSFDC Concessional Finance Channel",
      dossierTitle: "SchemeSetu Beneficiary Dossier",
      dossierSub: "National Scheduled Castes Finance & Development Corporation (NSFDC) Assistance Slip",
      dateLabel: "Date:",
      matchedBadge: "Matched Financial Scheme",
      guaranteeBadge: "Verification Guaranteed",
      maxLoan: "Max Scheme Loan",
      interest: "Interest Rate",
      grace: "Grace Period",
      tenure: "Repayment Tenure",
      profileTitle: "Declared Applicant Profile",
      catLabel: "Target Category:",
      catVal: "Scheduled Caste (SC) Community",
      purposeLabel: "Purpose:",
      purposeEdu: "Higher Professional Education",
      purposeBiz: "Micro-Enterprise / Self-Employment",
      incomeLabel: "Annual Family Income:",
      incomeCap: "Within ₹3,00,000 Cap",
      ageLabel: "Age Bracket:",
      ageVal: "Eligible Working Age",
      agencyTitle: "Designated Channel Agency",
      channelAgency: "Channelizing Agency:",
      partnerTypes: "Channel Partner Types:",
      partnerTypesVal: "Public Sector Banks (PSBs), RRBs, SCAs",
      appMode: "Application Mode:",
      appModeOnline: "Online (Vidyalakshmi / Portal) & Branch",
      appModeOffline: "Physical Branch Submission",
      portalLabel: "Official Portal:",
      checklistTitle: "Mandatory Bank Submission Document Checklist",
      checklistDesc: "Please tick and attach physical copies of the following verified credentials before submitting your application to the Nodal Bank Officer:",
      sigApplicant: "Applicant Signature / Thumb Impression",
      sigOfficer: "Authorized Bank Nodal Officer / SCA Seal",
      disclaimer: "SchemeSetu is an AI-powered scheme discovery platform designed under SIH Problem Statement 26092 (Ministry of Social Justice and Empowerment). Final sanction is subject to physical verification of caste credentials and bank underwriting guidelines."
    },
    hi: {
      barTitle: "आधिकारिक आवेदन तैयारी डॉसियर",
      barSub: "योजना के त्वरित प्रसंस्करण के लिए यह दस्तावेज़ बैंक शाखा में ले जाएं",
      printBtn: "प्रिंट / पीडीएफ सेव करें",
      channelTag: "MoSJE / NSFDC रियायती वित्तपोषण चैनल",
      dossierTitle: "SchemeSetu लाभार्थी डॉसियर",
      dossierSub: "राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC) सहायता पर्ची",
      dateLabel: "दिनांक:",
      matchedBadge: "अनुशंसित वित्तीय योजना",
      guaranteeBadge: "सत्यापन सुनिश्चित",
      maxLoan: "अधिकतम ऋण सीमा",
      interest: "ब्याज दर",
      grace: "रियायती अवधि (मोरेटोरियम)",
      tenure: "चुकौती अवधि",
      profileTitle: "आवेदक की घोषित प्रोफ़ाइल",
      catLabel: "लक्षित श्रेणी:",
      catVal: "अनुसूचित जाति (SC) समुदाय",
      purposeLabel: "उद्देश्य:",
      purposeEdu: "उच्च व्यावसायिक शिक्षा",
      purposeBiz: "सूक्ष्म उद्यम / स्व-रोजगार",
      incomeLabel: "वार्षिक पारिवारिक आय:",
      incomeCap: "₹3,00,000 की सीमा के भीतर",
      ageLabel: "आयु वर्ग:",
      ageVal: "कार्यशील पात्र आयु",
      agencyTitle: "नामित चैनलाइजिंग एजेंसी",
      channelAgency: "कार्यान्वयन एजेंसी:",
      partnerTypes: "चैनल पार्टनर प्रकार:",
      partnerTypesVal: "सार्वजनिक क्षेत्र के बैंक (PSBs), आरआरबी, राज्य एससीए",
      appMode: "आवेदन मोड:",
      appModeOnline: "ऑनलाइन (विद्यालक्ष्मी / पोर्टल) एवं बैंक शाखा",
      appModeOffline: "भौतिक बैंक शाखा में जमा",
      portalLabel: "आधिकारिक पोर्टल:",
      checklistTitle: "बैंक में जमा किए जाने वाले अनिवार्य दस्तावेजों की चेकलिस्ट",
      checklistDesc: "कृपया नोडल बैंक अधिकारी के पास अपना आवेदन जमा करने से पहले निम्नलिखित सत्यापित प्रमाणपत्रों की भौतिक प्रतियों पर टिक करें और संलग्न करें:",
      sigApplicant: "आवेदक के हस्ताक्षर / अंगूठे का निशान",
      sigOfficer: "अधिकृत बैंक नोडल अधिकारी / SCA की मुहर एवं हस्ताक्षर",
      disclaimer: "SchemeSetu सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE) के तहत SIH समस्या विवरण 26092 हेतु विकसित एक AI-संचालित मंच है। अंतिम ऋण स्वीकृति जाति प्रमाण पत्र के भौतिक सत्यापन एवं बैंक के नियमों के अधीन है।"
    },
    as: {
      barTitle: "আনুষ্ঠানিক আবেদন প্ৰস্তুতি ডচিয়েৰ",
      barSub: "আঁচনিৰ অগ্ৰাধিকাৰমূলক প্ৰক্ৰিয়াকৰণৰ বাবে এই নথি বেংক শাখালৈ লৈ যাওক",
      printBtn: "প্ৰিণ্ট / PDF সংৰক্ষণ কৰক",
      channelTag: "MoSJE / NSFDC ৰেহাই বিত্তীয় চেনেল",
      dossierTitle: "SchemeSetu হিতাধিকাৰী ডচিয়েৰ",
      dossierSub: "ৰাষ্ট্ৰীয় অনুসূচীত জাতি বিত্ত আৰু উন্নয়ন নিগম (NSFDC) সাহায্য শ্লিপ",
      dateLabel: "তাৰিখ:",
      matchedBadge: "উপযুক্ত বিত্তীয় আঁচনি",
      guaranteeBadge: "প্ৰমাণীকৰণ নিশ্চিত",
      maxLoan: "সৰ্বোচ্চ ঋণৰ পৰিমাণ",
      interest: "সুদৰ হাৰ",
      grace: "ৰেহাই ম্যাদ (মৰেটৰিয়াম)",
      tenure: "পৰিশোধৰ ম্যাদ",
      profileTitle: "আবেদনকাৰীৰ ঘোষিত প্ৰফাইল",
      catLabel: "লক্ষ্য শ্ৰেণী:",
      catVal: "অনুসূচীত জাতি (SC) সম্প্ৰদায়",
      purposeLabel: "উদ্দেশ্য:",
      purposeEdu: "উচ্চ পেছাদাৰী শিক্ষা",
      purposeBiz: "ক্ষুদ্ৰ উদ্যোগ / আত্মনিয়োজন",
      incomeLabel: "বাৰ্ষিক পাৰিবাৰিক আয়:",
      incomeCap: "৩,০০,০০০ টকাৰ সীমাৰ ভিতৰত",
      ageLabel: "বয়সৰ সীমা:",
      ageVal: "কৰ্মক্ষম উপযুক্ত বয়স",
      agencyTitle: "নিৰ্ধাৰিত চেনেল সংস্থা",
      channelAgency: "কাৰ্যকৰী সংস্থা:",
      partnerTypes: "চেনেল অংশীদাৰৰ প্ৰকাৰ:",
      partnerTypesVal: "ৰাজহুৱা খণ্ডৰ বেংক (PSBs), আঞ্চলিক গ্ৰাম্য বেংক, ৰাজ্যিক এছচিএ",
      appMode: "আবেদনৰ মাধ্যম:",
      appModeOnline: "অনলাইন (বিদ্যালক্ষ্মী / প'ৰ্টেল) আৰু বেংক শাখা",
      appModeOffline: "বেংক শাখাত আবেদন জমা দিয়া",
      portalLabel: "আনুষ্ঠানিক প'ৰ্টেল:",
      checklistTitle: "বেংকত জমা দিবলগীয়া বাধ্যতামূলক নথি-পত্ৰৰ পৰীক্ষা-তালিকা",
      checklistDesc: "অনুগ্ৰহ কৰি ন’ডেল বেংক বিষয়াৰ ওচৰত আবেদন জমা দিয়াৰ পূৰ্বে তলত দিয়া প্ৰমাণিত নথি-পত্ৰসমূহ চিহ্নিত কৰি সংলগ্ন কৰক:",
      sigApplicant: "আবেদনকাৰীৰ স্বাক্ষৰ / বুঢ়া আঙুলিৰ চাপ",
      sigOfficer: "কৰ্তৃত্বপ্ৰাপ্ত বেংক বিষয়া / SCA ৰ ছীল আৰু স্বাক্ষৰ",
      disclaimer: "SchemeSetu হৈছে সামাজিক ন্যায় আৰু সৱলীকৰণ মন্ত্ৰালয়ৰ অধীনত SIH সমস্যা বিবৃতি ২৬০৯২ ৰ বাবে নিৰ্মিত এক AI-চালিত প্লেটফৰ্ম। চূড়ান্ত অনুমোদন জাতিগত প্ৰমাণপত্ৰৰ শাৰীৰিক পৰীক্ষণ আৰু বেংকৰ নীতি-নিয়মৰ ওপৰত নিৰ্ভৰশীল।"
    }
  };

  const dt = dossierTexts[lang] || dossierTexts.en;

  const checklistItems = [
    { id: 1, label: lang === 'hi' ? 'सक्षम प्राधिकारी (तहसीलदार / एसडीएम) द्वारा जारी वैध अनुसूचित जाति (SC) प्रमाण पत्र' : lang === 'as' ? 'প্ৰশাসনৰ দ্বাৰা প্ৰদান কৰা বৈধ অনুসূচীত জাতি (SC) প্ৰমাণপত্ৰ' : 'Valid Scheduled Caste (SC) Certificate issued by competent revenue authority (SDM/Tehsildar)' },
    { id: 2, label: lang === 'hi' ? 'पारिवारिक वार्षिक आय प्रमाण पत्र (₹3.00 लाख से कम)' : lang === 'as' ? 'বাৰ্ষিক পাৰিবাৰিক আয় প্ৰমাণপত্ৰ (৩ লাখ টকাৰ তলত)' : 'Family Annual Income Certificate / Self-Declaration (strictly under ₹3.00 Lakh)' },
    { id: 3, label: lang === 'hi' ? 'आधार कार्ड एवं पैन कार्ड (पहचान व निवास प्रमाण)' : lang === 'as' ? 'আধাৰ কাৰ্ড আৰু পেন কাৰ্ড' : 'Aadhaar Card and PAN Card (Identity & Residence verification)' },
    { id: 4, label: lang === 'hi' ? 'व्यापार परियोजना रिपोर्ट / मशीनरी या उपकरणों का अनुमानित कोटेशन' : lang === 'as' ? 'ব্যৱসায়ৰ প্ৰকল্প প্ৰতিবেদন বা কোটেশ্বন' : 'Business Project Report / Machinery & Equipment Cost Quotation (or College Admission Letter)' },
    { id: 5, label: lang === 'hi' ? 'आधार से जुड़ा सक्रिय बैंक खाता पासबुक (पिछले 6 माह का विवरण)' : lang === 'as' ? 'আধাৰ সংযুক্ত বেংক পাছবুক (বিগত ৬ মাহৰ তথ্য)' : 'Aadhaar-seeded Active Bank Account Passbook (Statement of last 6 months)' },
    { id: 6, label: lang === 'hi' ? 'पासपोर्ट साइज रंगीन फोटोग्राफ (3 प्रतियां)' : lang === 'as' ? 'পাছপ’ৰ্ট আকাৰৰ ৩ কপি ফটো' : 'Recent Passport Size Color Photographs (3 copies)' },
    { id: 7, label: lang === 'hi' ? 'आयु प्रमाण पत्र (10वीं की मार्कशीट या जन्म प्रमाण पत्र)' : lang === 'as' ? 'বয়সৰ প্ৰমাণপত্ৰ' : 'Age Proof Document (10th Marksheet, Voter ID, or Birth Certificate)' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Container */}
      <div className="bg-surface text-on-surface w-full max-w-3xl rounded-2xl shadow-2xl border border-surface-container overflow-hidden print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full">
        
        {/* Top Action Bar (Hidden during Print) */}
        <div className="bg-primary px-6 py-4 text-on-primary flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="text-secondary-fixed" size={24} />
            <div>
              <h2 className="font-bold text-lg">{dt.barTitle}</h2>
              <p className="text-xs text-primary-container-light">{dt.barSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-secondary hover:bg-secondary-dim text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer size={16} /> {dt.printBtn}
            </button>
            <button
              onClick={onClose}
              className="text-on-primary/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div ref={dossierRef} className="p-6 sm:p-8 bg-white text-slate-900 print:p-6 print:text-black">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-2xl shadow-sm print:border print:border-black">
                <Landmark size={28} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                  {dt.channelTag}
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  {dt.dossierTitle}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {dt.dossierSub}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-100 border border-slate-300 px-3 py-1 rounded text-xs font-mono font-bold text-slate-800 mb-1">
                {refCode}
              </div>
              <p className="text-[11px] text-slate-500">{dt.dateLabel} {currentDate}</p>
            </div>
          </div>

          {/* Scheme Snapshot Grid */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                {dt.matchedBadge}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <ShieldCheck size={14} /> {dt.guaranteeBadge}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">{scheme.name}</h2>
            <p className="text-xs text-slate-600 mb-4">{scheme.shortDesc || scheme.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-slate-200 pt-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">{dt.maxLoan}</span>
                <span className="text-sm font-bold text-slate-900">{scheme.maxAmount || `₹${scheme.loan_amount_max?.toLocaleString('en-IN')}`}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">{dt.interest}</span>
                <span className="text-sm font-bold text-blue-900">{scheme.interest || `${scheme.interest_rate_min}% p.a.`}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">{dt.grace}</span>
                <span className="text-sm font-bold text-slate-900">{scheme.moratorium_period ? `${scheme.moratorium_period} Months Moratorium` : '3-6 Months'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">{dt.tenure}</span>
                <span className="text-sm font-bold text-slate-900">{scheme.repayment_period ? `${scheme.repayment_period / 12} Years (${scheme.repayment_period} mo)` : 'Up to 5 Years'}</span>
              </div>
            </div>
          </div>

          {/* Applicant & Channel Partner Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-3 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-blue-700" /> {dt.profileTitle}
              </h3>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li><strong>{dt.catLabel}</strong> {dt.catVal}</li>
                <li><strong>{dt.purposeLabel}</strong> {userData?.purpose === 'edu' ? dt.purposeEdu : dt.purposeBiz}</li>
                <li><strong>{dt.incomeLabel}</strong> {userData?.income ? `₹${Number(userData.income).toLocaleString('en-IN')}` : dt.incomeCap}</li>
                <li><strong>{dt.ageLabel}</strong> {userData?.age ? `${userData.age} Years` : dt.ageVal}</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-700" /> {dt.agencyTitle}
              </h3>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li><strong>{dt.channelAgency}</strong> {scheme.implementing_agency || 'State Channelizing Agency (SCA) & Public Sector Banks'}</li>
                <li><strong>{dt.partnerTypes}</strong> {dt.partnerTypesVal}</li>
                <li><strong>{dt.appMode}</strong> {scheme.online_application_available ? dt.appModeOnline : dt.appModeOffline}</li>
                <li><strong>{dt.portalLabel}</strong> <span className="text-[10px] text-blue-800 break-all">{scheme.official_application_portal || scheme.source_url}</span></li>
              </ul>
            </div>
          </div>

          {/* Mandatory Document Checklist */}
          <div className="border border-slate-200 rounded-xl p-4 mb-6 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
              <CheckSquare size={16} className="text-emerald-600" />
              {dt.checklistTitle}
            </h3>
            <p className="text-[11px] text-slate-600 mb-3">
              {dt.checklistDesc}
            </p>

            <div className="space-y-2">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs text-slate-800">
                  <div className="w-4 h-4 rounded border-2 border-slate-400 mt-0.5 shrink-0 flex items-center justify-center print:border-black"></div>
                  <span className="leading-snug">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nodal Officer Endorsement & Instructions */}
          <div className="border-t-2 border-slate-200 pt-4 mt-6">
            <div className="grid grid-cols-2 gap-8 text-center pt-8">
              <div>
                <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
                <p className="text-[10px] uppercase font-semibold text-slate-500">{dt.sigApplicant}</p>
              </div>
              <div>
                <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
                <p className="text-[10px] uppercase font-semibold text-slate-500">{dt.sigOfficer}</p>
              </div>
            </div>

            <div className="mt-6 text-[10px] text-slate-400 text-center leading-relaxed">
              {dt.disclaimer}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
