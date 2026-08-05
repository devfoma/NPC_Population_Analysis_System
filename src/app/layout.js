"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppProvider, useApp } from '../context/AppContext';
import Link from 'next/link';
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
  CheckCircle 
} from 'lucide-react';
import "./globals.css";

function AppShell({ children }) {
  const {
    store,
    isOnline,
    syncStatus,
    syncActive,
    showBirthModal, setShowBirthModal,
    showDeathModal, setShowDeathModal,
    showExportModal, setShowExportModal,
    showSuccessModal, setShowSuccessModal,
    successConfig,
    birthForm, setBirthForm,
    deathForm, setDeathForm,
    handleBirthSubmit,
    handleDeathSubmit,
    searchQuery, setSearchQuery
  } = useApp();

  const pathname = usePathname();
  const router = useRouter();

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

  const getPageTitle = () => {
    if (pathname === '/') return 'NPC Population Analysis Dashboard';
    if (pathname === '/registrations') return 'NPC Vital Registrations Portal';
    if (pathname === '/migration') return 'Migration & Geographic Hub';
    if (pathname === '/projections') return 'Demographic Projections Engine';
    if (pathname === '/settings') return 'System Settings';
    if (pathname.startsWith('/insight-details')) return 'Analysis Insight Detail View';
    return 'NPC Portal';
  };

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
            { path: '/', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/registrations', label: 'Registrations', icon: UserCheck },
            { path: '/migration', label: 'Migration', icon: Map },
            { path: '/projections', label: 'Projections', icon: TrendingUp },
            { path: '/settings', label: 'Settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-r-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-primary-container bg-white/15 border-l-4 border-primary-container shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                    : 'text-on-surface-variant/70 hover:bg-white/10 hover:text-on-surface'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
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
              {getPageTitle()}
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
              <Clock size={18} className="cursor-pointer hover:text-primary-container transition-all" onClick={() => router.push('/settings')} />
              <User size={18} className="cursor-pointer hover:text-primary-container transition-all" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-container/30 overflow-hidden cursor-pointer" onClick={() => router.push('/insight-details/Lagos')}>
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj80aUYfRKHfbwdI2ZaC0Aet3Y7SXSxPkTxAdAzkdA3Fwh8FGxWq1f-ZXMGHUrFrmZrr3eaGAkkWQyz_oZaiGfksjyJs-zloPADBrGlLUIsl9Gs5Ed89Z2BuEGVaZhoH0jMA19LzxIwWEIsAd553rNa9r7kHvA4rM0zIjKsyAv9L8ZXT7BOzrUlnkuaoB23xzmM9WNbFokUJhu7qCz0eVwSEbjDFOJib-1DWLH2IU3bLgVB8TrNTUPz0Hi1_l5CFHiJdcjvCBWEGnv" alt="User Avatar" />
            </div>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 py-8 overflow-y-auto z-10">
          {children}
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
                <h3 className="text-lg font-bold text-primary-container font-display">New Death Registration</h3>
                <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-1">NPC Formal Record</p>
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
              <button 
                onClick={() => {
                  setShowExportModal(false);
                  triggerSuccessAlert(
                    "Report Exported Successfully",
                    "Your Analytical Executive Summary Report (#NPC-2026-X8B) has been compiled and is ready for download.",
                    () => {
                      setShowSuccessModal(false);
                      alert("Downloading PDF document...");
                    }
                  );
                }} 
                className="w-full bg-primary-container text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
              >
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
