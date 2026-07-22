import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon issues in Vite/Webpack build bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically re-center map if needed
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
  const centerNigeria = [9.0820, 8.6753]; // Central coordinates of Nigeria

  // Mock hotspots for interactive audit trails
  const hotspots = [
    { name: "Lagos", coords: [6.5244, 3.3792], population: "22.1M", density: "Maximum", color: "#00f2fe" },
    { name: "Kano", coords: [12.0022, 8.5919], population: "15.4M", density: "Extreme", color: "#00f2fe" },
    { name: "Abuja", coords: [9.0765, 7.3986], population: "4.2M", density: "High", color: "#adc7f7" }
  ];

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
            radius={spot.name === 'Lagos' ? 22 : spot.name === 'Kano' ? 17 : 12}
            pathOptions={{
              color: spot.color,
              fillColor: spot.color,
              fillOpacity: 0.3,
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
                  <p><span className="text-on-surface-variant">Density:</span> <span className="text-white font-semibold">{spot.density}</span></p>
                  <p><span className="text-on-surface-variant">Population:</span> <span className="text-white font-semibold">{spot.population}</span></p>
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
