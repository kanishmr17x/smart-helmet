import { HardHat, Shield, Cpu, Radio, MapPin, Activity, Zap, CheckCircle2, AlertOctagon, Camera } from 'lucide-react';

export default function HelmetVisualizer({ telemetry }) {
  const isWorn = telemetry?.helmetWorn;
  const isImpact = (telemetry?.impactMagnitude || 0) > 4.0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-canvas-border bg-canvas-card/90 backdrop-blur-xl p-6 shadow-card">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-canvas-border pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan tracking-wide">
              Hardware Architecture
            </span>
            <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-titanium-300 border border-white/[0.08]">
              Unit ID: {telemetry?.deviceId || 'SH-0001'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Protective Telemetry & Sensor Matrix
          </h2>
        </div>

        {/* Operating State Badge */}
        <div className="flex items-center gap-2">
          {isImpact ? (
            <div className="flex items-center gap-1.5 rounded-full bg-status-danger/15 border border-status-danger/40 px-3 py-1 text-xs font-bold text-status-danger shadow-danger-glow animate-pulse">
              <AlertOctagon className="h-4 w-4" />
              <span>Critical Impact Detected</span>
            </div>
          ) : isWorn ? (
            <div className="flex items-center gap-1.5 rounded-full bg-status-success/10 border border-status-success/30 px-3 py-1 text-xs font-medium text-status-success">
              <span className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
              <span>Secured & Worn</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-status-warning/10 border border-status-warning/30 px-3 py-1 text-xs font-medium text-status-warning">
              <HardHat className="h-4 w-4" />
              <span>Standby / Helmet Removed</span>
            </div>
          )}
        </div>
      </div>

      {/* Center Visualization & Diagnostics Grid */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 py-2">
        {/* Helmet Schematic Vector Graphic */}
        <div className="relative flex items-center justify-center w-full max-w-sm h-64">
          <svg
            viewBox="0 0 320 260"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Helmet Shell Silhouette */}
            <path
              d="M 60 160 C 50 105 80 38 160 30 C 240 22 280 88 270 160 C 265 195 240 215 190 220 C 150 225 90 215 70 195 Z"
              fill="#10141D"
              stroke="#232A3B"
              strokeWidth="3.5"
            />
            {/* Precision Contours */}
            <path
              d="M 100 65 C 140 50 190 50 230 70"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <path
              d="M 90 95 C 140 80 190 80 240 100"
              stroke="#232A3B"
              strokeWidth="2.5"
            />
            {/* Smoked Visor Area */}
            <path
              d="M 80 135 C 100 125 210 125 250 145 C 245 180 200 195 140 190 C 100 185 85 165 80 135 Z"
              fill={isImpact ? 'rgba(244, 63, 94, 0.2)' : 'rgba(6, 182, 212, 0.12)'}
              stroke={isImpact ? '#F43F5E' : '#06B6D4'}
              strokeWidth="2"
            />
            {/* Horizon Scanline */}
            <line
              x1="95"
              y1="150"
              x2="235"
              y2="155"
              stroke={isImpact ? '#F43F5E' : '#67E8F9'}
              strokeWidth="2"
              opacity="0.8"
            />

            {/* Sensor Hotspot Nodes */}
            {/* 1. MPU-6050 Accelerometer/Gyro (Apex) */}
            <circle cx="160" cy="45" r="9" fill="#151923" stroke="#06B6D4" strokeWidth="2" />
            <circle cx="160" cy="45" r="4" fill="#06B6D4" className="animate-ping" />

            {/* 2. GPS Receiver (Rear Ridge) */}
            <circle cx="250" cy="85" r="8" fill="#151923" stroke="#10B981" strokeWidth="2" />
            <circle cx="250" cy="85" r="3.5" fill="#10B981" />

            {/* 3. Cellular & Bluetooth Antenna (Lower Lateral) */}
            <circle cx="255" cy="180" r="7" fill="#151923" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="255" cy="180" r="3" fill="#38BDF8" />

            {/* 4. Capacitive / IR Worn Sensor (Forehead Rim) */}
            <circle cx="75" cy="165" r="7" fill="#151923" stroke={isWorn ? '#10B981' : '#F59E0B'} strokeWidth="2" />
            <circle cx="75" cy="165" r="3" fill={isWorn ? '#10B981' : '#F59E0B'} />

            {/* Subtle Guides */}
            <line x1="160" y1="45" x2="160" y2="18" stroke="#06B6D4" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            <line x1="250" y1="85" x2="285" y2="85" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            <line x1="75" y1="165" x2="40" y2="165" stroke={isWorn ? '#10B981' : '#F59E0B'} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          </svg>

          {/* Floating Sensor Callout Badges */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-canvas-elevated/90 border border-cyan/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-cyan shadow-sm">
            MPU-6050 6-Axis IMU
          </div>
          <div className="absolute top-16 right-0 bg-canvas-elevated/90 border border-status-success/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-status-success shadow-sm">
            GPS 3D ({telemetry?.satellites || 12} Sats)
          </div>
          <div className="absolute bottom-12 left-0 bg-canvas-elevated/90 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-titanium-300 shadow-sm">
            Wear: {isWorn ? 'Engaged' : 'Unworn'}
          </div>
        </div>

        {/* Real-time Hardware Module Diagnostics Grid */}
        <div className="w-full lg:w-80 space-y-2">
          <div className="text-xs font-semibold text-titanium-400 px-1 mb-1">
            Module Diagnostics
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle/80 border border-canvas-border hover:border-canvas-border-light transition-colors">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-cyan" />
              <span className="text-xs font-medium text-titanium-200">MPU-6050 Gyro / Accel</span>
            </div>
            <span className="text-[11px] font-medium text-status-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
              Nominal
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle/80 border border-canvas-border hover:border-canvas-border-light transition-colors">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-status-success" />
              <span className="text-xs font-medium text-titanium-200">NEO-6M GPS Receiver</span>
            </div>
            <span className="text-[11px] font-medium text-status-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
              {telemetry?.gpsFix ? '3D Locked' : 'Searching'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle/80 border border-canvas-border hover:border-canvas-border-light transition-colors">
            <div className="flex items-center gap-2.5">
              <Radio className="h-4 w-4 text-cyan" />
              <span className="text-xs font-medium text-titanium-200">SIM800L Cellular / GSM</span>
            </div>
            <span className={`text-[11px] font-medium flex items-center gap-1 ${telemetry?.networkAvailable ? 'text-cyan' : 'text-status-danger'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${telemetry?.networkAvailable ? 'bg-cyan' : 'bg-status-danger'}`} />
              {telemetry?.networkAvailable ? '4G LTE' : 'No Signal'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle/80 border border-canvas-border hover:border-canvas-border-light transition-colors">
            <div className="flex items-center gap-2.5">
              <HardHat className="h-4 w-4 text-status-warning" />
              <span className="text-xs font-medium text-titanium-200">Wearing Detection</span>
            </div>
            <span className={`text-[11px] font-medium flex items-center gap-1 ${isWorn ? 'text-status-success' : 'text-status-warning'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isWorn ? 'bg-status-success' : 'bg-status-warning'}`} />
              {isWorn ? 'Secured' : 'Standby'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle/80 border border-canvas-border hover:border-canvas-border-light transition-colors">
            <div className="flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-cyan" />
              <span className="text-xs font-medium text-titanium-200">LiPo Battery Cell</span>
            </div>
            <span className="text-[11px] font-mono font-medium text-titanium-200">
              {telemetry?.battery}% (4.12V)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
