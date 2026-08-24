import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Landmark, Calculator, MapPin, Search, BrainCircuit, ShieldCheck, Users, ChevronRight, ChevronLeft, MessageCircle, X, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Fix for default map markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- HOME COMPONENT ---
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 animate-in fade-in duration-700">
    <div className="bg-white/60 backdrop-blur-sm p-2 pr-6 rounded-full inline-flex items-center gap-3 mb-8 border border-blue-100 shadow-sm">
      <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">SIH 2026</span>
      <span className="text-sm font-medium text-gray-700">Built by Team MISFITS</span>
    </div>
    <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-500 drop-shadow-sm">
      SchemeSetu
    </h1>
    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl leading-relaxed">
      Bridging the gap between SC communities and financial empowerment through intelligent, AI-driven scheme matching.
    </p>
    <div className="flex flex-wrap justify-center gap-4 mb-16">
      <Link to="/find" className="bg-gradient-to-r from-brand-orange to-orange-400 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 flex items-center transition-all duration-300 text-lg">
        <Search className="mr-3" size={24} /> Find Your Scheme
      </Link>
      <Link to="/calculator" className="bg-white hover:bg-gray-50 text-brand-blue font-bold py-4 px-8 rounded-xl shadow-md border-2 border-transparent hover:border-blue-100 flex items-center hover:-translate-y-1 transition-all duration-300 text-lg">
        <Calculator className="mr-3" size={24} /> EMI Calculator
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
      {[
        { icon: BrainCircuit, title: "AI Matching", desc: "Our smart engine finds the perfect NSFDC scheme for your exact needs." },
        { icon: ShieldCheck, title: "100% Transparent", desc: "No hidden fees. See exact interest rates and moratorium periods upfront." },
        { icon: Users, title: "Direct Connect", desc: "Find and navigate to your nearest official Channel Partner instantly." }
      ].map((feature, idx) => (
        <div key={idx} className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
          <div className="bg-blue-50 text-brand-blue w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
            <feature.icon size={24} />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- EMI CALCULATOR ---
const CalculatorPage = () => {
  const [loanAmount, setLoanAmount] = useState(140000);
  const [interestRate, setInterestRate] = useState(5.0);
  const [tenureYears, setTenureYears] = useState(3);

  const p = Number(loanAmount);
  const r = Number(interestRate) / 12 / 100;
  const n = Number(tenureYears) * 12;

  let emi = 0, totalPayable = 0, totalInterest = 0;
  if (p > 0 && r > 0 && n > 0) {
    emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayable = emi * n;
    totalInterest = totalPayable - p;
  }

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-brand-blue">Loan EMI Calculator</h2>
        <p className="text-gray-600 mt-2 text-lg">Calculate your monthly installments for NSFDC schemes.</p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="p-8 md:w-1/2 bg-white">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <label className="font-semibold text-gray-700">Loan Amount</label>
              <span className="font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-md">{formatCurrency(loanAmount)}</span>
            </div>
            <input type="range" min="10000" max="5000000" step="10000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange" />
          </div>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <label className="font-semibold text-gray-700">Interest Rate (p.a.)</label>
              <span className="font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-md">{interestRate}%</span>
            </div>
            <input type="range" min="4" max="8" step="0.5" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <label className="font-semibold text-gray-700">Loan Tenure</label>
              <span className="font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-md">{tenureYears} Years</span>
            </div>
            <input type="range" min="1" max="10" step="1" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange" />
          </div>
        </div>
        <div className="p-8 md:w-1/2 bg-gradient-to-br from-brand-blue to-blue-800 text-white flex flex-col justify-center">
          <div className="text-center mb-8">
            <p className="text-blue-200 mb-1 font-medium">Your Monthly EMI</p>
            <h3 className="text-5xl font-bold text-white drop-shadow-md">{formatCurrency(emi)}</h3>
          </div>
          <div className="space-y-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
              <span className="text-blue-100">Principal</span><span className="font-semibold text-lg">{formatCurrency(p)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
              <span className="text-blue-100">Total Interest</span><span className="font-semibold text-lg">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-blue-100">Total Payable</span><span className="font-bold text-xl text-brand-orange">{formatCurrency(totalPayable)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MULTI-STEP SCHEME FINDER ---
const FindScheme = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ purpose: '', amount: '100000', income: '200000', gender: 'male', state: 'Assam' });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const handleSubmit = () => navigate('/results');

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-brand-blue">Find Your Perfect Scheme</h2>
        <p className="text-gray-600 mt-2">Answer a few questions to get AI-matched recommendations.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div className="bg-brand-orange h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        <div className="min-h-[250px]">
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">What do you need funding for?</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Start a Business', 'Expand Business', 'Higher Education', 'Artisan / Craft'].map(opt => (
                  <button key={opt} onClick={() => setFormData({...formData, purpose: opt})} 
                    className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${formData.purpose === opt ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">How much funding do you need?</h3>
              <div className="mb-4 text-center text-4xl font-bold text-brand-blue">₹ {Number(formData.amount).toLocaleString('en-IN')}</div>
              <input type="range" min="10000" max="5000000" step="10000" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange mb-8" />
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">What is your annual family income?</h3>
              <div className="mb-4 text-center text-4xl font-bold text-brand-blue">₹ {Number(formData.income).toLocaleString('en-IN')}</div>
              <input type="range" min="50000" max="500000" step="10000" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange mb-8" />
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-6">A few final details</h3>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4 mb-6">
                {['Male', 'Female', 'Other'].map(g => (
                  <button key={g} onClick={() => setFormData({...formData, gender: g.toLowerCase()})} 
                    className={`flex-1 p-3 rounded-lg border-2 font-semibold transition-all ${formData.gender === g.toLowerCase() ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                    {g}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
              <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-4 rounded-lg border-2 border-gray-200 font-semibold text-gray-700">
                <option value="Assam">Assam</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={prevStep} disabled={step === 1} className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}>
            <ChevronLeft size={20} className="mr-1" /> Back
          </button>
          {step < 4 ? (
            <button onClick={nextStep} disabled={step === 1 && !formData.purpose} className="flex items-center px-8 py-3 bg-brand-blue hover:bg-blue-700 text-white rounded-xl font-bold shadow-md disabled:opacity-50">
              Next <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button onClick={handleSubmit} className="flex items-center px-8 py-3 bg-brand-orange hover:bg-orange-600 text-white rounded-xl font-bold shadow-md">
              Find Matches <BrainCircuit size={20} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- RESULTS PAGE ---
const ResultsPage = () => (
  <div className="max-w-4xl mx-auto py-8 text-center animate-in fade-in duration-500">
    <h2 className="text-4xl font-extrabold text-brand-blue mb-4">Your AI Matches</h2>
    <p className="text-xl text-gray-600 mb-8">Based on your needs, here are the best NSFDC schemes.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl border-2 border-brand-orange shadow-lg text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-bl-lg">98% MATCH</div>
        <h3 className="text-2xl font-bold text-brand-blue mb-2">Micro Credit Finance (MCF)</h3>
        <p className="text-gray-600 mb-4">Perfect for small income-generating activities.</p>
        <div className="bg-blue-50 p-4 rounded-xl mb-4 flex justify-between">
          <div><p className="text-xs text-gray-500 font-semibold">Max Loan</p><p className="font-bold text-gray-800">₹1,40,000</p></div>
          <div><p className="text-xs text-gray-500 font-semibold">Interest Rate</p><p className="font-bold text-brand-orange">5% p.a.</p></div>
        </div>
        <button className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">View Details</button>
      </div>
    </div>
  </div>
);

// --- PARTNERS MAP PAGE ---
const PartnersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const dummyPartners = [
    { id: 1, name: "Assam Financial Corporation", type: "SCA", city: "Guwahati", lat: 26.1445, lng: 91.7362, address: "GS Road, Bhangagarh", phone: "0361-2529354" },
    { id: 2, name: "State Bank of India", type: "PSB", city: "Dibrugarh", lat: 27.4728, lng: 94.9120, address: "H.S. Road", phone: "0373-2320220" },
    { id: 3, name: "Punjab National Bank", type: "PSB", city: "Dibrugarh", lat: 27.4733, lng: 94.9070, address: "Thana Charali", phone: "0373-2320145" },
    { id: 4, name: "State Bank of India", type: "PSB", city: "Jorhat", lat: 26.7509, lng: 94.2037, address: "AT Road", phone: "0376-2320126" },
  ];

  const filteredPartners = dummyPartners.filter(p => 
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-4 h-[80vh] flex flex-col animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-brand-blue">Find a Channel Partner</h2>
        <p className="text-gray-600 mt-2 text-lg">Locate SCAs and Banks near you to apply for schemes.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by city (e.g., Dibrugarh)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-grow p-2">
            {filteredPartners.length === 0 ? (
              <p className="text-center text-gray-500 p-4">No partners found.</p>
            ) : (
              filteredPartners.map(partner => (
                <div key={partner.id} className="p-4 mb-2 hover:bg-blue-50 rounded-xl cursor-pointer border border-transparent hover:border-blue-100 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-800">{partner.name}</h4>
                    <span className="bg-orange-100 text-brand-orange text-xs font-bold px-2 py-1 rounded-md">{partner.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center mt-2"><MapPin size={14} className="mr-1 text-brand-blue" /> {partner.address}, {partner.city}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-gray-200 rounded-2xl shadow-md overflow-hidden h-[50vh] md:h-full border border-gray-200 z-0">
          <MapContainer center={[26.2006, 92.9376]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPartners.map(partner => (
              <Marker key={partner.id} position={[partner.lat, partner.lng]}>
                <Popup>
                  <div className="font-sans">
                    <strong className="text-brand-blue text-sm block mb-1">{partner.name}</strong>
                    <span className="text-xs text-gray-600 block">{partner.address}, {partner.city}</span>
                    <span className="text-xs font-bold text-brand-orange block mt-1">Ph: {partner.phone}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

// --- AI CHATBOT ---
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', text: "Namaskar! I am your SchemeSetu assistant. What kind of business or education funding are you looking for today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const chat = model.startChat({
        history: messages.slice(1).map(m => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });

      const result = await chat.sendMessage(userMsg);
      const response = await result.response;
      
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please check if your VITE_GEMINI_API_KEY is correct in the .env file." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-brand-blue text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-brand-blue p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <BrainCircuit size={20} />
              <span className="font-bold">SchemeSetu Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300"><X size={20} /></button>
          </div>
          
          <div className="h-96 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand-blue text-white self-end rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 self-start rounded-tl-none shadow-sm'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-gray-200 text-gray-500 self-start rounded-2xl rounded-tl-none p-3 text-sm shadow-sm">
                Thinking...
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about a scheme..."
              className="flex-grow bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-blue text-sm"
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-brand-orange text-white p-2 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// --- APP SHELL ---
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600 font-extrabold text-3xl tracking-tight hover:opacity-80 transition-opacity">
                <Landmark className="mr-2 text-brand-blue" size={32} />
                SchemeSetu
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-6">
              <Link to="/find" className="text-gray-600 hover:text-brand-blue hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-all">Find Scheme</Link>
              <Link to="/calculator" className="text-gray-600 hover:text-brand-blue hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-all">Calculator</Link>
              <Link to="/partners" className="text-brand-blue bg-blue-50 hover:bg-brand-blue hover:text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-all shadow-sm">
                <MapPin className="mr-1.5" size={18} /> Locate Partner
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<FindScheme />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/partners" element={<PartnersPage />} />
        </Routes>
      </main>

      <footer className="bg-brand-blue text-white py-8 mt-auto border-t-[6px] border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-bold text-xl tracking-wide">SchemeSetu</p>
          <p className="text-blue-200 text-sm mt-2 font-medium">Empowering communities. Built for SIH 2026 by Team MISFITS.</p>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}

export default App;