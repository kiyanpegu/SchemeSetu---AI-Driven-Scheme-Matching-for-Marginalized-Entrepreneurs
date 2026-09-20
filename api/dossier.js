// In-memory persistent state for serverless lifetime
let dossierStore = [
  {
    id: 'SETU-SC-2026-84912',
    applicant: 'Pooja Das',
    purpose: 'Tailoring Boutique',
    scheme: 'Mahila Samriddhi Yojana (MSY)',
    branch: 'SBI Dispur Branch',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    amount: '₹1,40,000',
    date: '20 Sep 2026',
    status: 'Dossier Downloaded & Verified'
  },
  {
    id: 'SETU-SC-2026-58219',
    applicant: 'Rohit Baishya',
    purpose: 'Electronics Repair Kiosk',
    scheme: 'Suvidha Loan',
    branch: 'PNB Panbazar',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    amount: '₹3,00,000',
    date: '19 Sep 2026',
    status: 'Dossier Downloaded & Verified'
  },
  {
    id: 'SETU-OBC-2026-39144',
    applicant: 'Mintu Saikia',
    purpose: 'Bell Metal Artisan Workshop',
    scheme: 'NBCFDC Shilp Sampada Scheme',
    branch: 'Assam Gramin Vikash Bank Sarthebari',
    district: 'Barpeta',
    state: 'Assam',
    amount: '₹4,50,000',
    date: '19 Sep 2026',
    status: 'Branch Pre-Screening Passed'
  },
  {
    id: 'SETU-SC-2026-21804',
    applicant: 'Anjali Medhi',
    purpose: 'Organic Vermicompost Unit',
    scheme: 'NSFDC Green Business Scheme',
    branch: 'UCO Bank Nalbari',
    district: 'Nalbari',
    state: 'Assam',
    amount: '₹2,50,000',
    date: '18 Sep 2026',
    status: 'Dossier Downloaded & Verified'
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { id } = req.query || {};
    if (id) {
      const match = dossierStore.find(d => d.id === id);
      if (!match) {
        return res.status(404).json({ success: false, error: 'Dossier not found' });
      }
      return res.status(200).json({ success: true, dossier: match });
    }
    return res.status(200).json({
      success: true,
      count: dossierStore.length,
      dossiers: dossierStore
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const generatedId = body.id || `SETU-${body.category || 'SC'}-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      const newRecord = {
        id: generatedId,
        applicant: body.applicant || 'Beneficiary Applicant',
        purpose: body.purpose || 'Self-Employment Enterprise',
        scheme: body.scheme || 'NSFDC Term Loan Scheme',
        branch: body.branch || 'Designated Public Sector Bank',
        district: body.district || 'Kamrup Metropolitan',
        state: body.state || 'Assam',
        amount: body.amount ? `₹${Number(body.amount).toLocaleString('en-IN')}` : '₹3,00,000',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Dossier Downloaded & Verified',
        checklistComplete: true
      };

      dossierStore.unshift(newRecord);
      if (dossierStore.length > 50) dossierStore.pop();

      return res.status(201).json({
        success: true,
        message: 'Application Dossier registered successfully in MoSJE Nodal Telemetry Audit Trail',
        dossier: newRecord
      });
    } catch (err) {
      console.error('Error in /api/dossier POST:', err);
      return res.status(500).json({ success: false, error: 'Failed to record application dossier' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
