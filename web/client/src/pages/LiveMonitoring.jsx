import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Flame, Gauge, HardHat, Radio, Shield, Wifi, Zap } from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';
import SensorMetricCard from '../components/helmet/SensorMetricCard';

export default function LiveMonitoring() {
  const { telemetry, telemetryHistory, actions } = useHelmet();

  const chartData = telemetryHistory.length > 0 ? telemetryHistory : [
    { time: '18:00', impactMagnitude: 1.0, tiltAngle: 25 },
    { time: '18:01', impactMagnitude: 1.2, tiltAngle: 27 },
    { time: '18:02', impactMagnitude: 1.1, tiltAngle: 26 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-cyan uppercase tracking-widest">
            REAL-TIME TELEMETRY BUS
          </span>
          <h1 className="text-2xl font-black text-titanium-100 tracking-tight mt-0.5">
            Live Diagnostics & Hardware Oscilloscope
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={actions.onImpact}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-danger/20 border border-status-danger text-status-danger text-xs font-bold hover:bg-status-danger/30"
          >
            <Flame className="h-4 w-4" />
            <span>Simulate Impact Test</span>
          </button>
        </div>
      </div>

      {/* Live Waveform Oscilloscope */}
      <div className="helmet-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-canvas-border pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan animate-pulse" />
            <h3 className="text-sm font-bold text-titanium-100">
              Live Impact & Tilt Oscilloscope Stream
            </h3>
          </div>
          <span className="font-mono text-xs text-cyan">
            WEBSOCKET ACTIVE: 1000ms SAMPLING
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3745" />
              <XAxis dataKey="time" stroke="#98A7B7" fontSize={11} />
              <YAxis stroke="#98A7B7" fontSize={11} domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161F29',
                  borderColor: '#2A3745',
                  color: '#F1F5F9',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="impactMagnitude"
                name="Impact (G)"
                stroke="#FF5C68"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="tiltAngle"
                name="Tilt Angle (°)"
                stroke="#35D6E7"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="helmet-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan font-bold text-sm">
            <Gauge className="h-4 w-4" />
            <span>MPU-6050 Motion Engine</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-canvas-border">
              <span className="text-titanium-400">Accelerometer:</span>
              <span className="text-titanium-100">
                X: {telemetry?.accelerometer?.x?.toFixed(2)} | Y: {telemetry?.accelerometer?.y?.toFixed(2)} | Z: {telemetry?.accelerometer?.z?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-canvas-border">
              <span className="text-titanium-400">Gyroscope:</span>
              <span className="text-titanium-100">
                X: {telemetry?.gyroscope?.x?.toFixed(1)}°/s | Y: {telemetry?.gyroscope?.y?.toFixed(1)}°/s
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-titanium-400">Sampling Rate:</span>
              <span className="text-status-success font-bold">100 Hz</span>
            </div>
          </div>
        </div>

        <div className="helmet-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-status-success font-bold text-sm">
            <Radio className="h-4 w-4" />
            <span>NEO-6M GPS Engine</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-canvas-border">
              <span className="text-titanium-400">Latitude:</span>
              <span className="text-titanium-100">{telemetry?.latitude?.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between py-1 border-b border-canvas-border">
              <span className="text-titanium-400">Longitude:</span>
              <span className="text-titanium-100">{telemetry?.longitude?.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-titanium-400">Satellites Tracked:</span>
              <span className="text-status-success font-bold">{telemetry?.satellites || 14} Constellation SATS</span>
            </div>
          </div>
        </div>

        <div className="helmet-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan font-bold text-sm">
            <Zap className="h-4 w-4" />
            <span>Power & Peripheral Rails</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-canvas-border">
              <span className="text-titanium-400">Battery Level:</span>
              <span className="text-cyan font-bold">{telemetry?.battery}% (4.12V)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-canvas-border">
              <span className="text-titanium-400">Worn Switch:</span>
              <span className={telemetry?.helmetWorn ? 'text-status-success font-bold' : 'text-status-warning font-bold'}>
                {telemetry?.helmetWorn ? 'CLOSED (WORN)' : 'OPEN (REMOVED)'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-titanium-400">OLED Status:</span>
              <span className="text-status-success font-bold">ACTIVE (I2C 0x3C)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
