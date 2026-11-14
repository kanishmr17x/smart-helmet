import { HardHat, Shield, Cpu, Radio, MapPin, Activity, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function HelmetVisualizer({ telemetry }) {
  const isWorn = telemetry?.helmetWorn;
  const isOnline = telemetry?.online;
  const isImpact = (telemetry?.impactMagnitude || 0) > 4.0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-canvas-border bg-canvas-card p-6 shadow-titanium">
      {/* Background Cyber Glow & Radar Circles */}
      <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full border border-canvas-border/40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full border border-canvas-border/20 pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-canvas-border pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan">
              HARDWARE SILHOUETTE
            </span>
            <span className="rounded bg-canvas-elevated px-2 py-0.5 font-mono text-[11px] text-titanium-200 border border-canvas-border">
              UNIT: {telemetry?.deviceId || 'SH-0001'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-titanium-100 mt-0.5">
            Smart Helmet Protective Telemetry Matrix
          </h2>
        </div>

        {/* Operating State Badge */}
        <div className="flex items-center gap-2">
          {isImpact ? (
            <div className="flex items-center gap-1.5 rounded-full bg-status-danger/20 border border-status-danger px-3 py-1 text-xs font-bold text-status-danger animate-pulse">
              <AlertOctagon className="h-4 w-4" />
              <span>IMPACT ALERT</span>
            </div>
          ) : isWorn ? (
            <div className="flex items-center gap-1.5 rounded-full bg-status-success/20 border border-status-success px-3 py-1 text-xs font-bold text-status-success">
              <CheckCircle2 className="h-4 w-4" />
              <span>ACTIVE & SECURED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-status-warning/20 border border-status-warning px-3 py-1 text-xs font-bold text-status-warning">
              <HardHat className="h-4 w-4" />
              <span>NOT WORN / STANDBY</span>
            </div>
          )}
        </div>
      </div>

      {/* Central SVG Smart Helmet Visualization */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
        {/* Helmet Schematic Vector */}
        <div className="relative flex items-center justify-center w-full max-w-sm h-64">
          <svg
            viewBox="0 0 320 260"
            className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Helmet Shell Silhouette */}
            <path
              d="M 60 160 C 50 110 80 40 160 30 C 240 20 280 90 270 160 C 265 195 240 215 190 220 C 150 225 90 215 70 195 Z"
              fill="#111821"
              stroke="#2A3745"
              strokeWidth="4"
            />
            {/* Titanium Aerodynamic Ridges */}
            <path
              d="M 100 65 C 140 50 190 50 230 70"
              stroke="#35D6E7"
              strokeWidth="3"
              strokeDasharray="4 4"
              opacity="0.8"
            />
            <path
              d="M 90 95 C 140 80 190 80 240 100"
              stroke="#2A3745"
              strokeWidth="3"
            />
            {/* Visor Area */}
            <path
              d="M 80 135 C 100 125 210 125 250 145 C 245 180 200 195 140 190 C 100 185 85 165 80 135 Z"
              fill={isImpact ? 'rgba(255, 92, 104, 0.25)' : 'rgba(53, 214, 231, 0.15)'}
              stroke={isImpact ? '#FF5C68' : '#35D6E7'}
              strokeWidth="2.5"
            />
            {/* HUD Scanline Across Visor */}
            <line
              x1="95"
              y1="150"
              x2="235"
              y2="155"
              stroke={isImpact ? '#FF5C68' : '#8CEBF3'}
              strokeWidth="2"
              opacity="0.75"
            />

            {/* Embedded Sensor Nodes with Interactive Rings */}
            {/* 1. MPU-6050 Accelerometer/Gyro (Crown) */}
            <circle cx="160" cy="45" r="9" fill="#1C2733" stroke="#35D6E7" strokeWidth="2.5" />
            <circle cx="160" cy="45" r="4" fill="#35D6E7" className="animate-ping" />

            {/* 2. GPS Module (Rear Crest) */}
            <circle cx="250" cy="85" r="8" fill="#1C2733" stroke="#36C98F" strokeWidth="2" />
            <circle cx="250" cy="85" r="3.5" fill="#36C98F" />

            {/* 3. GSM / 4G Antenna (Lower Lateral) */}
            <circle cx="255" cy="180" r="7" fill="#1C2733" stroke="#8CEBF3" strokeWidth="2" />
            <circle cx="255" cy="180" r="3" fill="#8CEBF3" />

            {/* 4. Head Contact / Capacitive Touch Sensor (Brow Rim) */}
            <circle cx="75" cy="165" r="7" fill="#1C2733" stroke={isWorn ? '#36C98F' : '#F4B942'} strokeWidth="2" />
            <circle cx="75" cy="165" r="3" fill={isWorn ? '#36C98F' : '#F4B942'} />

            {/* Technical Leader Lines */}
            <line x1="160" y1="45" x2="160" y2="15" stroke="#35D6E7" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="250" y1="85" x2="290" y2="85" stroke="#36C98F" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="75" y1="165" x2="35" y2="165" stroke={isWorn ? '#36C98F' : '#F4B942'} strokeWidth="1" strokeDasharray="2 2" />
          </svg>

          {/* Floating Sensor Callout Badges */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-canvas-elevated/90 border border-cyan/40 px-2 py-0.5 rounded text-[10px] font-mono text-cyan shadow-cyan-sm">
            MPU-6050 6-AXIS IMU
          </div>
          <div className="absolute top-16 right-0 bg-canvas-elevated/90 border border-status-success/40 px-2 py-0.5 rounded text-[10px] font-mono text-status-success">
            GPS FIX ({telemetry?.satellites || 12} SATS)
          </div>
          <div className="absolute bottom-12 left-0 bg-canvas-elevated/90 border border-status-warning/40 px-2 py-0.5 rounded text-[10px] font-mono text-status-warning">
            TOUCH: {isWorn ? 'HEAD DETECTED' : 'NOT WORN'}
          </div>
        </div>

        {/* Real-time Hardware Module Diagnostics Grid */}
        <div className="w-full lg:w-72 space-y-2.5">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-titanium-400">
            INTEGRATED SENSOR STATUS
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-subtle border border-canvas-border">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan" />
              <span className="text-xs font-medium text-titanium-200">MPU6050 Gyro / Accel</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-status-success">NOMINAL</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-subtle border border-canvas-border">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-status-success" />
              <span className="text-xs font-medium text-titanium-200">NEO-6M GPS Receiver</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-status-success">
              {telemetry?.gpsFix ? 'LOCKED' : 'SEARCHING'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-subtle border border-canvas-border">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan" />
              <span className="text-xs font-medium text-titanium-200">SIM800L GSM Telemetry</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-cyan">
              {telemetry?.networkAvailable ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-subtle border border-canvas-border">
            <div className="flex items-center gap-2">
              <HardHat className="h-4 w-4 text-status-warning" />
              <span className="text-xs font-medium text-titanium-200">Capacitive Worn Sensor</span>
            </div>
            <span className={`text-[11px] font-mono font-bold ${isWorn ? 'text-status-success' : 'text-status-warning'}`}>
              {isWorn ? 'WORN' : 'NOT WORN'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-subtle border border-canvas-border">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan" />
              <span className="text-xs font-medium text-titanium-200">Battery Cell</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-cyan">
              {telemetry?.battery}% (4.12V)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
