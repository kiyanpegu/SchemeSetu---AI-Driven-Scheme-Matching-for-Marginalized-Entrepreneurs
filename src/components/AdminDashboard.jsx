import { useState } from 'react';
import { 
  Users, IndianRupee, ShieldAlert, CheckCircle, 
  MapPin, Download, Filter, TrendingUp, Building2, FileCheck2 
} from 'lucide-react';
import { partners } from '../data/partners';

export default function AdminDashboard() {
  const [selectedState, setSelectedState] = useState('All');

  // Summary Metrics (Grounding in realistic MoSJE / NSFDC parameters)
  const stats = [
    {
      title: 'Total Beneficiary Searches',
      value: '24,850',
      change: '+18.4% this month',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Verified Eligible SC Applicants',
      value: '18,420',
      change: '74.1% qualification rate',
      icon: FileCheck2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Concessional Funds Routed',
      value: '₹42.8 Cr',
      change: 'Via NSFDC / PSB channels',
      icon: IndianRupee,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      title: 'Active Channel Partners',
      value: `${partners.length} Branches`,
      change: '100% geotagged & verified',
      icon: Building2,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  // District-level demand data (Focus on Assam & North-East as well as national metros)
  const districtDemand = [
    { district: 'Kamrup Metro (Guwahati)', state: 'Assam', searches: 3420, topScheme: 'Mahila Samriddhi Yojana (MSY)', status: 'High Demand' },
    { district: 'Dibrugarh', state: 'Assam', searches: 1890, topScheme: 'Micro-Credit Finance (MCF)', status: 'Active' },
    { district: 'Sonitpur (Tezpur)', state: 'Assam', searches: 1420, topScheme: 'Suvidha Loan', status: 'Active' },
    { district: 'Patna', state: 'Bihar', searches: 4120, topScheme: 'Utkarsh Loan', status: 'High Demand' },
    { district: 'Varanasi', state: 'Uttar Pradesh', searches: 3890, topScheme: 'Micro-Credit Finance (MCF)', status: 'High Demand' },
    { district: 'Nagpur', state: 'Maharashtra', searches: 2950, topScheme: 'Educational Loan Scheme (ELS)', status: 'Active' }
  ];

  // Recent Application Dossiers Log
  const recentDossiers = [
    { id: 'SETU-SC-2026-84912', applicant: 'Pooja Das', purpose: 'Tailoring Boutique', scheme: 'Mahila Samriddhi Yojana', branch: 'SBI Dispur Branch', date: '20 Sep 2026', status: 'Dossier Downloaded' },
    { id: 'SETU-SC-2026-39104', applicant: 'Manoj Basumatary', purpose: 'Livestock & Feed Unit', scheme: 'Micro-Credit Finance', branch: 'AGVB Silpukhuri', date: '20 Sep 2026', status: 'In Review' },
    { id: 'SETU-SC-2026-58219', applicant: 'Rohit Baishya', purpose: 'Electronics Repair Kiosk', scheme: 'Suvidha Loan', branch: 'PNB Panbazar', date: '19 Sep 2026', status: 'Dossier Downloaded' },
    { id: 'SETU-SC-2026-11928', applicant: 'Anjali Medhi', purpose: 'M.Tech Tuition Finance', scheme: 'Educational Loan Scheme', branch: 'Canara Bank Guwahati', date: '18 Sep 2026', status: 'Branch Visited' },
    { id: 'SETU-SC-2026-72491', applicant: 'Karan Barman', purpose: 'Light Commercial Vehicle', scheme: 'Utkarsh Loan', branch: 'UCO Bank Guwahati', date: '18 Sep 2026', status: 'Approved' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <ShieldAlert size={14} /> Official MoSJE & Channel Partner Nodal Administration Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SchemeSetu National Analytics & Delivery Oversight
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Real-time telemetry tracking grassroots scheme discovery, caste certificate qualification rates, and partner branch loan absorption.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-white/10 cursor-pointer"
          >
            <Download size={15} /> Export Report
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
              <h2 className="text-lg font-bold text-on-surface">District-Level Demand Telemetry</h2>
              <p className="text-xs text-on-surface-variant">Identifies regions where SC entrepreneurs are actively seeking capital</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-on-surface-variant" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-surface border border-surface-container text-xs rounded-lg px-2.5 py-1 font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="All">All States</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg">
                Live Feed
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-surface-container text-on-surface-variant uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-bold">District / Region</th>
                  <th className="pb-3 font-bold">State</th>
                  <th className="pb-3 font-bold">Total Inquiries</th>
                  <th className="pb-3 font-bold">Most Demanded Scheme</th>
                  <th className="pb-3 font-bold text-right">Activity</th>
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
                    <td className="py-3 font-bold text-on-surface">{row.searches.toLocaleString()}</td>
                    <td className="py-3 text-primary font-medium">{row.topScheme}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'High Demand' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
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
            <h2 className="text-lg font-bold text-on-surface mb-1">Channel Absorption</h2>
            <p className="text-xs text-on-surface-variant mb-6">Disbursement share across designated financial intermediaries</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-on-surface">Public Sector Banks (SBI, PNB, Canara)</span>
                  <span className="text-primary">54%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-on-surface">State Channelizing Agencies (SCAs)</span>
                  <span className="text-secondary">28%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-on-surface">Regional Rural Banks (RRBs)</span>
                  <span className="text-amber-600">18%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <h4 className="text-xs font-bold text-primary mb-1">Nodal Officer Policy Insight</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Rural uptake in Assam increased by 32% following the deployment of vernacular audio narration and downloadable branch readiness slips.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-container mt-6 flex justify-between items-center text-xs">
            <span className="text-on-surface-variant">Intermediary API Health</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle size={14} /> 99.8% Online
            </span>
          </div>
        </div>

      </div>

      {/* Live Application Dossier Tracking Table */}
      <div className="bg-surface border border-surface-container rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Generated Beneficiary Dossiers (Audit Trail)</h2>
            <p className="text-xs text-on-surface-variant">Live log of validated applicant readiness slips generated for branch submission</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-container text-on-surface-variant uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3 font-bold">Dossier ID</th>
                <th className="pb-3 font-bold">Applicant</th>
                <th className="pb-3 font-bold">Purpose / Venture</th>
                <th className="pb-3 font-bold">Matched Scheme</th>
                <th className="pb-3 font-bold">Target Branch</th>
                <th className="pb-3 font-bold">Date</th>
                <th className="pb-3 font-bold text-right">Status</th>
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
                      item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'Branch Visited' ? 'bg-purple-100 text-purple-800' :
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

