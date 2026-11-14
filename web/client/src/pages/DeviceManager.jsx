import { Battery, CheckCircle2, Cpu, HardHat, Radio, Wifi, WifiOff } from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';

export default function DeviceManager() {
  const { devices, activeDeviceId, setActiveDeviceId } = useHelmet();

  const deviceList = devices.length > 0 ? devices : [
    {
      deviceId: 'SH-0001',
      riderName: 'Command Operator (Primary)',
      status: 'ACTIVE',
      batteryLevel: 84,
      online: true,
      gpsFix: true,
      networkAvailable: true,
      helmetWorn: true,
    },
    {
      deviceId: 'SH-0002',
      riderName: 'Fleet Unit 2',
      status: 'IDLE',
      batteryLevel: 64,
      online: true,
      gpsFix: true,
      networkAvailable: true,
      helmetWorn: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-canvas-border pb-4">
        <span className="font-mono text-xs font-bold text-cyan uppercase tracking-widest">
          FLEET HARDWARE INVENTORY
        </span>
        <h1 className="text-2xl font-black text-titanium-100 tracking-tight mt-0.5">
          Connected Smart Helmet Fleet
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deviceList.map((dev) => (
          <div
            key={dev.deviceId}
            className={`helmet-card p-6 space-y-4 border ${
              dev.deviceId === activeDeviceId ? 'border-cyan shadow-cyan-sm' : 'border-canvas-border'
            }`}
          >
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/15 text-cyan border border-cyan/40">
                  <HardHat className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-base text-titanium-100">
                    {dev.deviceId}
                  </h3>
                  <span className="text-xs text-titanium-400">{dev.riderName}</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  dev.online ? 'bg-status-success/20 text-status-success' : 'bg-status-danger/20 text-status-danger'
                }`}
              >
                {dev.online ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border flex items-center justify-between">
                <span className="text-titanium-400">BATTERY:</span>
                <span className="text-cyan font-bold">{dev.batteryLevel}%</span>
              </div>
              <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border flex items-center justify-between">
                <span className="text-titanium-400">GPS FIX:</span>
                <span className="text-status-success font-bold">{dev.gpsFix ? 'LOCKED' : 'NO LOCK'}</span>
              </div>
              <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border flex items-center justify-between">
                <span className="text-titanium-400">WORN:</span>
                <span className={dev.helmetWorn ? 'text-status-success font-bold' : 'text-status-warning font-bold'}>
                  {dev.helmetWorn ? 'SECURED' : 'NOT WORN'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-canvas-subtle border border-canvas-border flex items-center justify-between">
                <span className="text-titanium-400">CELLULAR:</span>
                <span className="text-cyan font-bold">{dev.networkAvailable ? 'SIM800L 4G' : 'OFFLINE'}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveDeviceId(dev.deviceId)}
              className={`w-full py-2.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                dev.deviceId === activeDeviceId
                  ? 'bg-cyan text-canvas'
                  : 'bg-canvas-elevated text-titanium-100 hover:bg-cyan hover:text-canvas'
              }`}
            >
              {dev.deviceId === activeDeviceId ? 'ACTIVE PRIMARY UNIT' : 'SET AS PRIMARY MONITOR'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
