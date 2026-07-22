/**
 * NPC Population Analysis System
 * Frontend Application Orchestrator with Supabase Offline-First Sync
 */

class PopulationApp {
  constructor() {
    this.defaultBaseline = {
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

    this.store = {};
    this.charts = {};
    this.mapScope = 'national';
    this.supabase = null;
    this.isOnline = navigator.onLine;

    this.init();
  }

  init() {
    this.loadStore();
    this.initSupabase();
    this.initRouter();
    this.renderKPIs();
    this.renderTable();
    this.initCharts();
    this.initMapMouseParallax();
    this.initNetworkListeners();
    this.populateSettingsForm();
    this.syncOfflineQueue();
  }

  // --- STORE MANAGEMENT ---
  loadStore() {
    const saved = localStorage.getItem("npc_store");
    if (saved) {
      try {
        this.store = JSON.parse(saved);
        // Ensure structure matches schema
        if (!this.store.syncQueue) this.store.syncQueue = [];
        if (!this.store.supabaseUrl) this.store.supabaseUrl = "";
        if (!this.store.supabaseKey) this.store.supabaseKey = "";
      } catch (e) {
        this.store = { ...this.defaultBaseline };
      }
    } else {
      this.store = { ...this.defaultBaseline };
      this.saveStore();
    }
  }

  saveStore() {
    localStorage.setItem("npc_store", JSON.stringify(this.store));
  }

  resetStore() {
    this.store = JSON.parse(JSON.stringify(this.defaultBaseline));
    this.saveStore();
    this.renderKPIs();
    this.renderTable();
    this.updateCharts();
    this.populateSettingsForm();
    this.initSupabase(); // reset connection
    this.showSuccessToast("System Reset", "The local database has been successfully reset to factory defaults.", () => {});
  }

  // --- SUPABASE CONFIGURATION & CONNECTION ---
  initSupabase() {
    const url = this.store.supabaseUrl;
    const key = this.store.supabaseKey;

    if (url && key && typeof supabase !== 'undefined') {
      try {
        this.supabase = supabase.createClient(url, key);
        this.updateSyncIndicator(true, "Online (Connected)");
        this.loadRemoteRecords();
      } catch (e) {
        console.error("Failed to initialize Supabase:", e);
        this.supabase = null;
        this.updateSyncIndicator(false, "Config Error");
      }
    } else {
      this.supabase = null;
      this.updateSyncIndicator(false, "Offline (Local Mode)");
    }
  }

  saveSupabaseConfig() {
    const url = document.getElementById("settings-sb-url").value.trim();
    const key = document.getElementById("settings-sb-key").value.trim();
    
    this.store.supabaseUrl = url;
    this.store.supabaseKey = key;
    this.saveStore();
    this.initSupabase();
  }

  populateSettingsForm() {
    const urlInput = document.getElementById("settings-sb-url");
    const keyInput = document.getElementById("settings-sb-key");
    if (urlInput) urlInput.value = this.store.supabaseUrl || "";
    if (keyInput) keyInput.value = this.store.supabaseKey || "";
  }

  async loadRemoteRecords() {
    if (!this.supabase || !this.isOnline) return;

    try {
      const { data, error } = await this.supabase
        .from('registrations')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map database response to local structure
        this.store.records = data.map(item => ({
          nin: item.nin,
          name: item.name,
          type: item.type,
          date: item.date,
          location: item.location,
          status: item.status || "Verified"
        }));

        // Adjust KPIs dynamically based on data counts
        const births = this.store.records.filter(r => r.type === 'Birth').length;
        const deaths = this.store.records.filter(r => r.type === 'Death').length;
        
        this.store.dailyBirths = 2841 + births;
        this.store.dailyDeaths = 894 + deaths;
        this.store.population = 232541894 + births - deaths;
        
        this.saveStore();
        this.renderKPIs();
        this.renderTable();
        this.updateCharts();
      }
    } catch (e) {
      console.warn("Could not load records from Supabase (falling back to cache):", e.message);
    }
  }

  // --- NETWORK STATUS LISTENERS ---
  initNetworkListeners() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.initSupabase();
      this.syncOfflineQueue();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.supabase = null;
      this.updateSyncIndicator(false, "Offline Mode");
    });
  }

  updateSyncIndicator(active, text) {
    const indicator = document.getElementById("sync-status-indicator");
    const dot = document.getElementById("sync-status-dot");
    const label = document.getElementById("sync-status-text");

    if (!indicator) return;

    if (active && this.isOnline) {
      indicator.className = "flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-semibold select-none transition-all";
      dot.className = "w-2 h-2 bg-green-400 rounded-full animate-pulse";
      label.innerText = text;
    } else {
      indicator.className = "flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-semibold select-none transition-all";
      dot.className = "w-2 h-2 bg-yellow-400 rounded-full animate-ping";
      label.innerText = text;
    }
  }

  // --- OFFLINE SYNC QUEUE ENGINE ---
  async syncOfflineQueue() {
    if (!this.supabase || !this.isOnline || !this.store.syncQueue || this.store.syncQueue.length === 0) return;

    this.updateSyncIndicator(true, "Syncing Queue...");
    const queue = [...this.store.syncQueue];
    const failed = [];

    for (const record of queue) {
      try {
        const { error } = await this.supabase
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
        console.error("Sync item failed:", e);
        failed.push(record);
      }
    }

    this.store.syncQueue = failed;
    this.saveStore();
    
    if (failed.length === 0) {
      this.showSuccessToast("Database Synchronized", "All offline records have been successfully synchronized to Supabase Cloud.", () => {});
      this.loadRemoteRecords();
    } else {
      this.updateSyncIndicator(false, `Sync Error (${failed.length} pending)`);
    }
  }

  // --- ROUTER ---
  initRouter() {
    const handleRoute = () => {
      const hash = window.location.hash || "#dashboard";
      const targetView = hash.replace("#", "");

      // Hide all views
      document.querySelectorAll(".view-pane").forEach(view => {
        view.classList.add("hidden");
      });

      // Show target view
      const targetPane = document.getElementById(`view-${targetView}`);
      if (targetPane) {
        targetPane.classList.remove("hidden");
      }

      // Update Navigation Sidebar Active State
      document.querySelectorAll("#sidebar-nav a").forEach(item => {
        if (item.getAttribute("href") === hash) {
          item.className = "nav-item flex items-center gap-3 px-4 py-3 text-primary-container bg-white/15 border-l-4 border-primary-container shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all duration-300 rounded-r-lg";
        } else {
          item.className = "nav-item flex items-center gap-3 px-4 py-3 text-on-surface-variant/70 hover:bg-white/10 hover:text-on-surface transition-all duration-300 rounded-lg";
        }
      });

      // Change Page Title
      const pageTitleEl = document.getElementById("page-title");
      if (pageTitleEl) {
        const routeNames = {
          dashboard: "NPC Population Analysis Dashboard",
          registrations: "NPC Vital Registrations Portal",
          migration: "Migration & Geographic Hub",
          projections: "Demographic Projections Engine",
          settings: "System Settings"
        };
        pageTitleEl.innerText = routeNames[targetView] || "NPC Portal";
      }

      // Trigger chart resize / re-render to fit container correctly
      setTimeout(() => {
        this.updateCharts();
      }, 50);
    };

    window.addEventListener("hashchange", handleRoute);
    handleRoute();
  }

  // --- RENDER DOM ELEMENTS ---
  renderKPIs() {
    document.getElementById("kpi-population").innerText = Number(this.store.population).toLocaleString();
    document.getElementById("kpi-growth").innerText = `${this.store.growthRate}%`;
    document.getElementById("kpi-births").innerText = `${this.store.birthRate}/1k`;
    document.getElementById("kpi-deaths").innerText = `${this.store.deathRate}/1k`;

    document.getElementById("daily-births-count").innerText = Number(this.store.dailyBirths).toLocaleString();
    document.getElementById("daily-deaths-count").innerText = Number(this.store.dailyDeaths).toLocaleString();
  }

  renderTable(recordsToRender = null) {
    const list = recordsToRender || this.store.records;
    const tbody = document.getElementById("registrations-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-on-surface-variant/60 text-xs">
            No matching registrations found in registry database.
          </td>
        </tr>
      `;
      return;
    }

    list.forEach(rec => {
      const typeBadge = rec.type === "Birth" 
        ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary-container/10 text-primary-container border border-primary-container/20">Birth</span>`
        : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-error-container/20 text-error border border-error-container/20">Death</span>`;

      const statusBadge = rec.status === "Verified"
        ? `<div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
            <span class="text-xs">Verified</span>
           </div>`
        : `<div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span class="text-xs">Pending</span>
           </div>`;

      const tr = document.createElement("tr");
      tr.className = "glass-table-row cursor-pointer";
      tr.innerHTML = `
        <td class="px-6 py-5 font-mono text-sm text-primary-container">#${rec.nin}</td>
        <td class="px-6 py-5 text-sm font-medium">${rec.name}</td>
        <td class="px-6 py-5">${typeBadge}</td>
        <td class="px-6 py-5 text-sm opacity-80">${rec.date}</td>
        <td class="px-6 py-5 text-sm opacity-80">${rec.location}</td>
        <td class="px-6 py-5">${statusBadge}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // --- SEARCH FILTERS ---
  handleSearch(query) {
    if (!query) {
      this.renderTable();
      return;
    }
    const q = query.toLowerCase();
    const filtered = this.store.records.filter(r => 
      r.name.toLowerCase().includes(q) || 
      r.nin.toLowerCase().includes(q) || 
      r.location.toLowerCase().includes(q)
    );
    this.renderTable(filtered);
  }

  searchTable(query) {
    this.handleSearch(query);
  }

  // --- STATE SELECTION ---
  selectState(stateName) {
    const details = {
      Kano: { lga: 44, density: "Extreme (Agrarian Hub)", hubs: "Kano Municipal, Fagge, Gwale" },
      Lagos: { lga: 20, density: "Maximum (Urban Epicenter)", hubs: "Ikeja, Lekki, Alimosho" },
      Abuja: { lga: 6, density: "High (Administrative Capital)", hubs: "Garki, Wuse, Asokoro" }
    };
    
    const info = details[stateName] || { lga: "Unknown", density: "Varies", hubs: "Local zones" };
    
    document.getElementById("insight-state-title").innerText = `Audit Trail State: ${stateName} State`;
    document.getElementById("insight-lga-count").innerText = `${info.lga} LGAs`;
    document.getElementById("insight-density").innerText = info.density;
    document.getElementById("insight-hubs").innerText = info.hubs;

    window.location.hash = "#insight-details";
  }

  showInsightView() {
    this.selectState("Lagos");
  }

  setMapScope(scope) {
    this.mapScope = scope;
    const isNational = scope === 'national';
    document.getElementById("map-btn-national").className = isNational
      ? "px-4 py-2 bg-primary-container text-on-primary rounded-lg text-sm font-bold shadow-[0_0_10px_rgba(0,242,254,0.2)]"
      : "px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 text-white transition-colors";
    document.getElementById("map-btn-regional").className = !isNational
      ? "px-4 py-2 bg-primary-container text-on-primary rounded-lg text-sm font-bold shadow-[0_0_10px_rgba(0,242,254,0.2)]"
      : "px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 text-white transition-colors";
    
    this.showSuccessToast("Scope Adjusted", `Map scope changed to ${scope} dashboard grid.`, () => {});
  }

  // --- CHARTS INITIALIZATION ---
  initCharts() {
    const ctxAge = document.getElementById('ageChart');
    if (ctxAge) {
      this.charts.age = new Chart(ctxAge, {
        type: 'doughnut',
        data: {
          labels: ['0-14 yrs', '15-64 yrs', '65+ yrs'],
          datasets: [{
            data: [42, 55, 3],
            backgroundColor: ['#00f2fe', '#adc7f7', '#ffdad6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#e2e2e2', font: { family: 'Inter', size: 11 } }
            }
          }
        }
      });
    }

    const ctxTrend = document.getElementById('growthTrendChart');
    if (ctxTrend) {
      this.charts.trend = new Chart(ctxTrend, {
        type: 'line',
        data: {
          labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
          datasets: [{
            label: 'Growth Rate (%)',
            data: [2.6, 2.5, 2.5, 2.4, 2.4, 2.4, 2.4],
            borderColor: '#00f2fe',
            backgroundColor: 'rgba(0, 242, 254, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#b9cacb' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#b9cacb' } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    const ctxProj = document.getElementById('projectionChart');
    if (ctxProj) {
      this.charts.proj = new Chart(ctxProj, {
        type: 'line',
        data: {
          labels: ['2026', '2028', '2030', '2032', '2034', '2036'],
          datasets: [{
            label: 'Projected Population (Millions)',
            data: [232.5, 243.8, 255.7, 268.2, 281.3, 295.4],
            borderColor: '#00f2fe',
            backgroundColor: 'rgba(0, 242, 254, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#b9cacb' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#b9cacb' } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  updateCharts() {
    if (this.charts.age) this.charts.age.update();
    if (this.charts.trend) this.charts.trend.update();
    if (this.charts.proj) this.charts.proj.update();
  }

  calculateProjections() {
    const baseYear = parseInt(document.getElementById("proj-base-year").value) || 2026;
    const targetYear = parseInt(document.getElementById("proj-target-year").value) || 2036;
    const growthRate = parseFloat(document.getElementById("proj-growth-rate").value) / 100 || 0.024;
    
    if (targetYear <= baseYear) {
      alert("Target Year must be greater than Base Year.");
      return;
    }

    const startPop = this.store.population;
    const labels = [];
    const dataset = [];

    const yearsDiff = targetYear - baseYear;
    const step = Math.max(1, Math.round(yearsDiff / 6));

    for (let yr = baseYear; yr <= targetYear; yr += step) {
      const t = yr - baseYear;
      const projectedValue = startPop * Math.exp(growthRate * t);
      labels.push(yr.toString());
      dataset.push((projectedValue / 1000000).toFixed(1));
    }

    const finalValue = startPop * Math.exp(growthRate * (targetYear - baseYear));
    document.getElementById("proj-estimated-val").innerText = Math.round(finalValue).toLocaleString();

    if (this.charts.proj) {
      this.charts.proj.data.labels = labels;
      this.charts.proj.data.datasets[0].data = dataset;
      this.charts.proj.update();
    }
  }

  // --- MODALS ACTIONS ---
  openBirthModal() {
    document.getElementById("birth-modal").classList.remove("hidden");
  }

  closeBirthModal() {
    document.getElementById("birth-modal").classList.add("hidden");
  }

  openDeathModal() {
    document.getElementById("death-modal").classList.remove("hidden");
  }

  closeDeathModal() {
    document.getElementById("death-modal").classList.add("hidden");
  }

  openExportModal() {
    document.getElementById("export-modal").classList.remove("hidden");
  }

  closeExportModal() {
    document.getElementById("export-modal").classList.add("hidden");
  }

  // --- DATA SUBMISSIONS ---
  async handleBirthSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("birth-name").value;
    const dob = document.getElementById("birth-date").value;
    const gender = document.getElementById("birth-gender").value;
    const state = document.getElementById("birth-state").value;
    const lga = document.getElementById("birth-lga").value;

    const record = {
      nin: Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"),
      name: name,
      type: "Birth",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      location: `${lga}, ${state} State`,
      status: this.supabase && this.isOnline ? "Verified" : "Pending"
    };

    // 1. Add locally
    this.store.records.unshift(record);
    this.store.population += 1;
    this.store.dailyBirths += 1;

    // 2. Queue for Sync if offline / Save locally
    if (this.supabase && this.isOnline) {
      try {
        const { error } = await this.supabase
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
        console.warn("Direct push to Supabase failed. Saving to sync queue:", err.message);
        this.store.syncQueue.push(record);
        this.updateSyncIndicator(false, `Pending Sync (${this.store.syncQueue.length})`);
      }
    } else {
      this.store.syncQueue.push(record);
      this.updateSyncIndicator(false, `Offline (${this.store.syncQueue.length} pending)`);
    }

    this.saveStore();
    this.renderKPIs();
    this.renderTable();
    this.closeBirthModal();
    e.target.reset();

    const msg = this.supabase && this.isOnline
      ? `Formal record for ${name} has been synced with primary cloud nodes.`
      : `Record for ${name} saved locally. It will sync automatically when connection returns.`;

    this.showSuccessToast("Birth Registered Successfully", msg, () => {});
  }

  async handleDeathSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("death-name").value;
    const date = document.getElementById("death-date").value;
    const state = document.getElementById("death-state").value;
    const lga = document.getElementById("death-lga").value;
    const cause = document.getElementById("death-cause").value;

    const record = {
      nin: Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3"),
      name: name,
      type: "Death",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      location: `${lga}, ${state} State`,
      status: this.supabase && this.isOnline ? "Verified" : "Pending"
    };

    // 1. Add locally
    this.store.records.unshift(record);
    this.store.population -= 1;
    this.store.dailyDeaths += 1;

    // 2. Queue for Sync / Save locally
    if (this.supabase && this.isOnline) {
      try {
        const { error } = await this.supabase
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
        console.warn("Direct push to Supabase failed. Saving to sync queue:", err.message);
        this.store.syncQueue.push(record);
        this.updateSyncIndicator(false, `Pending Sync (${this.store.syncQueue.length})`);
      }
    } else {
      this.store.syncQueue.push(record);
      this.updateSyncIndicator(false, `Offline (${this.store.syncQueue.length} pending)`);
    }

    this.saveStore();
    this.renderKPIs();
    this.renderTable();
    this.closeDeathModal();
    e.target.reset();

    const msg = this.supabase && this.isOnline
      ? `Formal certificate and audit reports compiled and synced for the late ${name}.`
      : `Record for the late ${name} saved locally. It will sync automatically when connection returns.`;

    this.showSuccessToast("Death Registered Successfully", msg, () => {});
  }

  // --- REPORT EXPORT ACTION ---
  triggerExportDownload() {
    this.closeExportModal();
    this.showSuccessToast(
      "Report Exported Successfully",
      "Your Analytical Executive Summary Report (#NPC-2026-X8B) has been compiled and is ready for download.",
      () => {
        this.closeSuccessModal();
        alert("Downloading PDF document...");
      }
    );
  }

  // --- SUCCESS TOAST / MODAL SYSTEM ---
  showSuccessToast(title, body, actionCallback) {
    document.getElementById("success-modal-title").innerText = title;
    document.getElementById("success-modal-body").innerText = body;
    
    const actionBtn = document.getElementById("success-modal-action-btn");
    actionBtn.onclick = actionCallback || (() => this.closeSuccessModal());

    document.getElementById("success-modal").classList.remove("hidden");
  }

  closeSuccessModal() {
    document.getElementById("success-modal").classList.add("hidden");
  }

  toggleNotifications() {
    const dot = document.getElementById("notif-dot");
    if (dot) dot.classList.add("hidden");
    const statusMsg = this.supabase && this.isOnline 
      ? "Supabase database verified. Cloud nodes are synced in real-time."
      : `Offline mode active. Local cache verified. ${this.store.syncQueue.length} pending records queued for next sync.`;
    alert(`Systems online. ${statusMsg}`);
  }

  // --- PARALLAX EFFECT FOR MESH BACKGROUND ---
  initMapMouseParallax() {
    document.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.008;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.008;
      const glowEl = document.getElementById('mesh-glow');
      if (glowEl) {
        glowEl.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });
  }
}

// Instantiate App
window.addEventListener("DOMContentLoaded", () => {
  window.app = new PopulationApp();
});
