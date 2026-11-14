import { Camera, Download, ShieldCheck, X, AlertTriangle } from 'lucide-react';

export default function EvidenceViewerModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-canvas-border bg-canvas-card p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-canvas-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/15 text-cyan border border-cyan/40">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-titanium-100">
                ESP32-CAM Incident Snapshot Evidence
              </h3>
              <p className="text-xs font-mono text-titanium-400">
                INCIDENT ID: {data.id || 'EV-0091'} // CAMERA SLOT: 01
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-titanium-400 hover:bg-canvas-elevated hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Snapshot View with Camera HUD Overlay */}
        <div className="relative overflow-hidden rounded-xl border border-canvas-border bg-black aspect-video flex items-center justify-center">
          {/* Simulated Camera Grain & Cyber HUD */}
          <div className="absolute inset-0 bg-[radial-gradient(#35D6E7_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

          {/* Crosshairs & Camera HUD */}
          <div className="absolute top-4 left-4 font-mono text-[11px] text-cyan bg-black/60 px-2 py-1 rounded border border-cyan/30">
            [REC] ESP32-CAM HD 1080p
          </div>
          <div className="absolute top-4 right-4 font-mono text-[11px] text-status-danger bg-black/60 px-2 py-1 rounded border border-status-danger/30 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-danger animate-ping" />
            <span>IMPACT TRIGGERED</span>
          </div>

          <div className="text-center p-6 space-y-2 z-10">
            <Camera className="h-12 w-12 text-cyan/40 mx-auto" />
            <p className="text-sm font-medium text-titanium-200">
              Automated Pre-Impact Buffered Frame Captured
            </p>
            <span className="text-xs font-mono text-titanium-400">
              Time: {data.timestamp ? new Date(data.timestamp).toLocaleString() : new Date().toLocaleString()}
            </span>
          </div>

          {/* Watermark telemetry bar */}
          <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur p-2.5 border-t border-canvas-border flex flex-wrap items-center justify-between text-[11px] font-mono text-titanium-300">
            <span>LOC: {data.location || '11.0168° N, 76.9558° E'}</span>
            <span>G-FORCE: {data.magnitude || '5.4'} G</span>
            <span>RIDER: {data.rider || 'Aarav Nair'}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-titanium-400 font-mono">
            Cryptographic Hash: <code className="text-cyan">sha256:4f8a...92b1</code>
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan text-canvas font-bold hover:bg-cyan-light transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Acknowledge Evidence</span>
          </button>
        </div>
      </div>
    </div>
  );
}
