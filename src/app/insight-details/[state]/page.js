"use client";

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';

export default function InsightDetail({ params }) {
  const router = useRouter();
  const { store } = useApp();
  const resolvedParams = use(params);
  const selectedState = resolvedParams.state;

  const stateDetails = {
    Kano: { lga: 44, density: "Extreme (Agrarian Hub)", hubs: "Kano Municipal, Fagge, Gwale" },
    Lagos: { lga: 20, density: "Maximum (Urban Epicenter)", hubs: "Ikeja, Lekki, Surulere" },
    Abuja: { lga: 6, density: "High (Administrative Capital)", hubs: "Garki, Wuse, Asokoro" },
    "Abuja FCT": { lga: 6, density: "High (Administrative Capital)", hubs: "Garki, Wuse, Asokoro" }
  };
  
  const activeDetail = stateDetails[selectedState] || { lga: "Varies", density: "Regional Node", hubs: "Local hubs" };

  // Dynamic aggregation of census records by LGA for this state
  const lgaData = {};
  store.records.forEach(rec => {
    // Check if record belongs to this state, e.g. location matches "LGA, Lagos State" or "Lagos State" or "Lagos"
    const locationLower = rec.location.toLowerCase();
    const stateLower = selectedState.toLowerCase();

    if (locationLower.includes(stateLower)) {
      // Extract LGA name, e.g. "Ikeja, Lagos State" -> "Ikeja"
      const parts = rec.location.split(',');
      const lgaName = parts[0] ? parts[0].trim() : "Unknown";

      if (!lgaData[lgaName]) {
        lgaData[lgaName] = { births: 0, deaths: 0, total: 0 };
      }
      if (rec.type === 'Birth') {
        lgaData[lgaName].births += 1;
        lgaData[lgaName].total += 1;
      } else {
        lgaData[lgaName].deaths += 1;
        lgaData[lgaName].total += 1;
      }
    }
  });

  const lgaList = Object.keys(lgaData).map(name => ({
    name,
    ...lgaData[name]
  }));

  return (
    <div className="glass-card rounded-2xl p-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Analysis Insight Detail View</h2>
          <h3 className="text-lg font-bold text-primary-container mt-1">Audit Trail State: {selectedState} State</h3>
        </div>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white transition-all">Back to Dashboard</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-xl">
          <span className="text-xs text-on-surface-variant font-semibold">LGA Node Count</span>
          <p className="text-2xl font-extrabold text-white mt-1 font-display">{activeDetail.lga} LGAs</p>
        </div>
        <div className="glass-card p-5 rounded-xl border-l-4 border-primary-container">
          <span className="text-xs text-on-surface-variant font-semibold">Density Classification</span>
          <p className="text-2xl font-extrabold text-primary-container mt-1 font-display">{activeDetail.density}</p>
        </div>
        <div className="glass-card p-5 rounded-xl">
          <span className="text-xs text-on-surface-variant font-semibold">Primary Sector Hubs</span>
          <p className="text-md font-bold text-white mt-2 leading-relaxed">{activeDetail.hubs}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h4 className="font-bold text-primary-container uppercase tracking-wider text-xs font-display">LGA-Level Census Audit Breakdowns</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-on-surface-variant/60 text-xs font-semibold uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4">LGA Name</th>
                <th className="px-6 py-4">Births Recorded</th>
                <th className="px-6 py-4">Deaths Recorded</th>
                <th className="px-6 py-4">Total events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {lgaList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant/60 text-xs">No active registrations compiled for this regional state node.</td>
                </tr>
              ) : (
                lgaList.map((lga, idx) => (
                  <tr key={idx} className="glass-table-row">
                    <td className="px-6 py-4 text-sm font-semibold text-white">{lga.name}</td>
                    <td className="px-6 py-4 text-sm text-primary-container font-mono">{lga.births}</td>
                    <td className="px-6 py-4 text-sm text-error font-mono">{lga.deaths}</td>
                    <td className="px-6 py-4 text-sm font-bold font-mono">{lga.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
