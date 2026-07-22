import React, { useState, useEffect } from 'react';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import MapWidget from './components/MapWidget';
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Filler 
} from 'chart.js';
import { 
  LayoutDashboard, 
  UserCheck, 
  Map, 
  TrendingUp, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Clock, 
  User, 
  Download, 
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Filler
);

export default function App() {
  const {
    store,
    isOnline,
    syncStatus,
    syncActive,
    addRecord,
    saveSupabaseConfig,
    resetStore
  } = useSupabaseSync();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedState, setSelectedState] = useState('Lagos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showBirthModal, setShowBirthModal] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successConfig, setSuccessConfig] = useState({ title: '', body: '', callback: null });

  // Map Scope state
  const [mapScope, setMapScope] = useState('national');

  // Form states
  const [birthForm, setBirthForm] = useState({ name: '', dob: '', gender: '', state: '', lga: '' });
  const [deathForm, setDeathForm] = useState({ name: '', date: '', state: '', lga: '', cause: '' });
  
  // Projections calculator states
  const [projInputs, setProjInputs] = useState({ baseYear: 2026, targetYear: 2036, growthRate: 2.4, fertility: 5.2 });
  const [projectionResults, setProjectionResults] = useState({ estimated: 295491202, labels: ['2026', '2028', '2030', '2032', '2034', '2036'], dataset: [232.5, 243.8, 255.7, 268.2, 281.3, 295.4] });

  // Dynamic parallax background effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.008;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.008;
      const glowEl = document.getElementById('mesh-glow');
      if (glowEl) {
        glowEl.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync Hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'registrations', 'migration', 'projections', 'settings', 'insight-details'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (tab) => {
    window.location.hash = tab;
    setActiveTab(tab);
  };

  const handleInspectState = (stateName) => {
    setSelectedState(stateName);
    handleNavigate('insight-details');
  };

  // Birth/Death form submissions
  const handleBirthSubmit = (e) => {
    e.preventDefault();
    const record = {
      nin: Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"),
      name: birthForm.name,
      type: "Birth",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      location: `${birthForm.lga}, ${birthForm.state} State`,
      status: isOnline && store.supabaseUrl ? "Verified" : "Pending"
    };

    addRecord(record);
    setShowBirthModal(false);
    setBirthForm({ name: '', dob: '', gender: '', state: '', lga: '' });

    const msg = isOnline && store.supabaseUrl
      ? `Formal record for ${birthForm.name} has been synced with primary cloud nodes.`
      : `Record for ${birthForm.name} saved locally. It will sync automatically when connection returns.`;

    triggerSuccessAlert("Birth Registered Successfully", msg);
  };

  const handleDeathSubmit = (e) => {
    e.preventDefault();
    const record = {
      nin: Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"),
      name: deathForm.name,
      type: "Death",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      location: `${deathForm.lga}, ${deathForm.state} State`,
      status: isOnline && store.supabaseUrl ? "Verified" : "Pending"
    };

    addRecord(record);
    setShowDeathModal(false);
    setDeathForm({ name: '', date: '', state: '', lga: '', cause: '' });

    const msg = isOnline && store.supabaseUrl
      ? `Formal certificate and audit reports compiled and synced for the late ${deathForm.name}.`
      : `Record for the late ${deathForm.name} saved locally. It will sync automatically when connection returns.`;

    triggerSuccessAlert("Death Registered Successfully", msg);
  };

  const triggerSuccessAlert = (title, body, callback = null) => {
    setSuccessConfig({ title, body, callback });
    setShowSuccessModal(true);
  };

  // Projections calculator simulation
  const handleCalculateProjections = () => {
    const base = parseInt(projInputs.baseYear) || 2026;
    const target = parseInt(projInputs.targetYear) || 2036;
    const rate = parseFloat(projInputs.growthRate) / 100 || 0.024;

    if (target <= base) {
      alert("Target Year must be greater than Base Year.");
      return;
    }

    const startPop = store.population;
    const labels = [];
    const dataset = [];
    const step = Math.max(1, Math.round((target - base) / 5));

    for (let yr = base; yr <= target; yr += step) {
      const t = yr - base;
      const val = startPop * Math.exp(rate * t);
      labels.push(yr.toString());
      dataset.push((val / 1000000).toFixed(1));
    }

    const finalVal = startPop * Math.exp(rate * (target - base));
    setProjectionResults({
      estimated: Math.round(finalVal),
      labels,
      dataset
    });
  };

  const handleExport = () => {
    setShowExportModal(false);
    triggerSuccessAlert(
      "Report Exported Successfully",
      "Your Analytical Executive Summary Report (#NPC-2026-X8B) has been compiled and is ready for download.",
      () => {
        setShowSuccessModal(false);
        alert("Downloading PDF document...");
      }
    );
  };

  // Dynamic Chart configurations
  const ageChartData = {
    labels: ['0-14 yrs', '15-64 yrs', '65+ yrs'],
    datasets: [{
      data: [42, 55, 3],
      backgroundColor: ['#00f2fe', '#adc7f7', '#ffdad6'],
      borderWidth: 0
    }]
  };

  const growthChartData = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    datasets: [{
      label: 'Growth Rate (%)',
      data: [2.6, 2.5, 2.5, 2.4, 2.4, 2.4, 2.4],
      borderColor: '#00f2fe',
      backgroundColor: 'rgba(0, 242, 254, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const projectionChartData = {
    labels: projectionResults.labels,
    datasets: [{
      label: 'Projected Population (Millions)',
      data: projectionResults.dataset,
      borderColor: '#00f2fe',
      backgroundColor: 'rgba(0, 242, 254, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };

  // State calculations & list filterings
  const filteredRecords = store.records.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.nin.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stateDetails = {
    Kano: { lga: 44, density: "Extreme (Agrarian Hub)", hubs: "Kano Municipal, Fagge, Gwale" },
    Lagos: { lga: 20, density: "Maximum (Urban Epicenter)", hubs: "Ikeja, Lekki, Alimosho" },
    Abuja: { lga: 6, density: "High (Administrative Capital)", hubs: "Garki, Wuse, Asokoro" }
  };
  const activeDetail = stateDetails[selectedState] || { lga: "Unknown", density: "Varies", hubs: "Local zones" };

  return (
    <div className="flex min-h-screen relative z-10">
      <div className="mesh-gradient-glow" id="mesh-glow"></div>

      {/* Floating Left Sidebar */}
      <aside className="fixed left-4 top-4 bottom-4 w-64 rounded-xl bg-white/10 backdrop-blur-xl border-r border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col py-6 z-50">
        <div className="px-6 mb-10 flex flex-col">
          <span className="font-display text-2xl font-extrabold text-primary-container tracking-tighter">NPC Portal</span>
          <span className="font-body text-xs text-on-surface-variant/70 -mt-1">National Data Command</span>
        </div>

        <nav className="flex-1 space-y-2 px-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'registrations', label: 'Registrations', icon: UserCheck },
            { id: 'migration', label: 'Migration', icon: Map },
            { id: 'projections', label: 'Projections', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-r-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-primary-container bg-white/15 border-l-4 border-primary-container shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                    : 'text-on-surface-variant/70 hover:bg-white/10 hover:text-on-surface'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="px-4 mt-auto">
          <button 
            onClick={() => setShowBirthModal(true)}
            className="w-full py-3 px-4 bg-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)] active:scale-95"
          >
            <Plus size={16} />
            <span className="text-sm">New Registration</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 ml-72 mr-6 min-h-screen flex flex-col">
        
        {/* Top Header */}
        <header className="flex justify-between items-center w-full px-8 h-20 bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <h1 className="font-display text-xl font-bold text-primary-container">
              {activeTab === 'dashboard' && 'NPC Population Analysis Dashboard'}
              {activeTab === 'registrations' && 'NPC Vital Registrations Portal'}
              {activeTab === 'migration' && 'Migration & Geographic Hub'}
              {activeTab === 'projections' && 'Demographic Projections Engine'}
              {activeTab === 'settings' && 'System Settings'}
              {activeTab === 'insight-details' && 'Analysis Insight Detail View'}
            </h1>
            <div className="relative w-80 group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container outline-none transition-all text-sm text-white" 
                placeholder="Search census database..."
              />
            </div>
            {/* Sync indicator pill */}
            <div className={`flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-semibold select-none transition-all ${
              syncActive && isOnline
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${syncActive && isOnline ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-ping'}`}></span>
              <span>{syncStatus}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <Bell size={18} className="cursor-pointer hover:text-primary-container transition-all" onClick={() => alert("Notification center: Regional Node databases synchronized successfully.")} />
              <Clock size={18} className="cursor-pointer hover:text-primary-container transition-all" onClick={() => handleNavigate('settings')} />
              <User size={18} className="cursor-pointer hover:text-primary-container transition-all" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-container/30 overflow-hidden cursor-pointer" onClick={() => handleInspectState('Lagos')}>
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj80aUYfRKHfbwdI2ZaC0Aet3Y7SXSxPkTxAdAzkdA3Fwh8FGxWq1f-ZXMGHUrFrmZrr3eaGAkkWQyz_oZaiGfksjyJs-zloPADBrGlLUIsl9Gs5Ed89Z2BuEGVaZhoH0jMA19LzxIwWEIsAd553rNa9r7kHvA4rM0zIjKsyAv9L8ZXT7BOzrUlnkuaoB23xzmM9WNbFokUJhu7qCz0eVwSEbjDFOJib-1DWLH2IU3bLgVB8TrNTUPz0Hi1_l5CFHiJdcjvCBWEGnv" alt="User Avatar" />
            </div>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 py-8 overflow-y-auto z-10">

          {/* A. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Population", val: store.population.toLocaleString(), change: "+1.2% this year", icon: LayoutDashboard },
                  { label: "Natural Growth", val: `${store.growthRate}%`, change: "Stabilizing trend", icon: TrendingUp },
                  { label: "Birth Rate", val: `${store.birthRate}/1k`, change: "Live sync feed", icon: Plus },
                  { label: "Death Rate", val: `${store.deathRate}/1k`, change: "Historical low", icon: AlertCircle },
                ].map((kpi, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-6 relative overflow-hidden group hover:glass-card-raised transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-widest">{kpi.label}</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-display">{kpi.val}</div>
                    <p className="mt-2 text-xs text-primary-container">{kpi.change}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container/40 to-transparent"></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-6 h-[550px] flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Geographic Data Hub</h2>
                      <p class="text-on-surface-variant text-xs">Live interactive map of Nigerian regional density hubs</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setMapScope('national')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mapScope === 'national' ? 'bg-primary-container text-on-primary shadow-lg' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'}`}>National</button>
                      <button onClick={() => setMapScope('regional')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mapScope === 'regional' ? 'bg-primary-container text-on-primary shadow-lg' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'}`}>Regional View</button>
                    </div>
                  </div>
                  {/* Live Map Widget */}
                  <div className="flex-1 relative rounded-xl border border-white/10 overflow-hidden">
                    <MapWidget onSelectState={handleInspectState} />
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-bold text-white text-md mb-4 font-display">Age Distribution</h3>
                    <div className="h-40">
                      <Doughnut data={ageChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#e2e2e2' } } } }} />
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-bold text-white text-md mb-4 font-display">10-Year Growth Timeline</h3>
                    <div className="h-32">
                      <Line data={growthChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#b9cacb' } }, y: { ticks: { color: '#b9cacb' } } }, plugins: { legend: { display: false } } }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. REGISTRATIONS VIEW */}
          {activeTab === 'registrations' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Vital Registrations Portal</h2>
                  <p className="text-on-surface-variant text-sm">Live registry events and records database.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowBirthModal(true)} className="flex items-center gap-2 bg-primary-container/10 border border-primary-container/30 text-primary-container px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-container/20 transition-all">New Birth</button>
                  <button onClick={() => setShowDeathModal(true)} className="flex items-center gap-2 bg-error-container/20 border border-error-container/40 text-error px-4 py-2 rounded-lg text-sm font-semibold hover:bg-error-container/30 transition-all">New Death</button>
                  <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all">Export Report</button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 lg:col-span-8 glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h4 className="font-bold text-primary-container uppercase tracking-wider text-xs">Recent Records</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr class="text-on-surface-variant/60 text-xs font-semibold uppercase tracking-wider border-b border-white/5">
                          <th class="px-6 py-4">NIN / ID</th>
                          <th class="px-6 py-4">Registrant Name</th>
                          <th class="px-6 py-4">Type</th>
                          <th class="px-6 py-4">Date</th>
                          <th class="px-6 py-4">Location</th>
                          <th class="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredRecords.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant/60 text-xs">No records found.</td>
                          </tr>
                        ) : (
                          filteredRecords.map((rec, idx) => (
                            <tr key={idx} className="glass-table-row">
                              <td className="px-6 py-5 font-mono text-sm text-primary-container">#{rec.nin}</td>
                              <td className="px-6 py-5 text-sm font-medium">{rec.name}</td>
                              <td className="px-6 py-5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${rec.type === 'Birth' ? 'bg-primary-container/10 text-primary-container border border-primary-container/20' : 'bg-error-container/20 text-error border border-error-container/20'}`}>
                                  {rec.type}
                                </span>
                              </td>
                              <td className="px-6 py-5 text-sm opacity-80">{rec.date}</td>
                              <td className="px-6 py-5 text-sm opacity-80">{rec.location}</td>
                              <td className="px-6 py-5 text-xs">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${rec.status === 'Verified' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-yellow-400 animate-pulse'}`}></div>
                                  <span>{rec.status}</span>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h5 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-2">Registry Completion</h5>
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-4xl font-extrabold text-primary-container neon-text font-display">94.2%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full w-[94.2%]" style={{ boxShadow: '0 0 10px rgba(0,242,254,0.6)' }}></div>
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-6 border-l-4 border-primary-container">
                    <h5 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-4">Daily Volume</h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">New Births</span>
                        <span className="text-lg font-bold text-primary-container font-display">{store.dailyBirths.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span class="text-sm">Deaths Recorded</span>
                        <span class="text-lg font-bold text-error font-display">{store.dailyDeaths.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* C. MIGRATION VIEW */}
          {activeTab === 'migration' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-bold text-white font-display">Migration &amp; Geographic Hub</h2>
                <p className="text-on-surface-variant text-sm">Real-time internal migration matrices and global immigration tracking.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border-l-4 border-primary-container">
                  <p className="text-on-surface-variant text-xs uppercase font-semibold">Global Net Migration</p>
                  <h3 className="text-3xl font-extrabold text-primary-container font-display mt-2">+14.2%</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <p class="text-on-surface-variant text-xs uppercase font-semibold">Total Inbound Flows</p>
                  <h3 class="text-3xl font-extrabold text-white font-display mt-2">8.2M</h3>
                </div>
                <div class="glass-card p-6 rounded-2xl">
                  <p class="text-on-surface-variant text-xs uppercase font-semibold">Outbound Deficit</p>
                  <h3 class="text-3xl font-extrabold text-white font-display mt-2">3.1M</h3>
                </div>
              </div>
            </div>
          )}

          {/* D. PROJECTIONS VIEW */}
          {activeTab === 'projections' && (
            <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-300">
              <div className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-white text-md font-display">Calculator Configurations</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Base Year</label>
                    <input 
                      type="number" 
                      value={projInputs.baseYear}
                      onChange={(e) => setProjInputs({...projInputs, baseYear: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-container"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Target Year</label>
                    <input 
                      type="number" 
                      value={projInputs.targetYear}
                      onChange={(e) => setProjInputs({...projInputs, targetYear: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-container"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Assumed Growth Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={projInputs.growthRate}
                      onChange={(e) => setProjInputs({...projInputs, growthRate: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-container"
                    />
                  </div>
                  <button onClick={handleCalculateProjections} className="w-full py-3 bg-primary-container text-on-primary font-bold rounded-lg shadow-lg hover:scale-[1.02] transition-all active:scale-95">Run Math Simulation</button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-6 flex flex-col justify-between h-[450px]">
                <h3 className="font-bold text-white text-md font-display mb-4 font-headline-md">Population Projection Path</h3>
                <div className="flex-1 min-h-0">
                  <Line data={projectionChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: '#b9cacb' } }, y: { ticks: { color: '#b9cacb' } } } }} />
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                  <span>Estimated Target Population:</span>
                  <span className="font-bold text-primary-container text-lg">{projectionResults.estimated.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* E. SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl glass-card rounded-2xl p-8 space-y-6 animate-in fade-in duration-300">
              <h3 className="font-bold text-white text-md border-b border-white/10 pb-2">Supabase Cloud Database Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Supabase Project URL</label>
                  <input 
                    type="text" 
                    value={store.supabaseUrl}
                    onChange={(e) => saveSupabaseConfig(e.target.value, store.supabaseKey)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-container" 
                    placeholder="https://your-project.supabase.co"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Supabase Anon Key</label>
                  <input 
                    type="password" 
                    value={store.supabaseKey}
                    onChange={(e) => saveSupabaseConfig(store.supabaseUrl, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-container" 
                    placeholder="Anon key"
                  />
                </div>
              </div>

              <h3 className="font-bold text-white text-md border-b border-white/10 pb-2 pt-4">Data Integrity & Backups</h3>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-white">Clear Cached Records</h4>
                  <p className="text-xs text-on-surface-variant/60">Reset local storage client-side database.</p>
                </div>
                <button onClick={resetStore} className="px-4 py-2 bg-error-container/20 border border-error-container/40 text-error rounded-lg text-xs font-bold hover:bg-error-container/40 transition-all">Reset System</button>
              </div>
            </div>
          )}

          {/* F. INSIGHT DETAILS VIEW */}
          {activeTab === 'insight-details' && (
            <div className="glass-card rounded-2xl p-8 space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-white">Analysis Insight Detail View</h2>
              <h3 className="text-lg font-bold text-primary-container font-headline-md">Audit Trail State: {selectedState} State</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-4 rounded-xl">
                  <span className="text-xs text-on-surface-variant">LGA Count</span>
                  <p className="text-xl font-bold text-white">{activeDetail.lga} LGAs</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <span className="text-xs text-on-surface-variant">Density Level</span>
                  <p className="text-xl font-bold text-primary-container">{activeDetail.density}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <span className="text-xs text-on-surface-variant">Primary Sector Hubs</span>
                  <p className="text-xl font-bold text-white">{activeDetail.hubs}</p>
                </div>
              </div>
              <button onClick={() => handleNavigate('dashboard')} className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white transition-all">Back to Dashboard</button>
            </div>
          )}

        </main>
      </div>

      {/* OVERLAY MODALS */}

      {/* 1. BIRTH REGISTRATION MODAL */}
      {showBirthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-primary-container font-display">New Birth Registration</h3>
                <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-1">NPC Formal Record</p>
              </div>
              <button onClick={() => setShowBirthModal(false)} className="p-2 rounded-full hover:bg-white/10 text-on-surface-variant transition-colors">✕</button>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleBirthSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Child's Full Name</label>
                  <input required value={birthForm.name} onChange={(e) => setBirthForm({...birthForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all" placeholder="Enter full legal name" type="text"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Date of Birth</label>
                  <input required type="date" value={birthForm.dob} onChange={(e) => setBirthForm({...birthForm, dob: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Gender</label>
                  <select required value={birthForm.gender} onChange={(e) => setBirthForm({...birthForm, gender: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all">
                    <option className="bg-surface-container" value="">Select Gender</option>
                    <option className="bg-surface-container">Male</option>
                    <option className="bg-surface-container">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">State of Birth</label>
                  <select required value={birthForm.state} onChange={(e) => setBirthForm({...birthForm, state: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all">
                    <option className="bg-surface-container" value="">Select State</option>
                    <option className="bg-surface-container">Lagos</option>
                    <option className="bg-surface-container">Kano</option>
                    <option className="bg-surface-container">Abuja FCT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">LGA</label>
                  <input required value={birthForm.lga} onChange={(e) => setBirthForm({...birthForm, lga: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all" placeholder="Enter LGA" />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setShowBirthModal(false)} className="px-6 py-3 rounded-lg font-semibold text-on-surface-variant hover:bg-white/10 transition-all" type="button">Cancel</button>
                <button className="px-8 py-3 bg-primary-container text-on-primary rounded-lg font-bold shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:brightness-110 transition-all active:scale-95" type="submit">Submit Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. DEATH REGISTRATION MODAL */}
      {showDeathModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-primary-container font-display">New Death Registration</h3>
                <p class="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-1">NPC Formal Record</p>
              </div>
              <button onClick={() => setShowDeathModal(false)} className="p-2 rounded-full hover:bg-white/10 text-on-surface-variant transition-colors">✕</button>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleDeathSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Citizen Name</label>
                  <input required value={deathForm.name} onChange={(e) => setDeathForm({...deathForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all" placeholder="Enter full legal name" type="text"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Date of Occurrence</label>
                  <input required type="date" value={deathForm.date} onChange={(e) => setDeathForm({...deathForm, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">State of Occurrence</label>
                  <select required value={deathForm.state} onChange={(e) => setDeathForm({...deathForm, state: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all">
                    <option className="bg-surface-container" value="">Select State</option>
                    <option className="bg-surface-container">Lagos</option>
                    <option className="bg-surface-container">Kano</option>
                    <option className="bg-surface-container">Abuja FCT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">LGA</label>
                  <input required value={deathForm.lga} onChange={(e) => setDeathForm({...deathForm, lga: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all" placeholder="Enter LGA" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Cause of Death</label>
                  <select required value={deathForm.cause} onChange={(e) => setDeathForm({...deathForm, cause: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all">
                    <option className="bg-surface-container" value="">Select Cause</option>
                    <option className="bg-surface-container">Natural Causes</option>
                    <option className="bg-surface-container">Accident</option>
                    <option className="bg-surface-container">Illness</option>
                    <option className="bg-surface-container">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setShowDeathModal(false)} className="px-6 py-3 rounded-lg font-semibold text-on-surface-variant hover:bg-white/10 transition-all" type="button">Cancel</button>
                <button className="px-8 py-3 bg-primary-container text-on-primary rounded-lg font-bold shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:brightness-110 transition-all active:scale-95" type="submit">Submit Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExportModal(false)}></div>
          <div className="relative w-full max-w-lg glass-card rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-primary-container">Export Analytical Report</h2>
                <p className="text-on-surface-variant text-xs mt-1">Generate a high-fidelity PDF document for executive review.</p>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-on-surface-variant hover:text-white">✕</button>
            </div>
            <div className="space-y-4 mb-8">
              <label className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer">
                <input defaultChecked className="w-4 h-4 text-primary-container focus:ring-primary-container bg-transparent border-white/20" name="export-type" type="radio"/>
                <div>
                  <p className="font-bold text-sm">Complete Executive Summary</p>
                  <p className="text-xs text-on-surface-variant">Full summary, charts, and regional analysis.</p>
                </div>
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleExport} className="w-full bg-primary-container text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                <Download size={16} />
                Print PDF Report
              </button>
              <button onClick={() => setShowExportModal(false)} className="w-full py-3 text-on-surface-variant hover:text-white transition-colors text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUCCESS ALERT MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative w-full max-w-lg glass-panel rounded-3xl p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-container/20 border border-primary-container/40 mb-6">
              <CheckCircle className="text-primary-container" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">{successConfig.title}</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed px-4 mb-8">{successConfig.body}</p>
            <div className="space-y-4">
              {successConfig.callback && (
                <button 
                  onClick={successConfig.callback}
                  className="w-full py-4 bg-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Download size={16} /> Download Document
                </button>
              )}
              <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all active:scale-95">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
