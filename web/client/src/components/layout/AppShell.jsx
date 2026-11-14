import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  Cpu,
  Flame,
  Gauge,
  HardHat,
  HelpCircle,
  Layers,
  LogOut,
  MapPin,
  Menu,
  Radio,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  User,
  Wifi,
  WifiOff,
  X,
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
    { to: '/', label: 'Command Overview', icon: Layers, end: true },
    { to: '/monitoring', label: 'Live Telemetry', icon: Gauge },
    { to: '/tracking', label: 'GPS Spatial Radar', icon: MapPin },
    { to: '/alerts', label: 'Incidents & SOS', icon: ShieldAlert, badge: criticalAlertsCount },
    { to: '/devices', label: 'Hardware Fleet', icon: Cpu },
    { to: '/analytics', label: 'Safety Analytics', icon: Radio },
    { to: '/settings', label: 'System Config', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-titanium-100 font-sans">
      {/* 1. Left Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden md:flex flex-col border-r border-canvas-border bg-canvas-subtle transition-all duration-300 z-30`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-canvas-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-glow border border-cyan/40 text-cyan shadow-cyan-sm">
              <ShieldCheck className="h-6 w-6 text-cyan" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-extrabold tracking-wider text-sm text-titanium-100 uppercase">
                  Smart<span className="text-cyan font-black">Helmet</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-titanium-400">
                  CENTRAL // COMMAND
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-titanium-400 hover:text-cyan transition-colors p-1"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Device Status Banner */}
        <div className="p-3 border-b border-canvas-border bg-canvas/60">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-titanium-400">UNIT:</span>
            <select
              value={activeDeviceId}
              onChange={(e) => setActiveDeviceId(e.target.value)}
              className="bg-canvas-card border border-canvas-border text-cyan rounded px-2 py-0.5 text-xs font-bold outline-none focus:border-cyan"
            >
              <option value="SH-0001">SH-0001 (Main)</option>
              <option value="SH-0002">SH-0002 (Fleet)</option>
            </select>
          </div>
          {sidebarOpen && (
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    telemetry.online ? 'bg-status-success animate-pulse' : 'bg-status-danger'
                  }`}
                />
                <span className="text-titanium-200">
                  {telemetry.online ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <span className="font-mono text-titanium-400">
                BAT: <span className="text-cyan font-bold">{telemetry.battery}%</span>
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan/15 text-cyan border border-cyan/40 shadow-cyan-sm font-semibold'
                      : 'text-titanium-400 hover:text-titanium-100 hover:bg-canvas-card'
                  }`
                }
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                {sidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
                {sidebarOpen && item.badge > 0 && (
                  <span className="rounded-full bg-status-danger/20 border border-status-danger text-status-danger px-1.5 py-0.2 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Simulator Quick Action Panel */}
        <div className="p-3 border-t border-canvas-border bg-canvas/40 space-y-2">
          {sidebarOpen && (
            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-titanium-400 uppercase">
              <span>Hardware Simulators</span>
              <span className="text-cyan">TEST</span>
            </div>
          )}
          <div className={`grid ${sidebarOpen ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5`}>
            <button
              onClick={actions.onImpact}
              className="flex items-center justify-center gap-1.5 p-2 rounded bg-status-danger/10 border border-status-danger/30 text-status-danger text-[11px] font-bold hover:bg-status-danger/20 transition-colors"
              title="Simulate Crash / G-Force Impact"
            >
              <Flame className="h-3.5 w-3.5" />
              {sidebarOpen && 'Impact'}
            </button>
            <button
              onClick={actions.onManualSOS}
              className="flex items-center justify-center gap-1.5 p-2 rounded bg-status-warning/10 border border-status-warning/30 text-status-warning text-[11px] font-bold hover:bg-status-warning/20 transition-colors"
              title="Simulate Rider Emergency SOS"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {sidebarOpen && 'SOS'}
            </button>
            <button
              onClick={actions.onToggleHelmet}
              className={`flex items-center justify-center gap-1.5 p-2 rounded border text-[11px] font-medium transition-colors ${
                telemetry.helmetWorn
                  ? 'bg-canvas-card border-status-success/30 text-status-success'
                  : 'bg-status-danger/10 border-status-danger/40 text-status-danger'
              }`}
              title="Toggle Helmet Worn Status"
            >
              <HardHat className="h-3.5 w-3.5" />
              {sidebarOpen && (telemetry.helmetWorn ? 'Worn' : 'Unworn')}
            </button>
            <button
              onClick={actions.onToggleNetwork}
              className={`flex items-center justify-center gap-1.5 p-2 rounded border text-[11px] font-medium transition-colors ${
                telemetry.online
                  ? 'bg-canvas-card border-cyan/30 text-cyan'
                  : 'bg-canvas-card border-titanium-700 text-titanium-400'
              }`}
              title="Toggle Network Cellular Drop"
            >
              {telemetry.online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              {sidebarOpen && (telemetry.online ? '4G Net' : 'Drop')}
            </button>
          </div>
        </div>

        {/* User Footer */}
        <div className="flex items-center justify-between p-3 border-t border-canvas-border bg-canvas-card/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan/20 text-cyan font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-titanium-100 truncate">
                  {user?.name || 'Command Operator'}
                </span>
                <span className="text-[10px] text-cyan font-mono">{user?.role || 'Admin'}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-titanium-400 hover:text-status-danger transition-colors p-1.5 rounded hover:bg-canvas"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Operational Header */}
        <header className="h-16 shrink-0 border-b border-canvas-border bg-canvas-subtle/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between z-20">
          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded bg-canvas-card border border-canvas-border text-titanium-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan" />
              <span className="font-bold text-sm tracking-wide">
                Smart<span className="text-cyan">Helmet</span>
              </span>
            </div>
          </div>

          {/* Desktop Left Telemetry Stream Badge */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-canvas-card border border-canvas-border">
              <span
                className={`h-2 w-2 rounded-full ${
                  wsStatus === 'connected'
                    ? 'bg-status-success animate-ping'
                    : wsStatus === 'connecting'
                    ? 'bg-status-warning'
                    : 'bg-status-danger'
                }`}
              />
              <span className="text-titanium-200">
                {wsStatus === 'connected'
                  ? 'LIVE TELEMETRY STREAM'
                  : wsStatus === 'connecting'
                  ? 'CONNECTING STREAM'
                  : 'DISCONNECTED'}
              </span>
            </div>

            <span className="text-titanium-400">
              LOCATION: <span className="text-cyan font-bold">{telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}</span>
            </span>

            <span className="text-titanium-400">
              HELMET: <span className={telemetry.helmetWorn ? 'text-status-success font-bold' : 'text-status-danger font-bold'}>
                {telemetry.helmetWorn ? 'WORN' : 'NOT WORN'}
              </span>
            </span>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Direct SOS Trigger Button */}
            <button
              onClick={actions.onManualSOS}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-danger text-white text-xs font-extrabold uppercase tracking-wider shadow-danger-glow hover:bg-status-danger/90 transition-all active:scale-95"
            >
              <AlertTriangle className="h-4 w-4 animate-bounce" />
              <span className="hidden sm:inline">Emergency SOS</span>
            </button>

            {/* Notification Badge */}
            <button
              onClick={() => navigate('/alerts')}
              className="relative p-2 rounded-lg bg-canvas-card border border-canvas-border text-titanium-400 hover:text-cyan transition-colors"
              title="Emergency Notifications"
            >
              <Bell className="h-4 w-4" />
              {criticalAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-danger text-[10px] font-bold text-white animate-pulse">
                  {criticalAlertsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-canvas p-4 sm:p-6 lg:p-8 tech-grid">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm md:hidden">
          <div className="w-4/5 max-w-xs bg-canvas-subtle border-r border-canvas-border h-full flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-canvas-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-cyan" />
                <span className="font-bold text-base">Smart<span className="text-cyan">Helmet</span></span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded text-titanium-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-4 flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                        isActive ? 'bg-cyan/20 text-cyan border border-cyan/40 font-bold' : 'text-titanium-400'
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
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-status-danger/20 text-status-danger text-xs font-bold"
              >
                <LogOut className="h-4 w-4" />
                Logout
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
