"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Settings() {
  const { 
    store,
    saveSupabaseConfig, 
    resetStore 
  } = useApp();

  return (
    <div className="max-w-3xl glass-card rounded-2xl p-8 space-y-6 animate-in fade-in duration-300">


      <h3 className="font-bold text-white text-md border-b border-white/10 pb-2 pt-4">Data Integrity & Backups</h3>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold text-white">Clear Cached Records</h4>
          <p className="text-xs text-on-surface-variant/60">Reset local storage client-side database.</p>
        </div>
        <button onClick={resetStore} className="px-4 py-2 bg-error-container/20 border border-error-container/40 text-error rounded-lg text-xs font-bold hover:bg-error-container/40 transition-all">Reset System</button>
      </div>
    </div>
  );
}
