import { Compass, MapPin, Navigation, Radio, Satellite, ShieldCheck } from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';
import LiveMap from '../components/map/LiveMap';

export default function GpsTracking() {
  const { telemetry } = useHelmet();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-cyan uppercase tracking-widest">
            SPATIAL TELEMETRY
          </span>
          <h1 className="text-2xl font-black text-titanium-100 tracking-tight mt-0.5">
            Real-Time GPS Tracking & Geo-Fence Radar
          </h1>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-canvas-card border border-canvas-border">
            <span className="text-titanium-400">SATS: </span>
            <span className="text-cyan font-bold">{telemetry.satellites || 14}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-canvas-card border border-canvas-border">
            <span className="text-titanium-400">ACCURACY: </span>
            <span className="text-status-success font-bold">±{telemetry.accuracy || 3.2}m</span>
          </div>
        </div>
      </div>

      {/* Main Full Radar Map */}
      <div className="space-y-4">
        <LiveMap
          latitude={telemetry.latitude}
          longitude={telemetry.longitude}
          accuracy={telemetry.accuracy}
          deviceId={telemetry.deviceId}
          riderName={telemetry.riderName}
          online={telemetry.online}
          height="540px"
        />

        {/* Spatial Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="helmet-card p-4">
            <span className="text-titanium-400 block text-[10px] uppercase">Latitude</span>
            <span className="text-titanium-100 font-bold text-base sensor-val">
              {telemetry.latitude?.toFixed(6)}° N
            </span>
          </div>
          <div className="helmet-card p-4">
            <span className="text-titanium-400 block text-[10px] uppercase">Longitude</span>
            <span className="text-titanium-100 font-bold text-base sensor-val">
              {telemetry.longitude?.toFixed(6)}° E
            </span>
          </div>
          <div className="helmet-card p-4">
            <span className="text-titanium-400 block text-[10px] uppercase">Heading</span>
            <span className="text-cyan font-bold text-base sensor-val">
              {Math.round(telemetry.tiltAngle || 32)}° ENE
            </span>
          </div>
          <div className="helmet-card p-4">
            <span className="text-titanium-400 block text-[10px] uppercase">Geofence Status</span>
            <span className="text-status-success font-bold text-base">
              WITHIN CORRIDOR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
