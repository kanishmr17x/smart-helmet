import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Battery,
  BatteryCharging,
  Compass,
  Cpu,
  Flame,
  Gauge,
  HardHat,
  MapPin,
  Radio,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';
import HelmetVisualizer from '../components/helmet/HelmetVisualizer';
import SensorMetricCard from '../components/helmet/SensorMetricCard';
import LiveMap from '../components/map/LiveMap';

export default function Dashboard() {
  const { telemetry, alerts, activeDeviceId, actions, setEvidenceData } = useHelmet();
  const navigate = useNavigate();

  const recentAlerts = alerts.slice(0, 5);
  const isHighImpact = (telemetry?.impactMagnitude || 0) > 4.5;
  const isWorn = telemetry?.helmetWorn;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Title & Operational Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan uppercase tracking-widest">
              SYSTEM COMMAND // TELEMETRY HUB
            </span>
          </div>
          <h1 className="text-2xl font-black text-titanium-100 tracking-tight mt-0.5">
            Smart Helmet Safety Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/monitoring')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan/40 bg-cyan/10 text-cyan text-xs font-bold hover:bg-cyan/20 transition-colors shadow-cyan-sm"
          >
            <Gauge className="h-4 w-4" />
            <span>Open Real-time Telemetry</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Smart Helmet Silhouette Panel */}
      <HelmetVisualizer telemetry={telemetry} />

      {/* 3. Sensor Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorMetricCard
          title="Impact Force"
          value={telemetry.impactMagnitude ? telemetry.impactMagnitude.toFixed(2) : '1.15'}
          unit="G"
          status={isHighImpact ? 'critical' : (telemetry.impactMagnitude > 2.5 ? 'warning' : 'normal')}
          icon={Flame}
          subtitle="MPU6050 Peak Threshold"
          trend={isHighImpact ? '+HIGH G FORCE' : 'NOMINAL 1.0G'}
        />

        <SensorMetricCard
          title="Tilt Stability"
          value={telemetry.tiltAngle ? Math.round(telemetry.tiltAngle) : 28}
          unit="DEG (°)"
          status={telemetry.tiltAngle > 55 ? 'warning' : 'normal'}
          icon={Compass}
          subtitle="Equilibrium Angle"
          trend={telemetry.tiltAngle > 55 ? 'TILT EXCEEDED' : 'BALANCED'}
        />

        <SensorMetricCard
          title="GPS Position"
          value={telemetry.satellites || 14}
          unit="SATELLITES"
          status={telemetry.gpsFix ? 'normal' : 'warning'}
          icon={MapPin}
          subtitle={telemetry.gpsFix ? 'Locked 3D Fix' : 'Searching GPS'}
          trend={`±${telemetry.accuracy || 3.2}m Acc`}
        />

        <SensorMetricCard
          title="Cellular Link"
          value={telemetry.networkAvailable ? '4G LTE' : 'OFFLINE'}
          unit={telemetry.networkAvailable ? '-68 dBm' : 'NO CARRIER'}
          status={telemetry.networkAvailable ? 'normal' : 'critical'}
          icon={Radio}
          subtitle="SIM800L Telemetry"
          trend={telemetry.online ? 'CONNECTED' : 'DISCONNECTED'}
        />
      </div>

      {/* 4. Accelerometer & Gyroscope 3-Axis Readout Bar */}
      <div className="helmet-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-canvas-border pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan" />
            <h3 className="text-sm font-bold text-titanium-100">
              6-Axis IMU Spatial Vectors (Accelerometer & Gyroscope)
            </h3>
          </div>
          <span className="font-mono text-xs text-titanium-400">
            REFRESH: 1000ms
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border">
            <span className="text-titanium-400 block text-[10px]">ACCEL X</span>
            <span className="text-cyan font-bold text-base sensor-val">
              {telemetry?.accelerometer?.x?.toFixed(2) || '0.85'}
            </span>
            <span className="text-titanium-400 text-[10px] block">m/s²</span>
          </div>

          <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border">
            <span className="text-titanium-400 block text-[10px]">ACCEL Y</span>
            <span className="text-cyan font-bold text-base sensor-val">
              {telemetry?.accelerometer?.y?.toFixed(2) || '0.12'}
            </span>
            <span className="text-titanium-400 text-[10px] block">m/s²</span>
          </div>

          <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border">
            <span className="text-titanium-400 block text-[10px]">ACCEL Z</span>
            <span className="text-cyan font-bold text-base sensor-val">
              {telemetry?.accelerometer?.z?.toFixed(2) || '9.81'}
            </span>
            <span className="text-titanium-400 text-[10px] block">m/s² (1G)</span>
          </div>

          <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border">
            <span className="text-titanium-400 block text-[10px]">GYRO X (ROLL)</span>
            <span className="text-status-success font-bold text-base sensor-val">
              {telemetry?.gyroscope?.x?.toFixed(1) || '3.4'}
            </span>
            <span className="text-titanium-400 text-[10px] block">°/s</span>
          </div>

          <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border">
            <span className="text-titanium-400 block text-[10px]">GYRO Y (PITCH)</span>
            <span className="text-status-success font-bold text-base sensor-val">
              {telemetry?.gyroscope?.y?.toFixed(1) || '1.2'}
            </span>
            <span className="text-titanium-400 text-[10px] block">°/s</span>
          </div>

          <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border">
            <span className="text-titanium-400 block text-[10px]">GYRO Z (YAW)</span>
            <span className="text-status-success font-bold text-base sensor-val">
              {telemetry?.gyroscope?.z?.toFixed(1) || '5.6'}
            </span>
            <span className="text-titanium-400 text-[10px] block">°/s</span>
          </div>
        </div>
      </div>

      {/* 5. Lower Section: Live GPS Map Preview & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live GPS Map Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan" />
              <h3 className="text-sm font-bold text-titanium-100">Live GPS Coordinates</h3>
            </div>
            <button
              onClick={() => navigate('/tracking')}
              className="flex items-center gap-1 text-xs text-cyan hover:underline font-bold"
            >
              <span>Full Radar View</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <LiveMap
            latitude={telemetry.latitude}
            longitude={telemetry.longitude}
            accuracy={telemetry.accuracy}
            deviceId={telemetry.deviceId}
            riderName={telemetry.riderName}
            online={telemetry.online}
            height="320px"
          />
        </div>

        {/* Live Incident Activity Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-status-warning" />
              <h3 className="text-sm font-bold text-titanium-100">Incident Activity Stream</h3>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="flex items-center gap-1 text-xs text-cyan hover:underline font-bold"
            >
              <span>View All Incidents</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="helmet-card p-4 h-[320px] overflow-y-auto space-y-2.5">
            {recentAlerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-titanium-400 text-xs">
                <ShieldCheck className="h-8 w-8 text-status-success mb-2" />
                <p>No critical alerts or incidents recorded.</p>
                <span className="text-[11px] text-titanium-400">All systems operating within nominal safety thresholds.</span>
              </div>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-canvas-subtle border border-canvas-border hover:border-cyan/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        alert.status === 'CRITICAL'
                          ? 'bg-status-danger animate-ping'
                          : alert.status === 'RESOLVED'
                          ? 'bg-status-success'
                          : 'bg-status-warning'
                      }`}
                    />
                    <div>
                      <span className="font-mono text-xs font-bold text-titanium-100 block">
                        {alert.type || 'EMERGENCY_EVENT'}
                      </span>
                      <span className="text-[11px] text-titanium-400">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'} • {alert.location || 'Coimbatore Grid'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEvidenceData(alert)}
                      className="px-2 py-1 rounded bg-canvas-elevated border border-canvas-border text-[11px] text-cyan hover:border-cyan"
                    >
                      Evidence
                    </button>
                    {alert.status === 'CRITICAL' && (
                      <button
                        onClick={() => actions.onResolveAlert(alert.id)}
                        className="px-2 py-1 rounded bg-status-success/20 text-status-success text-[11px] font-bold"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
