"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

export default function Projections() {
  const { store } = useApp();

  const [projInputs, setProjInputs] = useState({ baseYear: 2026, targetYear: 2036, growthRate: 2.4 });
  const [projectionResults, setProjectionResults] = useState({ 
    estimated: 295491202, 
    labels: ['2026', '2028', '2030', '2032', '2034', '2036'], 
    dataset: [232.5, 243.8, 255.7, 268.2, 281.3, 295.4] 
  });

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

  return (
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
          <span className="font-bold text-primary-container text-lg font-display">{projectionResults.estimated.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
