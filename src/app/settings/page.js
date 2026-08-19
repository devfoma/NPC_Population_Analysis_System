"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Settings() {
  const { 
    user,
    updateProfile,
    resetStore 
  } = useApp();

  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMsg('');
    setErrorMsg('');
    try {
      await updateProfile({ display_name: displayName });
      setMsg("Profile name updated successfully.");
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile name.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024) {
      alert("Image size must be smaller than 150KB to support profile metadata synchronization.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result;
      setUpdating(true);
      setMsg('');
      setErrorMsg('');
      try {
        await updateProfile({ avatar_url: base64String });
        setMsg("Profile picture updated successfully.");
      } catch (err) {
        setErrorMsg(err.message || "Failed to save profile picture.");
      } finally {
        setUpdating(false);
      }
    };
    reader.onerror = () => {
      alert("Error reading file.");
    };
    reader.readAsDataURL(file);
  };

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCj80aUYfRKHfbwdI2ZaC0Aet3Y7SXSxPkTxAdAzkdA3Fwh8FGxWq1f-ZXMGHUrFrmZrr3eaGAkkWQyz_oZaiGfksjyJs-zloPADBrGlLUIsl9Gs5Ed89Z2BuEGVaZhoH0jMA19LzxIwWEIsAd553rNa9r7kHvA4rM0zIjKsyAv9L8ZXT7BOzrUlnkuaoB23xzmM9WNbFokUJhu7qCz0eVwSEbjDFOJib-1DWLH2IU3bLgVB8TrNTUPz0Hi1_l5CFHiJdcjvCBWEGnv";

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      
      {/* Dynamic Profile details and upload card */}
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <h3 className="font-bold text-white text-md border-b border-white/10 pb-2 font-display">Operator Profile Details</h3>
        
        {msg && (
          <div className="p-3 bg-primary-container/20 border border-primary-container/30 text-primary-container text-xs rounded-lg text-center">
            {msg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-error-container/20 border border-error-container/30 text-error text-xs rounded-lg text-center">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center gap-8 pb-6 border-b border-white/5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-primary-container/30 overflow-hidden bg-white/5">
              <img 
                className="w-full h-full object-cover" 
                src={user?.user_metadata?.avatar_url || defaultAvatar} 
                alt="Profile Avatar" 
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-primary-container text-on-primary text-[10px] px-2 py-1 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all font-bold shadow-lg">
              Upload
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
                className="hidden" 
              />
            </label>
          </div>
          
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold text-white font-display">{user?.user_metadata?.display_name || "Operator Node"}</h4>
            <p className="text-xs text-on-surface-variant font-mono">{user?.email}</p>
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider font-semibold">Registered: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active Node'}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Display Name</label>
            <input 
              required
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-container text-sm" 
              placeholder="Enter name"
            />
          </div>
          <button 
            type="submit" 
            disabled={updating}
            className="px-6 py-2.5 bg-primary-container text-on-primary font-bold rounded-lg shadow-lg hover:scale-[1.01] active:scale-95 transition-all text-xs"
          >
            {updating ? "Saving Changes..." : "Save Profile Info"}
          </button>
        </form>
      </div>

      <div className="glass-card rounded-2xl p-8 space-y-6">
        <h3 className="font-bold text-white text-md border-b border-white/10 pb-2 pt-2">Data Integrity & Backups</h3>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-semibold text-white">Clear Cached Records</h4>
            <p className="text-xs text-on-surface-variant/60">Reset local storage client-side database.</p>
          </div>
          <button onClick={resetStore} className="px-4 py-2 bg-error-container/20 border border-error-container/40 text-error rounded-lg text-xs font-bold hover:bg-error-container/40 transition-all">Reset System</button>
        </div>
      </div>
    </div>
  );
}
