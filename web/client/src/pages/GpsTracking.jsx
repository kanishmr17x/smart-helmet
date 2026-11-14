import { Compass, MapPin, Navigation, Radio, Satellite, ShieldCheck } from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';
import LiveMap from '../components/map/LiveMap';

export default function GpsTracking() {
  const { telemetry } = useHelmet();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan tracking-wide">
              Spatial Telemetry
            </span>
            <span className="text-titanium-400 text-xs">•</span>
            <span className="text-xs text-titanium-400">Live Geo-Positioning</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Real-Time GPS Tracking & Fleet Map
          </h1>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas-card border border-canvas-border shadow-sm">
            <Satellite className="h-3.5 w-3.5 text-cyan" />
            <span className="text-titanium-400">Satellites:</span>
            <span className="font-mono text-white font-bold">{telemetry.satellites || 14}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas-card border border-canvas-border shadow-sm">
            <span className="text-titanium-400">Accuracy:</span>
            <span className="font-mono text-status-success font-bold">±{telemetry.accuracy || 3.2}m</span>
          </div>
        </div>
      </div>

      {/* Main Radar Map */}
      <div className="space-y-4">
        <LiveMap
          latitude={telemetry.latitude}
          longitude={telemetry.longitude}
          accuracy={telemetry.accuracy}
          deviceId={telemetry.deviceId}
          riderName={telemetry.riderName}
          online={telemetry.online}
          height="520px"
        />

        {/* Spatial Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="helmet-card p-4">
            <span className="text-titanium-400 block text-[11px] font-medium">Latitude</span>
            <span className="text-white font-bold text-base sensor-val mt-0.5 block">
              {telemetry.latitude?.toFixed(6)}° N
            </span>
          </div>
          <div className="helmet-card p-4">
            <span className="text-titanium-400 block text-[11px] font-medium">Longitude</span>
            <span className="text-white font-bold text-base sensor-val mt-0.5 block">
              {telemetry.longitude?.toFixed(6)}° E
            </span>
          </div>
          <div className="helmet-card p-4">
            <span className="text-titanium-400 block text-[11px] font-medium">Bearing / Tilt</span>
            <span className="text-cyan font-bold text-base sensor-val mt-0.5 block">
              {Math.round(telemetry.tiltAngle || 32)}° ENE
            </span>
          </div>
          <div className="helmet-card p-4">
            <span className="text-titanium-400 block text-[11px] font-medium">Geofence Status</span>
            <span className="text-status-success font-semibold text-base flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-status-success" />
              Inside Safe Zone
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
