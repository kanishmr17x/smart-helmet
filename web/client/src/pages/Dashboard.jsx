import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Compass,
  Flame,
  Gauge,
  MapPin,
  Radio,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';
import HelmetVisualizer from '../components/helmet/HelmetVisualizer';
import SensorMetricCard from '../components/helmet/SensorMetricCard';
import LiveMap from '../components/map/LiveMap';

export default function Dashboard() {
  const { telemetry, alerts, actions, setEvidenceData } = useHelmet();
  const navigate = useNavigate();

  const recentAlerts = alerts.slice(0, 5);
  const isHighImpact = (telemetry?.impactMagnitude || 0) > 4.5;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan tracking-wide">
              Command Overview
            </span>
            <span className="text-titanium-400 text-xs">•</span>
            <span className="text-xs text-titanium-400">Real-time Telemetry Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Smart Helmet Safety Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/monitoring')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan/30 bg-cyan/10 text-cyan text-xs font-semibold hover:bg-cyan/20 transition-all shadow-cyan-sm active:scale-95"
          >
            <Gauge className="h-4 w-4" />
            <span>Telemetry Gauges</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Smart Helmet Interactive Silhouette Panel */}
      <HelmetVisualizer telemetry={telemetry} />

      {/* 3. Sensor Metric Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorMetricCard
          title="Impact Force"
          value={telemetry.impactMagnitude ? telemetry.impactMagnitude.toFixed(2) : '1.15'}
          unit="G"
          status={isHighImpact ? 'critical' : (telemetry.impactMagnitude > 2.5 ? 'warning' : 'normal')}
          icon={Flame}
          subtitle="MPU-6050 Peak"
          trend={isHighImpact ? '+HIGH G FORCE' : 'Nominal (1.0G)'}
        />

        <SensorMetricCard
          title="Tilt Angle"
          value={telemetry.tiltAngle ? Math.round(telemetry.tiltAngle) : 28}
          unit="DEG (°)"
          status={telemetry.tiltAngle > 55 ? 'warning' : 'normal'}
          icon={Compass}
          subtitle="Equilibrium"
          trend={telemetry.tiltAngle > 55 ? 'Tilt Alert' : 'Balanced'}
        />

        <SensorMetricCard
          title="GPS Position"
          value={telemetry.satellites || 14}
          unit="Sats"
          status={telemetry.gpsFix ? 'normal' : 'warning'}
          icon={MapPin}
          subtitle={telemetry.gpsFix ? 'Locked 3D Fix' : 'Searching GPS'}
          trend={`±${telemetry.accuracy || 3.2}m accuracy`}
        />

        <SensorMetricCard
          title="Cellular Link"
          value={telemetry.networkAvailable ? '4G LTE' : 'Offline'}
          unit={telemetry.networkAvailable ? '-68 dBm' : 'No link'}
          status={telemetry.networkAvailable ? 'normal' : 'critical'}
          icon={Radio}
          subtitle="SIM800L Telemetry"
          trend={telemetry.online ? 'Connected' : 'Offline'}
        />
      </div>

      {/* 4. Accelerometer & Gyroscope 6-Axis Vectors Panel */}
      <div className="helmet-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-canvas-border pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan" />
            <h3 className="text-sm font-semibold text-white">
              6-Axis Spatial Inertial Vectors
            </h3>
          </div>
          <span className="font-mono text-[11px] text-titanium-400">
            Sampling: 1000ms
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border">
            <span className="text-titanium-400 block text-[10px] font-medium">ACCEL X</span>
            <span className="text-cyan font-bold text-base sensor-val mt-0.5 block">
              {telemetry?.accelerometer?.x?.toFixed(2) || '0.85'}
            </span>
            <span className="text-titanium-400 text-[10px]">m/s²</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border">
            <span className="text-titanium-400 block text-[10px] font-medium">ACCEL Y</span>
            <span className="text-cyan font-bold text-base sensor-val mt-0.5 block">
              {telemetry?.accelerometer?.y?.toFixed(2) || '0.12'}
            </span>
            <span className="text-titanium-400 text-[10px]">m/s²</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border">
            <span className="text-titanium-400 block text-[10px] font-medium">ACCEL Z</span>
            <span className="text-cyan font-bold text-base sensor-val mt-0.5 block">
              {telemetry?.accelerometer?.z?.toFixed(2) || '9.81'}
            </span>
            <span className="text-titanium-400 text-[10px]">m/s² (1G)</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border">
            <span className="text-titanium-400 block text-[10px] font-medium">GYRO ROLL</span>
            <span className="text-status-success font-bold text-base sensor-val mt-0.5 block">
              {telemetry?.gyroscope?.x?.toFixed(1) || '3.4'}
            </span>
            <span className="text-titanium-400 text-[10px]">°/s</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border">
            <span className="text-titanium-400 block text-[10px] font-medium">GYRO PITCH</span>
            <span className="text-status-success font-bold text-base sensor-val mt-0.5 block">
              {telemetry?.gyroscope?.y?.toFixed(1) || '1.2'}
            </span>
            <span className="text-titanium-400 text-[10px]">°/s</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border">
            <span className="text-titanium-400 block text-[10px] font-medium">GYRO YAW</span>
            <span className="text-status-success font-bold text-base sensor-val mt-0.5 block">
              {telemetry?.gyroscope?.z?.toFixed(1) || '5.6'}
            </span>
            <span className="text-titanium-400 text-[10px]">°/s</span>
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
              <h3 className="text-sm font-semibold text-white">Live Spatial Position</h3>
            </div>
            <button
              onClick={() => navigate('/tracking')}
              className="flex items-center gap-1 text-xs text-cyan hover:underline font-semibold"
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
              <h3 className="text-sm font-semibold text-white">Recent Incident Stream</h3>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="flex items-center gap-1 text-xs text-cyan hover:underline font-semibold"
            >
              <span>View All Alerts</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="helmet-card p-4 h-[320px] overflow-y-auto space-y-2.5">
            {recentAlerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-titanium-400 text-xs">
                <ShieldCheck className="h-8 w-8 text-status-success/80 mb-2" />
                <p className="font-medium text-white">No active incidents</p>
                <span className="text-[11px] text-titanium-400 mt-0.5">All sensors reporting nominal thresholds.</span>
              </div>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border hover:border-canvas-border-light transition-colors"
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
                      <span className="text-xs font-semibold text-white block">
                        {alert.type || 'Emergency Event'}
                      </span>
                      <span className="text-[11px] text-titanium-400">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'} • {alert.location || 'Coimbatore Area'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEvidenceData(alert)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-cyan hover:bg-white/[0.08] transition-colors"
                    >
                      Evidence
                    </button>
                    {alert.status === 'CRITICAL' && (
                      <button
                        onClick={() => actions.onResolveAlert(alert.id)}
                        className="px-2.5 py-1 rounded-lg bg-status-success/20 text-status-success text-[11px] font-semibold hover:bg-status-success/30 transition-colors"
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
