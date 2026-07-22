import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const defaultBaseline = {
  population: 232541894,
  birthRate: 37.2,
  deathRate: 11.8,
  growthRate: 2.4,
  dailyBirths: 2841,
  dailyDeaths: 894,
  records: [
    { nin: "102-445-982", name: "Amina Chinedu", type: "Birth", date: "2026-07-22 08:42", location: "Lagos State General", status: "Verified" },
    { nin: "089-112-456", name: "Samuel Okafor", type: "Death", date: "2026-07-22 07:15", location: "Abuja Central", status: "Pending" },
    { nin: "552-901-334", name: "Binta Suleiman", type: "Birth", date: "2026-07-21 21:55", location: "Kano City Clinic", status: "Verified" },
    { nin: "211-778-402", name: "Grace Adebayo", type: "Birth", date: "2026-07-21 19:30", location: "Ibadan Health Center", status: "Verified" },
    { nin: "990-234-118", name: "Mustafa Idris", type: "Death", date: "2026-07-21 16:10", location: "Port Harcourt Med", status: "Verified" }
  ],
  supabaseUrl: "",
  supabaseKey: "",
  syncQueue: []
};

export function useSupabaseSync() {
  const [store, setStore] = useState(() => {
    const saved = localStorage.getItem("npc_store_react");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultBaseline,
          ...parsed,
          records: parsed.records || defaultBaseline.records,
          syncQueue: parsed.syncQueue || []
        };
      } catch (e) {
        return defaultBaseline;
      }
    }
    return defaultBaseline;
  });

  const [supabaseClient, setSupabaseClient] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("Offline (Local Mode)");
  const [syncActive, setSyncActive] = useState(false);

  // Save store to local storage helper
  useEffect(() => {
    localStorage.setItem("npc_store_react", JSON.stringify(store));
  }, [store]);

  // Handle network state listeners
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Initialize Supabase Client
  useEffect(() => {
    if (store.supabaseUrl && store.supabaseKey && isOnline) {
      try {
        const client = createClient(store.supabaseUrl, store.supabaseKey);
        setSupabaseClient(client);
        setSyncStatus("Online (Connected)");
        setSyncActive(true);
      } catch (e) {
        console.error(e);
        setSupabaseClient(null);
        setSyncStatus("Config Error");
        setSyncActive(false);
      }
    } else {
      setSupabaseClient(null);
      setSyncActive(false);
      setSyncStatus(isOnline ? "Offline (Local Mode)" : "Offline Mode");
    }
  }, [store.supabaseUrl, store.supabaseKey, isOnline]);

  // Load Remote Records from Supabase
  const loadRemoteRecords = useCallback(async () => {
    if (!supabaseClient || !isOnline) return;

    try {
      const { data, error } = await supabaseClient
        .from('registrations')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedRecords = data.map(item => ({
          nin: item.nin,
          name: item.name,
          type: item.type,
          date: item.date,
          location: item.location,
          status: item.status || "Verified"
        }));

        const births = mappedRecords.filter(r => r.type === 'Birth').length;
        const deaths = mappedRecords.filter(r => r.type === 'Death').length;

        setStore(prev => ({
          ...prev,
          records: mappedRecords,
          dailyBirths: defaultBaseline.dailyBirths + births,
          dailyDeaths: defaultBaseline.dailyDeaths + deaths,
          population: defaultBaseline.population + births - deaths
        }));
      }
    } catch (e) {
      console.warn("Could not sync remote records:", e.message);
    }
  }, [supabaseClient, isOnline]);

  // Sync Queue handler
  const syncOfflineQueue = useCallback(async () => {
    if (!supabaseClient || !isOnline || store.syncQueue.length === 0) return;

    setSyncStatus("Syncing Queue...");
    const queue = [...store.syncQueue];
    const failed = [];

    for (const record of queue) {
      try {
        const { error } = await supabaseClient
          .from('registrations')
          .insert([{
            nin: record.nin,
            name: record.name,
            type: record.type,
            date: record.date,
            location: record.location,
            status: 'Verified'
          }]);

        if (error) throw error;
      } catch (e) {
        console.error("Sync item error:", e);
        failed.push(record);
      }
    }

    setStore(prev => ({ ...prev, syncQueue: failed }));
    
    if (failed.length === 0) {
      setSyncStatus("Online (Synced)");
      setSyncActive(true);
      loadRemoteRecords();
    } else {
      setSyncStatus(`Sync Error (${failed.length} pending)`);
      setSyncActive(false);
    }
  }, [supabaseClient, isOnline, store.syncQueue, loadRemoteRecords]);

  // Trigger sync on online/active state change
  useEffect(() => {
    if (supabaseClient && isOnline) {
      loadRemoteRecords();
      syncOfflineQueue();
    }
  }, [supabaseClient, isOnline, syncOfflineQueue, loadRemoteRecords]);

  // Actions
  const addRecord = async (record) => {
    const isBirth = record.type === "Birth";

    // Optimistically update locally
    setStore(prev => ({
      ...prev,
      records: [record, ...prev.records],
      population: prev.population + (isBirth ? 1 : -1),
      dailyBirths: prev.dailyBirths + (isBirth ? 1 : 0),
      dailyDeaths: prev.dailyDeaths + (isBirth ? 0 : 1)
    }));

    // Post to Supabase / Queue
    if (supabaseClient && isOnline) {
      try {
        const { error } = await supabaseClient
          .from('registrations')
          .insert([{
            nin: record.nin,
            name: record.name,
            type: record.type,
            date: record.date,
            location: record.location,
            status: 'Verified'
          }]);
        if (error) throw error;
      } catch (err) {
        console.warn("Saving to sync queue:", err.message);
        setStore(prev => ({
          ...prev,
          syncQueue: [...prev.syncQueue, record]
        }));
      }
    } else {
      setStore(prev => ({
        ...prev,
        syncQueue: [...prev.syncQueue, record]
      }));
    }
  };

  const saveSupabaseConfig = (url, key) => {
    setStore(prev => ({
      ...prev,
      supabaseUrl: url,
      supabaseKey: key
    }));
  };

  const resetStore = () => {
    setStore(defaultBaseline);
    setSyncStatus("Offline (Local Mode)");
    setSyncActive(false);
  };

  return {
    store,
    isOnline,
    syncStatus,
    syncActive,
    addRecord,
    saveSupabaseConfig,
    resetStore,
    refreshRecords: loadRemoteRecords
  };
}
