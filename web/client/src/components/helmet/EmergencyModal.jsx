import { AlertTriangle, PhoneCall, ShieldAlert, XCircle, CheckCircle2 } from 'lucide-react';

export default function EmergencyModal({ countdown, onCancel, onConfirm, telemetry }) {
  const progressPercent = ((10 - countdown) / 10) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-status-danger bg-canvas-card p-6 text-center shadow-danger-glow">
        {/* Pulsing Danger Beacon Header */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-danger/20 border-2 border-status-danger text-status-danger animate-pulse mb-4">
          <ShieldAlert className="h-9 w-9" />
        </div>

        <div className="inline-block rounded-full bg-status-danger/20 border border-status-danger px-3 py-1 font-mono text-xs font-extrabold tracking-widest text-status-danger uppercase mb-2">
          CRITICAL IMPACT DETECTED
        </div>

        <h2 className="text-2xl font-extrabold text-titanium-100 tracking-tight">
          Automated Emergency Dispatch Initiated
        </h2>

        <p className="mt-2 text-sm text-titanium-400 max-w-sm mx-auto">
          High G-force impact or crash condition detected on unit{' '}
          <strong className="text-cyan font-mono">{telemetry?.deviceId || 'SH-0001'}</strong>.
          Dispatching emergency SMS and initiating contact escalation in:
        </p>

        {/* Circular Countdown Timer */}
        <div className="my-6 relative flex items-center justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-status-danger/30 bg-canvas-elevated">
            <span className="font-mono text-5xl font-black text-status-danger animate-pulse">
              {countdown}
            </span>
            <span className="absolute bottom-3 text-[10px] font-mono tracking-widest uppercase text-titanium-400">
              SECONDS
            </span>
          </div>
        </div>

        {/* Telemetry Snapshot Pill */}
        <div className="rounded-xl border border-canvas-border bg-canvas-subtle p-3 text-left font-mono text-xs space-y-1 mb-6">
          <div className="flex justify-between text-titanium-400">
            <span>IMPACT MAGNITUDE:</span>
            <span className="text-status-danger font-bold">{telemetry?.impactMagnitude || '6.8'} G</span>
          </div>
          <div className="flex justify-between text-titanium-400">
            <span>TILT ANGLE:</span>
            <span className="text-status-warning font-bold">{telemetry?.tiltAngle || '44'}°</span>
          </div>
          <div className="flex justify-between text-titanium-400">
            <span>GPS COORDINATES:</span>
            <span className="text-cyan font-bold">{telemetry?.latitude?.toFixed(4)}, {telemetry?.longitude?.toFixed(4)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 rounded-xl border border-titanium-400 bg-canvas-elevated px-4 py-3 text-sm font-bold text-titanium-100 hover:bg-canvas-border transition-colors"
          >
            <XCircle className="h-5 w-5 text-status-warning" />
            <span>FALSE ALARM (CANCEL)</span>
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 rounded-xl bg-status-danger px-4 py-3 text-sm font-extrabold text-white hover:bg-status-danger/90 transition-all shadow-danger-glow"
          >
            <PhoneCall className="h-5 w-5" />
            <span>DISPATCH NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
}
