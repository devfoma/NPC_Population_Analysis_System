"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Registrations() {
  const { 
    store,
    searchQuery,
    setShowBirthModal, 
    setShowDeathModal, 
    setShowExportModal 
  } = useApp();

  const filteredRecords = store.records.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.nin.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Vital Registrations Portal</h2>
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
                <tr className="text-on-surface-variant/60 text-xs font-semibold uppercase tracking-wider border-b border-white/5">
                  <th className="px-6 py-4">NIN / ID</th>
                  <th className="px-6 py-4">Registrant Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
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
                <span className="text-sm">Deaths Recorded</span>
                <span className="text-lg font-bold text-error font-display">{store.dailyDeaths.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
