"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { stateCoordinates } from '../hooks/useSupabaseSync';

// Fix Leaflet marker icon issues in Next.js build bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function MapWidget({ onSelectState }) {
  const { store } = useApp();
  const centerNigeria = [9.0820, 8.6753]; // Central coordinates of Nigeria

  // Compile real-time database counts aggregated by State
  const stateCounts = {};
  store.records.forEach(rec => {
    // Extract state from location string, e.g. "Lga, Lagos State" -> "Lagos"
    const stateMatch = rec.location.match(/,\s*([A-Za-z0-9\s]+?)\s*State/i);
    const stateName = stateMatch ? stateMatch[1].trim() : null;
    if (stateName && stateCoordinates[stateName]) {
      if (!stateCounts[stateName]) {
        stateCounts[stateName] = { births: 0, deaths: 0, total: 0 };
      }
      if (rec.type === 'Birth') {
        stateCounts[stateName].births += 1;
        stateCounts[stateName].total += 1;
      } else {
        stateCounts[stateName].deaths += 1;
        stateCounts[stateName].total += 1;
      }
    }
  });

  // Base configurations for main hubs
  const baseHubs = {
    "Lagos": { pop: "22.1M", baseRadius: 18, color: "#00f2fe" },
    "Kano": { pop: "15.4M", baseRadius: 15, color: "#00f2fe" },
    "Abuja FCT": { pop: "4.2M", baseRadius: 12, color: "#adc7f7" },
    "Abuja": { pop: "4.2M", baseRadius: 12, color: "#adc7f7" }
  };

  const hotspots = Object.keys(stateCoordinates).map(name => {
    const stats = stateCounts[name] || { births: 0, deaths: 0, total: 0 };
    const hub = baseHubs[name] || { pop: "0.5M", baseRadius: 8, color: "#adc7f7" };
    
    // Scale map circular markers based on live events registered
    const radius = hub.baseRadius + (stats.total * 3);

    return {
      name,
      coords: stateCoordinates[name],
      radius,
      color: hub.color,
      pop: hub.pop,
      births: stats.births,
      deaths: stats.deaths,
      totalLiveEvents: stats.total
    };
  });

  return (
    <div className="w-full h-full relative" style={{ minHeight: '350px' }}>
      <MapContainer 
        center={centerNigeria} 
        zoom={6} 
        scrollWheelZoom={false}
        className="w-full h-full rounded-xl overflow-hidden shadow-inner border border-white/5"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {hotspots.map((spot, idx) => (
          <CircleMarker
            key={idx}
            center={spot.coords}
            radius={spot.radius}
            pathOptions={{
              color: spot.color,
              fillColor: spot.color,
              fillOpacity: 0.35,
              weight: 2
            }}
            eventHandlers={{
              click: () => {
                if (onSelectState) onSelectState(spot.name);
              }
            }}
          >
            <Popup className="glass-popup">
              <div className="text-on-surface p-1 space-y-1 font-body">
                <h4 className="font-bold text-primary-container border-b border-white/10 pb-1 text-sm">{spot.name} State</h4>
                <div className="text-xs space-y-0.5">
                  <p><span className="text-on-surface-variant">Baseline Est:</span> <span className="text-white font-semibold">{spot.pop}</span></p>
                  <p><span className="text-on-surface-variant">Live Births:</span> <span className="text-white font-semibold">{spot.births}</span></p>
                  <p><span className="text-on-surface-variant">Live Deaths:</span> <span className="text-white font-semibold">{spot.deaths}</span></p>
                  <p><span className="text-on-surface-variant">Sync Events:</span> <span className="text-primary-container font-semibold">{spot.totalLiveEvents}</span></p>
                </div>
                <button 
                  onClick={() => {
                    if (onSelectState) onSelectState(spot.name);
                  }}
                  className="mt-2 w-full text-[10px] bg-primary-container text-on-primary py-1 px-2 rounded font-bold hover:brightness-115 transition-all"
                >
                  Inspect State Audit
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        <MapRecenter center={centerNigeria} />
      </MapContainer>
    </div>
  );
}
