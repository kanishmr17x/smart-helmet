import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  Cpu,
  Flame,
  Gauge,
  HardHat,
  Layers,
  LogOut,
  MapPin,
  Menu,
  Radio,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Wifi,
  WifiOff,
  X,
  Battery,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHelmet } from '../../context/HelmetContext';
import EmergencyModal from '../helmet/EmergencyModal';
import EvidenceViewerModal from '../helmet/EvidenceViewerModal';

export default function AppShell() {
  const { user, logout } = useAuth();
  const {
    telemetry,
    wsStatus,
    alerts,
    devices,
    activeDeviceId,
    setActiveDeviceId,
    actions,
    isEmergencyModalOpen,
    countdown,
    evidenceData,
    setEvidenceData,
  } = useHelmet();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const criticalAlertsCount = alerts.filter((a) => a.status === 'CRITICAL').length;

  const navItems = [
    { to: '/', label: 'Overview', icon: Layers, end: true },
    { to: '/monitoring', label: 'Live Telemetry', icon: Gauge },
    { to: '/tracking', label: 'GPS Radar', icon: MapPin },
    { to: '/alerts', label: 'Incidents & SOS', icon: ShieldAlert, badge: criticalAlertsCount },
    { to: '/devices', label: 'Fleet Hardware', icon: Cpu },
    { to: '/analytics', label: 'Safety Analytics', icon: Radio },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-titanium-100 font-sans antialiased selection:bg-cyan/20 selection:text-cyan-light">
      {/* 1. Left Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden md:flex flex-col border-r border-canvas-border bg-canvas-subtle/80 backdrop-blur-xl transition-all duration-300 z-30`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-canvas-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/20 to-primary/10 border border-cyan/30 text-cyan shadow-cyan-sm">
              <ShieldCheck className="h-5 w-5 text-cyan" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold tracking-tight text-sm text-white flex items-center gap-1">
                  Smart<span className="text-cyan font-black">Helmet</span>
                </span>
                <span className="text-[10px] tracking-wider text-titanium-400 font-medium">
                  Command Center
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-titanium-400 hover:text-white hover:bg-white/[0.04] transition-colors p-1.5 rounded-lg"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Device Status Selector */}
        <div className="p-3 border-b border-canvas-border bg-canvas/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-titanium-400 font-medium text-[11px]">Active Unit</span>
            <div className="relative flex items-center">
              <select
                value={activeDeviceId}
                onChange={(e) => setActiveDeviceId(e.target.value)}
                className="bg-canvas-card border border-canvas-border text-white rounded-lg px-2.5 py-1 text-xs font-semibold outline-none focus:border-cyan/60 transition-colors cursor-pointer pr-6 appearance-none"
              >
                <option value="SH-0001">SH-0001 (Main)</option>
                <option value="SH-0002">SH-0002 (Fleet)</option>
              </select>
              <ChevronDown className="h-3 w-3 text-titanium-400 absolute right-1.5 pointer-events-none" />
            </div>
          </div>

          {sidebarOpen && (
            <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-canvas-border/50">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    telemetry.online ? 'bg-status-success animate-pulse' : 'bg-status-danger'
                  }`}
                />
                <span className="text-titanium-300 font-medium">
                  {telemetry.online ? 'Active Link' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-titanium-300">
                <Battery className={`h-3 w-3 ${telemetry.battery < 20 ? 'text-status-danger' : 'text-status-success'}`} />
                <span>{telemetry.battery}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan/10 text-cyan border border-cyan/25 font-semibold shadow-sm'
                      : 'text-titanium-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
                {sidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
                {sidebarOpen && item.badge > 0 && (
                  <span className="rounded-full bg-status-danger/15 border border-status-danger/40 text-status-danger px-1.5 py-0.2 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Simulator Hardware Quick Actions */}
        <div className="p-3 border-t border-canvas-border bg-canvas/40 space-y-2">
          {sidebarOpen && (
            <div className="flex items-center justify-between text-[11px] font-medium text-titanium-400">
              <span>Hardware Simulators</span>
              <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-1.5 py-0.2 rounded border border-cyan/20">TEST</span>
            </div>
          )}
          <div className={`grid ${sidebarOpen ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5`}>
            <button
              onClick={actions.onImpact}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-status-danger/10 border border-status-danger/25 text-status-danger text-[11px] font-semibold hover:bg-status-danger/20 transition-all active:scale-95"
              title="Simulate Crash / G-Force Impact"
            >
              <Flame className="h-3.5 w-3.5" />
              {sidebarOpen && 'Impact'}
            </button>
            <button
              onClick={actions.onManualSOS}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-status-warning/10 border border-status-warning/25 text-status-warning text-[11px] font-semibold hover:bg-status-warning/20 transition-all active:scale-95"
              title="Simulate Rider Emergency SOS"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {sidebarOpen && 'SOS'}
            </button>
            <button
              onClick={actions.onToggleHelmet}
              className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-[11px] font-semibold transition-all active:scale-95 ${
                telemetry.helmetWorn
                  ? 'bg-status-success/10 border-status-success/25 text-status-success hover:bg-status-success/20'
                  : 'bg-canvas-card border-canvas-border text-titanium-400 hover:text-white'
              }`}
              title="Toggle Helmet Worn Status"
            >
              <HardHat className="h-3.5 w-3.5" />
              {sidebarOpen && (telemetry.helmetWorn ? 'Worn' : 'Off')}
            </button>
            <button
              onClick={actions.onToggleNetwork}
              className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-[11px] font-semibold transition-all active:scale-95 ${
                telemetry.online
                  ? 'bg-cyan/10 border-cyan/25 text-cyan hover:bg-cyan/20'
                  : 'bg-canvas-card border-canvas-border text-titanium-400'
              }`}
              title="Toggle Network Cellular Drop"
            >
              {telemetry.online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              {sidebarOpen && (telemetry.online ? '4G Net' : 'Offline')}
            </button>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="flex items-center justify-between p-3 border-t border-canvas-border bg-canvas-card/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan/20 to-primary/20 border border-cyan/30 text-cyan font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'O'}
            </div>
            {sidebarOpen && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Operator'}
                </span>
                <span className="text-[10px] text-titanium-400">{user?.role || 'Admin'}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-titanium-400 hover:text-status-danger transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 border-b border-canvas-border bg-canvas/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-canvas-card border border-canvas-border text-white hover:bg-canvas-elevated transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan" />
              <span className="font-bold text-sm tracking-tight text-white">
                Smart<span className="text-cyan">Helmet</span>
              </span>
            </div>
          </div>

          {/* Desktop Real-time Telemetry Status Pill */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-canvas-card border border-canvas-border shadow-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  wsStatus === 'connected'
                    ? 'bg-status-success animate-pulse'
                    : wsStatus === 'connecting'
                    ? 'bg-status-warning'
                    : 'bg-status-danger'
                }`}
              />
              <span className="text-xs font-medium text-titanium-200">
                {wsStatus === 'connected'
                  ? 'Telemetry Stream Live'
                  : wsStatus === 'connecting'
                  ? 'Connecting Stream...'
                  : 'Feed Disconnected'}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-canvas-card border border-canvas-border text-xs text-titanium-400">
              <MapPin className="h-3.5 w-3.5 text-cyan" />
              <span className="font-mono text-titanium-200">
                {telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                telemetry.helmetWorn
                  ? 'bg-status-success/10 border-status-success/25 text-status-success'
                  : 'bg-status-warning/10 border-status-warning/25 text-status-warning'
              }`}
            >
              <HardHat className="h-3.5 w-3.5" />
              <span>{telemetry.helmetWorn ? 'Helmet Secured' : 'Helmet Not Worn'}</span>
            </div>
          </div>

          {/* Header Right Controls */}
          <div className="flex items-center gap-3">
            {/* Instant SOS Button */}
            <button
              onClick={actions.onManualSOS}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-status-danger text-white text-xs font-bold tracking-wide shadow-danger-glow hover:bg-status-danger/90 transition-all active:scale-95"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency SOS</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/alerts')}
              className="relative p-2 rounded-xl bg-canvas-card border border-canvas-border text-titanium-300 hover:text-white hover:border-canvas-border-light transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {criticalAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-danger text-[10px] font-bold text-white shadow-danger-glow">
                  {criticalAlertsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto bg-canvas p-4 sm:p-6 lg:p-8 tech-grid">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-md md:hidden">
          <div className="w-4/5 max-w-xs bg-canvas-subtle border-r border-canvas-border h-full flex flex-col p-5">
            <div className="flex items-center justify-between pb-4 border-b border-canvas-border">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-6 w-6 text-cyan" />
                <span className="font-bold text-base text-white">Smart<span className="text-cyan">Helmet</span></span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-titanium-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-4 flex-1 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-cyan/15 text-cyan border border-cyan/30 font-semibold' : 'text-titanium-400 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto rounded-full bg-status-danger text-white px-2 py-0.5 text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-canvas-border">
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-status-danger/15 text-status-danger text-xs font-bold border border-status-danger/30"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 4. Global Emergency False Alarm Modal */}
      {isEmergencyModalOpen && (
        <EmergencyModal
          countdown={countdown}
          onCancel={actions.onEmergencyCancel}
          onConfirm={actions.onEmergencyConfirm}
          telemetry={telemetry}
        />
      )}

      {/* 5. ESP32-CAM Evidence Modal */}
      {evidenceData && (
        <EvidenceViewerModal
          data={evidenceData}
          onClose={() => setEvidenceData(null)}
        />
      )}
    </div>
  );
}