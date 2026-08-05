"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Plus, 
  LayoutDashboard, 
  AlertCircle 
} from 'lucide-react';
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

// Load Map dynamically to prevent window-not-defined Node SSR error
const MapWidget = dynamic(() => import('../components/MapWidget'), { ssr: false });

export default function Dashboard() {
  const { store, mapScope, setMapScope } = useApp();
  const router = useRouter();

  const handleInspectState = (stateName) => {
    router.push(`/insight-details/${stateName}`);
  };

  // Chart configuration sets
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Population", val: store.population.toLocaleString(), change: "+1.2% this year", color: "from-transparent via-primary-container/40 to-transparent" },
          { label: "Natural Growth", val: `${store.growthRate}%`, change: "Stabilizing trend", color: "from-transparent via-secondary-container/40 to-transparent" },
          { label: "Birth Rate", val: `${store.birthRate}/1k`, change: "Live sync feed", color: "from-transparent via-primary-container/40 to-transparent" },
          { label: "Death Rate", val: `${store.deathRate}/1k`, change: "Historical low", color: "from-transparent via-error-container/40 to-transparent" },
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card rounded-xl p-6 relative overflow-hidden group hover:glass-card-raised transition-all duration-500">
            <div className="flex justify-between items-start mb-4">
              <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-widest">{kpi.label}</span>
            </div>
            <div className="text-3xl font-bold text-white font-display">{kpi.val}</div>
            <p className="mt-2 text-xs text-primary-container">{kpi.change}</p>
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${kpi.color}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Main Map block */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-6 h-[550px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Geographic Data Hub</h2>
              <p className="text-on-surface-variant text-xs">Live interactive map of Nigerian regional density hubs</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setMapScope('national')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mapScope === 'national' ? 'bg-primary-container text-on-primary shadow-lg' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'}`}>National</button>
              <button onClick={() => setMapScope('regional')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mapScope === 'regional' ? 'bg-primary-container text-on-primary shadow-lg' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'}`}>Regional View</button>
            </div>
          </div>
          <div className="flex-1 relative rounded-xl border border-white/10 overflow-hidden">
            <MapWidget onSelectState={handleInspectState} />
          </div>
        </div>

        {/* Charts panel */}
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
  );
}
