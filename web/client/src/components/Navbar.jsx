import { Activity, AlertTriangle, BellRing, LogOut, Shield, Wifi, WifiOff } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
    { label: 'Dashboard', to: '/' },
    { label: 'Incidents', to: '/incidents' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'Devices', to: '/devices' },
    { label: 'Profile', to: '/profile' },
];

export default function Navbar({ telemetry, actions = {}, user, onLogout }) {
    const { onImpact, onManualSOS, onToggleHelmet, onToggleNetwork } = actions;

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Smart Helmet</div>
                        <div className="text-lg font-bold text-slate-100">Central Command</div>
                    </div>
                </div>

                <nav className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 p-1 md:flex">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 sm:flex">
                        <div className={`h-2.5 w-2.5 rounded-full ${telemetry.online ? 'bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]' : 'bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.8)]'}`} />
                        <span>{telemetry.online ? 'Connected' : 'Offline'}</span>
                        <span className="text-slate-400">•</span>
                        <span>{telemetry.lastSeenSecondsAgo}s ago</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200">
                        {telemetry.networkAvailable ? <Wifi className="h-3.5 w-3.5 text-emerald-400" /> : <WifiOff className="h-3.5 w-3.5 text-red-400" />}
                        <span>{telemetry.networkAvailable ? 'Network Stable' : 'Network Drop'}</span>
                    </div>

                    {user && (
                        <button
                            type="button"
                            onClick={onLogout}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
                            title={`Signed in as ${user.email}`}
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Logout
                        </button>
                    )}
                </div>
            </div>

            <div className="border-t border-slate-800 bg-slate-900/70">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={onImpact}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        Simulate Impact
                    </button>
                    <button
                        type="button"
                        onClick={onManualSOS}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                    >
                        <BellRing className="h-4 w-4" />
                        Simulate Manual SOS
                    </button>
                    <button
                        type="button"
                        onClick={onToggleHelmet}
                        className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/15"
                    >
                        <Activity className="h-4 w-4" />
                        Toggle Helmet Worn/Unworn
                    </button>
                    <button
                        type="button"
                        onClick={onToggleNetwork}
                        className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/15"
                    >
                        <WifiOff className="h-4 w-4" />
                        Toggle Network Drop
                    </button>
                </div>
            </div>
        </header>
    );
}
