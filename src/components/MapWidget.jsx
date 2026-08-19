"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { stateCoordinates } from '../hooks/useSupabaseSync';

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
  const centerNigeria = [9.0820, 8.6753];

  // Compile real-time database counts aggregated by State
  const stateCounts = {};
  store.records.forEach(rec => {
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
    "Lagos": { pop: "22.1M", color: "#00f2fe" },
    "Kano": { pop: "15.4M", color: "#00f2fe" },
    "Abuja FCT": { pop: "4.2M", color: "#adc7f7" },
    "Abuja": { pop: "4.2M", color: "#adc7f7" }
  };

  const hotspots = Object.keys(stateCoordinates).map(name => {
    const stats = stateCounts[name] || { births: 0, deaths: 0, total: 0 };
    const hub = baseHubs[name] || { pop: "0.5M", color: "#adc7f7" };

    return {
      name,
      coords: stateCoordinates[name],
      color: hub.color,
      pop: hub.pop,
      births: stats.births,
      deaths: stats.deaths,
      totalLiveEvents: stats.total
    };
  });

  // Custom Neon Location Pin icon generator using SVG and L.divIcon
  const createPinIcon = (color, totalEvents, name) => {
    // Make pin size slightly larger if there are active events
    const pinSize = totalEvents > 0 ? 34 : 26;
    
    return L.divIcon({
      className: 'custom-neon-pin',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; width: 40px; height: 40px;">
          <svg width="${pinSize}" height="${pinSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 6px ${color}); transition: all 0.3s ease;">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="${color}"/>
          </svg>
          ${totalEvents > 0 ? `
            <span style="position: absolute; top: -4px; right: -2px; background: #ff0055; color: #fff; font-size: 8px; font-family: monospace; font-weight: bold; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1.5px solid #000; box-shadow: 0 0 8px #ff0055;">
              ${totalEvents}
            </span>
          ` : ''}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 36],
      popupAnchor: [0, -32]
    });
  };

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
          <Marker
            key={idx}
            position={spot.coords}
            icon={createPinIcon(spot.color, spot.totalLiveEvents, spot.name)}
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
          </Marker>
        ))}
        
        <MapRecenter center={centerNigeria} />
      </MapContainer>
    </div>
  );
}
