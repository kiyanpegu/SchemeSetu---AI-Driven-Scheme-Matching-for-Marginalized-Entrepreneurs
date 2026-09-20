import { schemes } from '../src/data/schemes.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const districtData = [
    { district: "Kamrup Metropolitan", applicants: 412, sanctioned: 298, absorption: "72.3%", topScheme: "Mahila Samriddhi Yojana (MSY)", state: "Assam" },
    { district: "Barpeta", applicants: 328, sanctioned: 215, absorption: "65.5%", topScheme: "NBCFDC Shilp Sampada (Artisans)", state: "Assam" },
    { district: "Nagaon", applicants: 284, sanctioned: 194, absorption: "68.3%", topScheme: "NSFDC Term Loan", state: "Assam" },
    { district: "Cachar (Silchar)", applicants: 241, sanctioned: 152, absorption: "63.1%", topScheme: "PMEGP Rural Enterprise", state: "Assam" },
    { district: "Dibrugarh", applicants: 198, sanctioned: 147, absorption: "74.2%", topScheme: "NSFDC Green Business (E-Rickshaws)", state: "Assam" },
    { district: "Nalbari", applicants: 176, sanctioned: 121, absorption: "68.8%", topScheme: "Suvidha Loan", state: "Assam" },
    { district: "Sonitpur (Tezpur)", applicants: 165, sanctioned: 110, absorption: "66.7%", topScheme: "PM Vishwakarma Traditional Trades", state: "Assam" },
    { district: "Dhubri", applicants: 154, sanctioned: 95, absorption: "61.7%", topScheme: "Micro-Credit Finance (MCF)", state: "Assam" }
  ];

  const intermediaryAbsorption = [
    { channel: "Public Sector Banks (PSBs)", allocation: "₹45.0 Cr", absorbed: "₹34.8 Cr", rate: 77.3 },
    { channel: "Assam Gramin Vikash Bank (RRB)", allocation: "₹28.0 Cr", absorbed: "₹21.6 Cr", rate: 77.1 },
    { channel: "State Channelizing Agencies (SCAs)", allocation: "₹18.5 Cr", absorbed: "₹12.4 Cr", rate: 67.0 },
    { channel: "Urban / District Co-op Banks", allocation: "₹8.5 Cr", absorbed: "₹5.2 Cr", rate: 61.2 }
  ];

  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    system: {
      platform: "SchemeSetu National Telemetry System",
      nodal_ministry: "MoSJE",
      scheme_count: schemes.length
    },
    kpis: {
      activePartners: 38,
      verifiedDossiers: 1958,
      qualificationRate: "88.4%",
      totalPipelineCr: "₹24.8 Cr",
      avgProcessingDays: 3.2
    },
    districtDemand: districtData,
    intermediaryAbsorption
  });
}

