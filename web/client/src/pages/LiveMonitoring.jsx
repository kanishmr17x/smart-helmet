import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Flame, Gauge, HardHat, Radio, Zap } from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';

export default function LiveMonitoring() {
  const { telemetry, telemetryHistory, actions } = useHelmet();

  const chartData = telemetryHistory.length > 0 ? telemetryHistory : [
    { time: '18:00', impactMagnitude: 1.0, tiltAngle: 25 },
    { time: '18:01', impactMagnitude: 1.2, tiltAngle: 27 },
    { time: '18:02', impactMagnitude: 1.1, tiltAngle: 26 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan tracking-wide">
              Sensors & Oscilloscope
            </span>
            <span className="text-titanium-400 text-xs">•</span>
            <span className="text-xs text-titanium-400">Continuous 1000ms Polling</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Live Diagnostics & Waveforms
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={actions.onImpact}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-status-danger/15 border border-status-danger/30 text-status-danger text-xs font-semibold hover:bg-status-danger/25 transition-all active:scale-95 shadow-sm"
          >
            <Flame className="h-4 w-4" />
            <span>Simulate Impact Surge</span>
          </button>
        </div>
      </div>

      {/* Live Waveform Oscilloscope */}
      <div className="helmet-card p-6">
        <div className="flex items-center justify-between mb-5 border-b border-canvas-border pb-3">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-cyan animate-pulse" />
            <h3 className="text-sm font-semibold text-white">
              Real-time G-Force & Tilt Oscilloscope
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-titanium-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-status-danger" />
              <span>Impact (G)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan" />
              <span>Tilt (°)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} domain={[0, 10]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151923',
                  borderColor: '#232A3B',
                  borderRadius: '12px',
                  color: '#F1F5F9',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 12,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                }}
              />
              <Line
                type="monotone"
                dataKey="impactMagnitude"
                name="Impact (G)"
                stroke="#F43F5E"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="tiltAngle"
                name="Tilt Angle (°)"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="helmet-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan font-semibold text-sm">
            <Gauge className="h-4 w-4" />
            <span>MPU-6050 Motion Engine</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-canvas-border">
              <span className="text-titanium-400">Accelerometer:</span>
              <span className="font-mono text-white">
                X: {telemetry?.accelerometer?.x?.toFixed(2)} | Y: {telemetry?.accelerometer?.y?.toFixed(2)} | Z: {telemetry?.accelerometer?.z?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-canvas-border">
              <span className="text-titanium-400">Gyroscope:</span>
              <span className="font-mono text-white">
                X: {telemetry?.gyroscope?.x?.toFixed(1)}°/s | Y: {telemetry?.gyroscope?.y?.toFixed(1)}°/s
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-titanium-400">Sampling Rate:</span>
              <span className="text-status-success font-medium">100 Hz Internal</span>
            </div>
          </div>
        </div>

        <div className="helmet-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-status-success font-semibold text-sm">
            <Radio className="h-4 w-4" />
            <span>NEO-6M GPS Engine</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-canvas-border">
              <span className="text-titanium-400">Latitude:</span>
              <span className="font-mono text-white">{telemetry?.latitude?.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-canvas-border">
              <span className="text-titanium-400">Longitude:</span>
              <span className="font-mono text-white">{telemetry?.longitude?.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-titanium-400">Satellites:</span>
              <span className="text-status-success font-medium">{telemetry?.satellites || 14} Constellation Fix</span>
            </div>
          </div>
        </div>

        <div className="helmet-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan font-semibold text-sm">
            <Zap className="h-4 w-4" />
            <span>Power & Peripheral Rail</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-canvas-border">
              <span className="text-titanium-400">Battery Level:</span>
              <span className="font-mono text-cyan font-semibold">{telemetry?.battery}% (4.12V)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-canvas-border">
              <span className="text-titanium-400">Wearing Switch:</span>
              <span className={`font-medium ${telemetry?.helmetWorn ? 'text-status-success' : 'text-status-warning'}`}>
                {telemetry?.helmetWorn ? 'Active (Worn)' : 'Open (Removed)'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-titanium-400">Display Bus:</span>
              <span className="text-status-success font-medium">I2C OLED 0x3C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
