"use client";

import React, { createContext, useContext, useState } from 'react';
import { useSupabaseSync } from '../hooks/useSupabaseSync';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const syncState = useSupabaseSync();

  // Modal display states
  const [showBirthModal, setShowBirthModal] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successConfig, setSuccessConfig] = useState({ title: '', body: '', callback: null });

  // Map Scope and general states
  const [mapScope, setMapScope] = useState('national');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [birthForm, setBirthForm] = useState({ name: '', dob: '', gender: '', state: '', lga: '' });
  const [deathForm, setDeathForm] = useState({ name: '', date: '', state: '', lga: '', cause: '' });

  const triggerSuccessAlert = (title, body, callback = null) => {
    setSuccessConfig({ title, body, callback });
    setShowSuccessModal(true);
  };

  const handleBirthSubmit = (e) => {
    e.preventDefault();
    const record = {
      nin: Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"),
      name: birthForm.name,
      type: "Birth",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      location: `${birthForm.lga}, ${birthForm.state} State`,
      status: syncState.isOnline && syncState.store.supabaseUrl ? "Verified" : "Pending"
    };

    syncState.addRecord(record);
    setShowBirthModal(false);
    setBirthForm({ name: '', dob: '', gender: '', state: '', lga: '' });

    const msg = syncState.isOnline && syncState.store.supabaseUrl
      ? `Formal record for ${birthForm.name} has been synced with primary cloud nodes.`
      : `Record for ${birthForm.name} saved locally. It will sync automatically when connection returns.`;

    triggerSuccessAlert("Birth Registered Successfully", msg);
  };

  const handleDeathSubmit = (e) => {
    e.preventDefault();
    const record = {
      nin: Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"),
      name: deathForm.name,
      type: "Death",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      location: `${deathForm.lga}, ${deathForm.state} State`,
      status: syncState.isOnline && syncState.store.supabaseUrl ? "Verified" : "Pending"
    };

    syncState.addRecord(record);
    setShowDeathModal(false);
    setDeathForm({ name: '', date: '', state: '', lga: '', cause: '' });

    const msg = syncState.isOnline && syncState.store.supabaseUrl
      ? `Formal certificate and audit reports compiled and synced for the late ${deathForm.name}.`
      : `Record for the late ${deathForm.name} saved locally. It will sync automatically when connection returns.`;

    triggerSuccessAlert("Death Registered Successfully", msg);
  };

  return (
    <AppContext.Provider value={{
      ...syncState,
      showBirthModal, setShowBirthModal,
      showDeathModal, setShowDeathModal,
      showExportModal, setShowExportModal,
      showSuccessModal, setShowSuccessModal,
      successConfig, setSuccessConfig,
      mapScope, setMapScope,
      searchQuery, setSearchQuery,
      birthForm, setBirthForm,
      deathForm, setDeathForm,
      triggerSuccessAlert,
      handleBirthSubmit,
      handleDeathSubmit
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
