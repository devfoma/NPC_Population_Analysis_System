"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const { signIn } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setErrorMsg(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-10">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-primary-container font-display tracking-tight uppercase">NPC Command Login</h2>
        <p className="text-xs text-on-surface-variant/80 mt-1">Authenticate to access National Demographics portal.</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-error-container/20 border border-error-container/30 text-error text-xs rounded-lg text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          {loading ? "Authenticating..." : "Establish Connection"}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-on-surface-variant">
          New operator node?{" "}
          <Link href="/signup" className="text-primary-container font-semibold hover:underline">
            Register Node
          </Link>
        </p>
      </div>
    </div>
  );
}
