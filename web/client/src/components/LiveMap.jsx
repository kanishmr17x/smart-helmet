import { Navigation, LocateFixed } from 'lucide-react';

export default function LiveMap({ telemetry }) {
    const googleMapsLink = `https://maps.google.com/?q=${telemetry.latitude},${telemetry.longitude}`;
    const lat = Number(telemetry.latitude) || 0;
    const lng = Number(telemetry.longitude) || 0;
    // Project a small local area around the live coordinates onto the panel.
    const x = `${50 + ((lng % 1) * 40)}%`;
    const y = `${50 - ((lat % 1) * 40)}%`;

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_40px_rgba(15,23,42,0.7)]">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Location</p>
                    <h3 className="mt-1 text-xl font-bold text-white">Live Map Tracking</h3>
                </div>
                <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200"
                >
                    <Navigation className="h-3.5 w-3.5" />
                    View on Google Maps
                </a>
            </div>

            <div className="map-grid relative h-[300px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent_35%),linear-gradient(180deg,rgba(14,116,144,0.10),rgba(15,23,42,0.35))]" />

                <div
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: x, top: y }}
                >
                    <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 ring-4 ring-emerald-400/30">
                        <div className="absolute h-12 w-12 animate-ping rounded-full border border-emerald-400/80" />
                    </div>
                    <div className="mt-2 rounded-md border border-slate-700 bg-slate-950/90 px-2 py-1 text-[10px] font-medium text-slate-200">
                        {telemetry.deviceId || 'Helmet'}
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Latitude</div>
                    <div className="mt-2 text-base font-semibold text-white">{Number(telemetry.latitude || 0).toFixed(4)}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Longitude</div>
                    <div className="mt-2 text-base font-semibold text-white">{Number(telemetry.longitude || 0).toFixed(4)}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Satellites</div>
                    <div className="mt-2 text-base font-semibold text-white">{telemetry.satellites}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Accuracy</div>
                    <div className="mt-2 text-base font-semibold text-white">{telemetry.accuracy} m</div>
                </div>
            </div>
            {!telemetry.gpsFix && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                    <LocateFixed className="h-4 w-4" />
                    GPS location unavailable, relying on last known coordinates.
                </div>
            )}
        </div>
    );
}
