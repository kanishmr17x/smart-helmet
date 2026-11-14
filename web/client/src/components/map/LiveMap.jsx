import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Radio } from 'lucide-react';

// Custom Cyan Helmet Marker Icon
const helmetIcon = L.divIcon({
  className: 'custom-helmet-pin',
  html: `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    ">
      <div style="
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(53, 214, 231, 0.3);
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #35D6E7;
        border: 2px solid #0B0F14;
        box-shadow: 0 0 15px #35D6E7;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #0B0F14;"></div>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function LiveMap({
  latitude = 11.0168,
  longitude = 76.9558,
  accuracy = 5,
  deviceId = 'SH-0001',
  riderName = 'Command Rider',
  online = true,
  height = '350px',
}) {
  const position = [latitude, longitude];

  return (
    <div className="relative overflow-hidden rounded-xl border border-canvas-border bg-canvas-card shadow-titanium" style={{ height }}>
      {/* Map HUD Overlay Header */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 rounded-lg bg-canvas-elevated/90 backdrop-blur px-3 py-1.5 border border-canvas-border text-xs font-mono">
        <Navigation className="h-3.5 w-3.5 text-cyan animate-pulse" />
        <span className="font-bold text-titanium-100">{deviceId}</span>
        <span className="text-titanium-400">|</span>
        <span className="text-cyan">{latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
      </div>

      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={position} />

        {/* GPS Accuracy Radius Circle */}
        <Circle
          center={position}
          radius={accuracy * 5}
          pathOptions={{
            color: '#35D6E7',
            fillColor: '#35D6E7',
            fillOpacity: 0.15,
            weight: 1.5,
          }}
        />

        <Marker position={position} icon={helmetIcon}>
          <Popup className="custom-dark-popup">
            <div className="p-1 text-xs font-mono">
              <strong className="text-cyan block">{deviceId} ({riderName})</strong>
              <span className="text-slate-700 block">Status: {online ? 'ONLINE' : 'OFFLINE'}</span>
              <span className="text-slate-500 block">Lat/Lng: {latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
