import { AlertTriangle, PhoneCall, ShieldAlert, XCircle, CheckCircle2 } from 'lucide-react';

export default function EmergencyModal({ countdown, onCancel, onConfirm, telemetry }) {
  const strokeDashoffset = 283 - (283 * (10 - countdown)) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-status-danger/40 bg-canvas-card/95 backdrop-blur-xl p-8 text-center shadow-card">
        {/* Pulsing Danger Beacon Header */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-status-danger/15 border border-status-danger/30 text-status-danger mb-4">
          <ShieldAlert className="h-7 w-7 text-status-danger animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-status-danger/15 border border-status-danger/30 px-3 py-0.5 text-xs font-semibold text-status-danger mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-status-danger animate-ping" />
          <span>Critical Impact Event</span>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">
          Automated Emergency Escalation
        </h2>

        <p className="mt-2 text-xs text-titanium-400 max-w-sm mx-auto leading-relaxed">
          High G-force impact or crash condition detected on unit{' '}
          <strong className="text-cyan font-mono">{telemetry?.deviceId || 'SH-0001'}</strong>.
          Emergency contacts and SMS dispatch will initiate in:
        </p>

        {/* Circular Countdown Progress Ring */}
        <div className="my-6 relative flex items-center justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-canvas-border"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-status-danger transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-extrabold text-white">
                {countdown}
              </span>
              <span className="text-[10px] text-titanium-400 uppercase font-medium">
                Sec
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Snapshot Card */}
        <div className="rounded-2xl border border-canvas-border bg-canvas-subtle/80 p-3.5 text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between items-center text-titanium-300">
            <span>Impact Magnitude:</span>
            <span className="font-mono text-status-danger font-bold">{telemetry?.impactMagnitude || '6.8'} G</span>
          </div>
          <div className="flex justify-between items-center text-titanium-300">
            <span>Tilt Equilibrium:</span>
            <span className="font-mono text-status-warning font-bold">{telemetry?.tiltAngle || '44'}°</span>
          </div>
          <div className="flex justify-between items-center text-titanium-300">
            <span>GPS Location:</span>
            <span className="font-mono text-cyan font-semibold">{telemetry?.latitude?.toFixed(4)}, {telemetry?.longitude?.toFixed(4)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 rounded-xl border border-canvas-border bg-canvas-card px-4 py-2.5 text-xs font-semibold text-white hover:bg-canvas-elevated hover:border-canvas-border-light transition-all active:scale-95"
          >
            <XCircle className="h-4 w-4 text-titanium-400" />
            <span>Cancel (False Alarm)</span>
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 rounded-xl bg-status-danger px-4 py-2.5 text-xs font-bold text-white hover:bg-status-danger/90 transition-all shadow-danger-glow active:scale-95"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Dispatch Emergency</span>
          </button>
        </div>
      </div>
    </div>
  );
}
