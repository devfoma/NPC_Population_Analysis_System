"use client";

import React from 'react';

export default function Migration() {
  return (
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
          <p className="text-on-surface-variant text-xs uppercase font-semibold">Total Inbound Flows</p>
          <h3 className="text-3xl font-extrabold text-white font-display mt-2">8.2M</h3>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-on-surface-variant text-xs uppercase font-semibold">Outbound Deficit</p>
          <h3 className="text-3xl font-extrabold text-white font-display mt-2">3.1M</h3>
        </div>
      </div>
    </div>
  );
}
