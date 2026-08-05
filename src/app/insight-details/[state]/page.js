"use client";

import React, { use } from 'react';
import { useRouter } from 'next/navigation';

export default function InsightDetail({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const selectedState = resolvedParams.state;

  const stateDetails = {
    Kano: { lga: 44, density: "Extreme (Agrarian Hub)", hubs: "Kano Municipal, Fagge, Gwale" },
    Lagos: { lga: 20, density: "Maximum (Urban Epicenter)", hubs: "Ikeja, Lekki, Alimosho" },
    Abuja: { lga: 6, density: "High (Administrative Capital)", hubs: "Garki, Wuse, Asokoro" }
  };
  
  const activeDetail = stateDetails[selectedState] || { lga: "Unknown", density: "Varies", hubs: "Local zones" };

  return (
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
      <button onClick={() => router.push('/')} className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white transition-all">Back to Dashboard</button>
    </div>
  );
}
