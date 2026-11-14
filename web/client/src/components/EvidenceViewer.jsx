import { Image as ImageIcon, ShieldAlert } from 'lucide-react';

export default function EvidenceViewer({ eventType = 'ACCIDENT' }) {
    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_40px_rgba(15,23,42,0.7)]">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Evidence</p>
                    <h3 className="mt-1 text-xl font-bold text-white">ESP32-CAM Snapshot</h3>
                </div>
                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                    {eventType}
                </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                <div className="flex h-64 w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 text-slate-400">
                    <ImageIcon className="h-8 w-8 text-cyan-300" />
                    <span className="text-sm">Camera feed placeholder — connect ESP32-CAM upload endpoint</span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><ImageIcon className="h-4 w-4 text-cyan-300" /> Capture pending</span>
                <span className="inline-flex items-center gap-2 text-amber-300"><ShieldAlert className="h-4 w-4" /> Awaiting device upload</span>
            </div>
        </div>
    );
}
