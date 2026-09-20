import { useState } from 'react';
import { 
  Users, IndianRupee, ShieldAlert, CheckCircle, 
  MapPin, Download, Filter, TrendingUp, Building2, FileCheck2 
} from 'lucide-react';
import { partners } from '../data/partners';

const dashboardTexts = {
  en: {
    portalBadge: "Official MoSJE & Channel Partner Nodal Administration Portal",
    title: "SchemeSetu National Analytics & Delivery Oversight",
    desc: "Real-time telemetry tracking grassroots scheme discovery, caste certificate qualification rates, and partner branch loan absorption.",
    exportReport: "Export Report",
    statBeneficiarySearches: "Total Beneficiary Searches",
    statVerifiedApplicants: "Verified Eligible SC Applicants",
    statFundsRouted: "Concessional Funds Routed",
    statActivePartners: "Active Channel Partners",
    branchesUnit: "Branches",
    statThisMonth: "+18.4% this month",
    statQualRate: "74.1% qualification rate",
    statNsfdcRoute: "Via NSFDC / PSB channels",
    statGeotagged: "100% geotagged & verified",
    districtDemandTitle: "District-Level Demand Telemetry",
    districtDemandDesc: "Identifies regions where SC entrepreneurs are actively seeking capital",
    allStates: "All States",
    liveFeed: "Live Feed",
    colDistrict: "District / Region",
    colState: "State",
    colInquiries: "Total Inquiries",
    colTopScheme: "Most Demanded Scheme",
    colActivity: "Activity",
    channelAbsorptionTitle: "Channel Absorption",
    channelAbsorptionDesc: "Disbursement share across designated financial intermediaries",
    psbLabel: "Public Sector Banks (SBI, PNB, Canara)",
    scaLabel: "State Channelizing Agencies (SCAs)",
    rrbLabel: "Regional Rural Banks (RRBs)",
    policyInsightTitle: "Nodal Officer Policy Insight",
    policyInsightDesc: "Rural uptake in Assam increased by 32% following the deployment of vernacular audio narration and downloadable branch readiness slips.",
    apiHealthLabel: "Intermediary API Health",
    apiHealthValue: "99.8% Online",
    auditTrailTitle: "Generated Beneficiary Dossiers (Audit Trail)",
    auditTrailDesc: "Live log of validated applicant readiness slips generated for branch submission",
    colDossierId: "Dossier ID",
    colApplicant: "Applicant",
    colPurpose: "Purpose / Venture",
    colMatchedScheme: "Matched Scheme",
    colTargetBranch: "Target Branch",
    colDate: "Date",
    colStatus: "Status",
    statusDossierDownloaded: "Dossier Downloaded",
    statusInReview: "In Review",
    statusBranchVisited: "Branch Visited",
    statusApproved: "Approved",
    demandHigh: "High Demand",
    demandActive: "Active"
  },
  hi: {
    portalBadge: "आधिकारिक सामाजिक न्याय एवं अधिकारिता मंत्रालय व नोडल प्रशासन पोर्टल",
    title: "स्कीमसेतु राष्ट्रीय विश्लेषण एवं वितरण निगरानी",
    desc: "जमीनी स्तर पर योजना खोज, जाति प्रमाण पत्र सत्यापन दर और बैंक शाखाओं द्वारा ऋण वितरण की रीयल-टाइम ट्रैकिंग।",
    exportReport: "रिपोर्ट निर्यात करें",
    statBeneficiarySearches: "कुल लाभार्थी खोजें",
    statVerifiedApplicants: "सत्यापित पात्र एससी आवेदक",
    statFundsRouted: "संवितरित रियायती धनराशि",
    statActivePartners: "सक्रिय चैनल पार्टनर्स",
    branchesUnit: "शाखाएं",
    statThisMonth: "इस माह +18.4%",
    statQualRate: "74.1% पात्रता दर",
    statNsfdcRoute: "NSFDC / बैंक चैनलों द्वारा",
    statGeotagged: "100% जियोटैग एवं सत्यापित",
    districtDemandTitle: "जिला-स्तरीय मांग टेलीमेट्री",
    districtDemandDesc: "उन क्षेत्रों की पहचान जहां एससी उद्यमी सक्रिय रूप से पूंजी की मांग कर रहे हैं",
    allStates: "सभी राज्य",
    liveFeed: "लाइव फीड",
    colDistrict: "जिला / क्षेत्र",
    colState: "राज्य",
    colInquiries: "कुल पूछताछ",
    colTopScheme: "सर्वाधिक मांग वाली योजना",
    colActivity: "गतिविधि",
    channelAbsorptionTitle: "वितरण चैनल हिस्सेदारी",
    channelAbsorptionDesc: "नामित वित्तीय मध्यस्थों के बीच संवितरण का प्रतिशत",
    psbLabel: "सार्वजनिक क्षेत्र के बैंक (SBI, PNB, Canara)",
    scaLabel: "राज्य चैनलाइजिंग एजेंसियां (SCAs)",
    rrbLabel: "क्षेत्रीय ग्रामीण बैंक (RRBs)",
    policyInsightTitle: "नोडल अधिकारी नीतिगत अंतर्दृष्टि",
    policyInsightDesc: "स्थानीय भाषा ऑडियो और डाउनलोड करने योग्य बैंक स्लिप के बाद असम में ग्रामीण स्वीकृति में 32% की वृद्धि दर्ज की गई।",
    apiHealthLabel: "मध्यस्थ एपीआई स्थिति",
    apiHealthValue: "99.8% सक्रिय",
    auditTrailTitle: "निर्मित लाभार्थी डॉसियर (ऑडिट ट्रेल)",
    auditTrailDesc: "बैंक शाखा में जमा करने हेतु तैयार सत्यापित लाभार्थी स्लिप का लाइव रिकॉर्ड",
    colDossierId: "डॉसियर आईडी",
    colApplicant: "आवेदक",
    colPurpose: "उद्देश्य / व्यवसाय",
    colMatchedScheme: "संबद्ध योजना",
    colTargetBranch: "लक्ष्य शाखा",
    colDate: "दिनांक",
    colStatus: "स्थिति",
    statusDossierDownloaded: "डॉसियर डाउनलोड हुआ",
    statusInReview: "समीक्षाधीन",
    statusBranchVisited: "शाखा में संपर्क किया",
    statusApproved: "स्वीकृत",
    demandHigh: "उच्च मांग",
    demandActive: "सक्रिय"
  },
  as: {
    portalBadge: "আনুষ্ঠানিক MoSJE আৰু অংশীদাৰ ন'ডেল প্ৰশাসন প'ৰ্টেল",
    title: "SchemeSetu ৰাষ্ট্ৰীয় বিশ্লেষণ আৰু প্ৰদান তদাৰকী",
    desc: "তৃণমূল পৰ্যায়ত আঁচনি অনুসন্ধান, জাতিগত প্ৰমাণপত্ৰৰ যোগ্যতাৰ হাৰ আৰু বেংক শাখাৰ ঋণ বিতৰণৰ ৰিয়েল-টাইম অনুসৰণ।",
    exportReport: "প্ৰতিবেদন ৰপ্তানি কৰক",
    statBeneficiarySearches: "মুঠ হিতাধিকাৰী অনুসন্ধান",
    statVerifiedApplicants: "সত্যাাপিত যোগ্য অনুসূচীত জাতিৰ আবেদনকাৰী",
    statFundsRouted: "বিতৰণ কৰা ৰেহাই পুঁজি",
    statActivePartners: "সক্ৰিয় চেনেল অংশীদাৰ",
    branchesUnit: "শাখা",
    statThisMonth: "এই মাহত +১৮.৪%",
    statQualRate: "৭৪.১% যোগ্যতাৰ হাৰ",
    statNsfdcRoute: "NSFDC / PSB চেনেলৰ জৰিয়তে",
    statGeotagged: "১০০% জিঅ'টেগ আৰু সত্যাাপিত",
    districtDemandTitle: "জিলা-পৰ্যায়ৰ চাহিদা টেলিমেট্ৰী",
    districtDemandDesc: "যিবোৰ অঞ্চলত অনুসূচীত জাতিৰ উদ্যোগীসকলে পুঁজি বিচাৰিছে সেইবোৰ চিনাক্ত কৰে",
    allStates: "সকলো ৰাজ্য",
    liveFeed: "পোনপটীয়া সম্প্ৰচাৰ",
    colDistrict: "জিলা / অঞ্চল",
    colState: "ৰাজ্য",
    colInquiries: "মুঠ অনুসন্ধান",
    colTopScheme: "সৰ্বাধিক চাহিদা থকা আঁচনি",
    colActivity: "কাৰ্যকলাপ",
    channelAbsorptionTitle: "চেনেল শোষণ অনুপাত",
    channelAbsorptionDesc: "নিৰ্ধাৰিত বিত্তীয় মধ্যস্থতাকাৰীসকলৰ মাজত ঋণ বিতৰণৰ অংশ",
    psbLabel: "ৰাজহুৱা খণ্ডৰ বেংক (SBI, PNB, Canara)",
    scaLabel: "ৰাজ্যিক চেনেলিং এজেন্সী (SCAs)",
    rrbLabel: "আঞ্চলিক গ্ৰাম্য বেংক (RRBs)",
    policyInsightTitle: "ন'ডেল বিষয়াৰ নীতিগত অন্তৰ্দৃষ্টি",
    policyInsightDesc: "স্থানীয় কণ্ঠ স্বৰবৰ্ণন আৰু শাখা প্ৰস্তুতি শ্লিপ মুকলি কৰাৰ পাছত অসমত গ্ৰাম্য গ্ৰহণযোগ্যতা ৩২% বৃদ্ধি পাইছে।",
    apiHealthLabel: "মধ্যস্থতাকাৰী API স্বাস্থ্য",
    apiHealthValue: "৯৯.৮% অনলাইন",
    auditTrailTitle: "উৎপাদিত হিতাধিকাৰী ডচিয়েৰ (অডিট ট্ৰেইল)",
    auditTrailDesc: "শাখা দাখিলৰ বাবে প্ৰস্তুত কৰা সত্যাাপিত আবেদনকাৰীৰ শ্লিপৰ পোনপটীয়া তালিকা",
    colDossierId: "ডচিয়েৰ আইডি",
    colApplicant: "আবেদনকাৰী",
    colPurpose: "উদ্দেশ্য / উদ্যোগ",
    colMatchedScheme: "মিলা আঁচনি",
    colTargetBranch: "লক্ষ্য শাখা",
    colDate: "তাৰিখ",
    colStatus: "স্থিতি",
    statusDossierDownloaded: "ডচিয়েৰ ডাউনল'ড হ'ল",
    statusInReview: "পুনৰীক্ষণত আছে",
    statusBranchVisited: "শাখালৈ গৈছে",
    statusApproved: "অনুমোদিত",
    demandHigh: "উচ্চ চাহিদা",
    demandActive: "সক্ৰিয়"
  }
};

export default function AdminDashboard({ lang = 'en' }) {
  const t = dashboardTexts[lang] || dashboardTexts.en;
  const [selectedState, setSelectedState] = useState('All');

  // Summary Metrics (Grounding in realistic MoSJE / NSFDC parameters)
  const stats = [
    {
      title: t.statBeneficiarySearches,
      value: lang === 'hi' ? '२४,८५०' : lang === 'as' ? '২৪,৮৫০' : '24,850',
      change: t.statThisMonth,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: t.statVerifiedApplicants,
      value: lang === 'hi' ? '१८,४२०' : lang === 'as' ? '১৮,৪২০' : '18,420',
      change: t.statQualRate,
      icon: FileCheck2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: t.statFundsRouted,
      value: lang === 'hi' ? '₹४२.८ करोड़' : lang === 'as' ? '₹৪২.৮ কোটি' : '₹42.8 Cr',
      change: t.statNsfdcRoute,
      icon: IndianRupee,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      title: t.statActivePartners,
      value: `${partners.length} ${t.branchesUnit}`,
      change: t.statGeotagged,
      icon: Building2,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  // District-level demand data
  const districtDemand = [
    { district: 'Kamrup Metro (Guwahati)', state: 'Assam', searches: 3420, topScheme: 'Mahila Samriddhi Yojana (MSY)', status: t.demandHigh },
    { district: 'Dibrugarh', state: 'Assam', searches: 1890, topScheme: 'Micro-Credit Finance (MCF)', status: t.demandActive },
    { district: 'Sonitpur (Tezpur)', state: 'Assam', searches: 1420, topScheme: 'Suvidha Loan', status: t.demandActive },
    { district: 'Patna', state: 'Bihar', searches: 4120, topScheme: 'Utkarsh Loan', status: t.demandHigh },
    { district: 'Varanasi', state: 'Uttar Pradesh', searches: 3890, topScheme: 'Micro-Credit Finance (MCF)', status: t.demandHigh },
    { district: 'Nagpur', state: 'Maharashtra', searches: 2950, topScheme: 'Educational Loan Scheme (ELS)', status: t.demandActive }
  ];

  // Recent Application Dossiers Log
  const recentDossiers = [
    { id: 'SETU-SC-2026-84912', applicant: 'Pooja Das', purpose: 'Tailoring Boutique', scheme: 'Mahila Samriddhi Yojana', branch: 'SBI Dispur Branch', date: '20 Sep 2026', status: t.statusDossierDownloaded },
    { id: 'SETU-SC-2026-39104', applicant: 'Manoj Basumatary', purpose: 'Livestock & Feed Unit', scheme: 'Micro-Credit Finance', branch: 'AGVB Silpukhuri', date: '20 Sep 2026', status: t.statusInReview },
    { id: 'SETU-SC-2026-58219', applicant: 'Rohit Baishya', purpose: 'Electronics Repair Kiosk', scheme: 'Suvidha Loan', branch: 'PNB Panbazar', date: '19 Sep 2026', status: t.statusDossierDownloaded },
    { id: 'SETU-SC-2026-11928', applicant: 'Anjali Medhi', purpose: 'M.Tech Tuition Finance', scheme: 'Educational Loan Scheme', branch: 'Canara Bank Guwahati', date: '18 Sep 2026', status: t.statusBranchVisited },
    { id: 'SETU-SC-2026-72491', applicant: 'Karan Barman', purpose: 'Light Commercial Vehicle', scheme: 'Utkarsh Loan', branch: 'UCO Bank Guwahati', date: '18 Sep 2026', status: t.statusApproved }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <ShieldAlert size={14} /> {t.portalBadge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            {t.desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-white/10 cursor-pointer"
          >
            <Download size={15} /> {t.exportReport}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-surface border border-surface-container rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{stat.title}</span>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-on-surface mb-1">{stat.value}</div>
              <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <TrendingUp size={12} /> {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: District Heatmap & Scheme Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* District Demand Telemetry */}
        <div className="lg:col-span-2 bg-surface border border-surface-container rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-on-surface">{t.districtDemandTitle}</h2>
              <p className="text-xs text-on-surface-variant">{t.districtDemandDesc}</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-on-surface-variant" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-surface border border-surface-container text-xs rounded-lg px-2.5 py-1 font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="All">{t.allStates}</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg">
                {t.liveFeed}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-surface-container text-on-surface-variant uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-bold">{t.colDistrict}</th>
                  <th className="pb-3 font-bold">{t.colState}</th>
                  <th className="pb-3 font-bold">{t.colInquiries}</th>
                  <th className="pb-3 font-bold">{t.colTopScheme}</th>
                  <th className="pb-3 font-bold text-right">{t.colActivity}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {districtDemand
                  .filter(row => selectedState === 'All' || row.state === selectedState)
                  .map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-bold text-on-surface flex items-center gap-2">
                      <MapPin size={14} className="text-primary shrink-0" />
                      {row.district}
                    </td>
                    <td className="py-3 text-on-surface-variant">{row.state}</td>
                    <td className="py-3 font-bold text-on-surface">{row.searches.toLocaleString(lang + '-IN')}</td>
                    <td className="py-3 text-primary font-medium">{row.topScheme}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === t.demandHigh ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Channel Partner Fulfillment Ratio */}
        <div className="bg-surface border border-surface-container rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-on-surface mb-1">{t.channelAbsorptionTitle}</h2>
            <p className="text-xs text-on-surface-variant mb-6">{t.channelAbsorptionDesc}</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-on-surface">{t.psbLabel}</span>
                  <span className="text-primary">54%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-on-surface">{t.scaLabel}</span>
                  <span className="text-secondary">28%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-on-surface">{t.rrbLabel}</span>
                  <span className="text-amber-600">18%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <h4 className="text-xs font-bold text-primary mb-1">{t.policyInsightTitle}</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                {t.policyInsightDesc}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-container mt-6 flex justify-between items-center text-xs">
            <span className="text-on-surface-variant">{t.apiHealthLabel}</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle size={14} /> {t.apiHealthValue}
            </span>
          </div>
        </div>

      </div>

      {/* Live Application Dossier Tracking Table */}
      <div className="bg-surface border border-surface-container rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-on-surface">{t.auditTrailTitle}</h2>
            <p className="text-xs text-on-surface-variant">{t.auditTrailDesc}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-container text-on-surface-variant uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3 font-bold">{t.colDossierId}</th>
                <th className="pb-3 font-bold">{t.colApplicant}</th>
                <th className="pb-3 font-bold">{t.colPurpose}</th>
                <th className="pb-3 font-bold">{t.colMatchedScheme}</th>
                <th className="pb-3 font-bold">{t.colTargetBranch}</th>
                <th className="pb-3 font-bold">{t.colDate}</th>
                <th className="pb-3 font-bold text-right">{t.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {recentDossiers.map((item, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 font-mono font-bold text-primary">{item.id}</td>
                  <td className="py-3 font-semibold text-on-surface">{item.applicant}</td>
                  <td className="py-3 text-on-surface-variant">{item.purpose}</td>
                  <td className="py-3 font-medium text-slate-800">{item.scheme}</td>
                  <td className="py-3 text-on-surface-variant flex items-center gap-1">
                    <Building2 size={12} className="text-slate-400" /> {item.branch}
                  </td>
                  <td className="py-3 text-on-surface-variant text-[11px]">{item.date}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === t.statusApproved ? 'bg-emerald-100 text-emerald-800' :
                      item.status === t.statusBranchVisited ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
