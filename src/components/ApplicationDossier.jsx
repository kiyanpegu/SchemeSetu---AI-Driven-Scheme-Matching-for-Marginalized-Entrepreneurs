import React, { useRef } from 'react';
import { Printer, X, CheckSquare, Landmark, ShieldCheck, MapPin, FileText, Download } from 'lucide-react';

export default function ApplicationDossier({ scheme, userData, lang = 'en', onClose }) {
  const dossierRef = useRef(null);
  
  if (!scheme) return null;

  // Generate reference number based on scheme id and timestamp
  const refCode = `SETU-SC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const currentDate = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'as' ? 'as-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

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
              <h2 className="font-bold text-lg">Official Application Readiness Dossier</h2>
              <p className="text-xs text-primary-container-light">Carry this document to the bank for priority scheme processing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-secondary hover:bg-secondary-dim text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer size={16} /> Print / Save PDF
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
                  MoSJE / NSFDC Concessional Finance Channel
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  SchemeSetu Beneficiary Dossier
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  National Scheduled Castes Finance & Development Corporation (NSFDC) Assistance Slip
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-100 border border-slate-300 px-3 py-1 rounded text-xs font-mono font-bold text-slate-800 mb-1">
                {refCode}
              </div>
              <p className="text-[11px] text-slate-500">Date: {currentDate}</p>
            </div>
          </div>

          {/* Scheme Snapshot Grid */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                Matched Financial Scheme
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <ShieldCheck size={14} /> Verification Guaranteed
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">{scheme.name}</h2>
            <p className="text-xs text-slate-600 mb-4">{scheme.shortDesc || scheme.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-slate-200 pt-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Max Scheme Loan</span>
                <span className="text-sm font-bold text-slate-900">{scheme.maxAmount || `₹${scheme.loan_amount_max?.toLocaleString('en-IN')}`}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Interest Rate</span>
                <span className="text-sm font-bold text-blue-900">{scheme.interest || `${scheme.interest_rate_min}% p.a.`}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Grace Period</span>
                <span className="text-sm font-bold text-slate-900">{scheme.moratorium_period ? `${scheme.moratorium_period} Months Moratorium` : '3-6 Months'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Repayment Tenure</span>
                <span className="text-sm font-bold text-slate-900">{scheme.repayment_period ? `${scheme.repayment_period / 12} Years (${scheme.repayment_period} mo)` : 'Up to 5 Years'}</span>
              </div>
            </div>
          </div>

          {/* Applicant & Channel Partner Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="border border-slate-200 rounded-lg p-3 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-blue-700" /> Declared Applicant Profile
              </h3>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li><strong>Target Category:</strong> Scheduled Caste (SC) Community</li>
                <li><strong>Purpose:</strong> {userData?.purpose === 'edu' ? 'Higher Professional Education' : 'Micro-Enterprise / Self-Employment'}</li>
                <li><strong>Annual Family Income:</strong> {userData?.income ? `₹${Number(userData.income).toLocaleString('en-IN')}` : 'Within ₹3,00,000 Cap'}</li>
                <li><strong>Age Bracket:</strong> {userData?.age ? `${userData.age} Years` : 'Eligible Working Age'}</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-700" /> Designated Channel Agency
              </h3>
              <ul className="text-xs space-y-1.5 text-slate-700">
                <li><strong>Channelizing Agency:</strong> {scheme.implementing_agency || 'State Channelizing Agency (SCA) & Public Sector Banks'}</li>
                <li><strong>Channel Partner Types:</strong> Public Sector Banks (PSBs), RRBs, SCAs</li>
                <li><strong>Application Mode:</strong> {scheme.online_application_available ? 'Online (Vidyalakshmi / Portal) & Branch' : 'Physical Branch Submission'}</li>
                <li><strong>Official Portal:</strong> <span className="text-[10px] text-blue-800 break-all">{scheme.official_application_portal || scheme.source_url}</span></li>
              </ul>
            </div>
          </div>

          {/* Mandatory Document Checklist */}
          <div className="border border-slate-200 rounded-xl p-4 mb-6 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
              <CheckSquare size={16} className="text-emerald-600" />
              Mandatory Bank Submission Document Checklist
            </h3>
            <p className="text-[11px] text-slate-600 mb-3">
              Please tick and attach physical copies of the following verified credentials before submitting your application to the Nodal Bank Officer:
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
                <p className="text-[10px] uppercase font-semibold text-slate-500">Applicant Signature / Thumb Impression</p>
              </div>
              <div>
                <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
                <p className="text-[10px] uppercase font-semibold text-slate-500">Authorized Bank Nodal Officer / SCA Seal</p>
              </div>
            </div>

            <div className="mt-6 text-[10px] text-slate-400 text-center leading-relaxed">
              SchemeSetu is an AI-powered scheme discovery platform designed under SIH Problem Statement 26092 (Ministry of Social Justice and Empowerment). 
              Final sanction is subject to physical verification of caste credentials and bank underwriting guidelines.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
