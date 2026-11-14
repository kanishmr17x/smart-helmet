import { Cpu, Signal, Wifi } from 'lucide-react';

export default function DeviceHealth({ telemetry }) {
    const moduleChecks = [
        { name: 'MPU6050', status: telemetry?.modules?.mpu6050 ?? true },
        { name: 'GPS', status: telemetry?.modules?.gps ?? telemetry.gpsFix },
        { name: 'GSM', status: telemetry?.modules?.gsm ?? telemetry.networkAvailable },
        { name: 'OLED', status: telemetry?.modules?.oled ?? true },
        { name: 'Touch Sensor', status: telemetry?.modules?.touchSensor ?? true },
    ];

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_40px_rgba(15,23,42,0.7)]">
            <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Diagnostics</p>
                <h3 className="mt-1 text-xl font-bold text-white">Device Health</h3>
            </div>

            <div className="space-y-3">
                {moduleChecks.map((module) => (
                    <div key={module.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                        <div className="flex items-center gap-2 text-sm text-slate-200">
                            <Cpu className="h-4 w-4 text-cyan-300" />
                            {module.name}
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${module.status ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                            {module.status ? 'OK' : 'FAIL'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-300"><Signal className="h-4 w-4 text-emerald-300" /> Power</div>
                    <div className="text-xl font-bold text-white">{telemetry.battery}%</div>
                    {telemetry.battery < 20 && <div className="mt-2 text-xs text-amber-300">Low Battery Warning</div>}
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-300"><Wifi className="h-4 w-4 text-cyan-300" /> Network</div>
                    <div className="text-xl font-bold text-white">{telemetry.online ? 'ONLINE' : 'OFFLINE'}</div>
                    <div className="mt-2 text-xs text-slate-400">Last seen {telemetry.lastSeenSecondsAgo}s ago</div>
                </div>
            </div>
        </div>
    );
}
