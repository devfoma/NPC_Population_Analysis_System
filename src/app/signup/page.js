"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const { signUp } = useApp();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await signUp(email, password, name);
      setSuccessMsg("Verification link dispatched. Verify your email to complete registration.");
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-10">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-white/10 border border-white/10 flex items-center justify-center p-4 mx-auto shadow-[0_0_25px_rgba(0,242,254,0.4)]">
          <img src="/logo.png" alt="NPC Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <h2 className="text-2xl font-extrabold text-primary-container font-display tracking-tight uppercase">Register Operator</h2>
        <p className="text-xs text-on-surface-variant/80 mt-1">Register a new identity node to sync demographic records.</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-error-container/20 border border-error-container/30 text-error text-xs rounded-lg text-center">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-primary-container/20 border border-primary-container/30 text-primary-container text-xs rounded-lg text-center">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Operator Display Name</label>
          <input 
            required 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all text-sm" 
            placeholder="Chinedu Okafor"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email Address</label>
          <input 
            required 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all text-sm" 
            placeholder="operator@npc.gov.ng"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Password</label>
          <input 
            required 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all text-sm" 
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-primary-container text-on-primary font-bold rounded-lg shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:scale-[1.01] transition-all active:scale-95 text-sm uppercase tracking-wider"
        >
          {loading ? "Registering..." : "Provision Node"}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-on-surface-variant">
          Already registered?{" "}
          <Link href="/login" className="text-primary-container font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
