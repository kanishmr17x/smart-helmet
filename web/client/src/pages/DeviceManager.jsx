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
      <div className="border-b border-canvas-border pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-cyan tracking-wide">
            Fleet Hardware
          </span>
          <span className="text-titanium-400 text-xs">•</span>
          <span className="text-xs text-titanium-400">Inventory & Health</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Connected Smart Helmet Fleet
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deviceList.map((dev) => {
          const isSelected = dev.deviceId === activeDeviceId;
          return (
            <div
              key={dev.deviceId}
              className={`helmet-card p-6 space-y-5 transition-all ${
                isSelected
                  ? 'border-cyan/50 shadow-card-hover'
                  : 'hover:border-canvas-border-light'
              }`}
            >
              <div className="flex items-center justify-between border-b border-canvas-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan/10 text-cyan border border-cyan/20">
                    <HardHat className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-base text-white">
                      {dev.deviceId}
                    </h3>
                    <span className="text-xs text-titanium-400">{dev.riderName}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    dev.online
                      ? 'bg-status-success/10 border-status-success/25 text-status-success'
                      : 'bg-status-danger/10 border-status-danger/25 text-status-danger'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${dev.online ? 'bg-status-success' : 'bg-status-danger'}`} />
                  {dev.online ? 'Connected' : 'Offline'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border flex items-center justify-between">
                  <span className="text-titanium-400">Battery:</span>
                  <span className="font-mono text-cyan font-semibold">{dev.batteryLevel}%</span>
                </div>
                <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border flex items-center justify-between">
                  <span className="text-titanium-400">GPS Status:</span>
                  <span className="text-status-success font-medium">{dev.gpsFix ? '3D Locked' : 'Searching'}</span>
                </div>
                <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border flex items-center justify-between">
                  <span className="text-titanium-400">4G Link:</span>
                  <span className={dev.networkAvailable ? 'text-cyan font-medium' : 'text-status-danger'}>
                    {dev.networkAvailable ? '4G LTE' : 'No Signal'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-canvas-border flex items-center justify-between">
                  <span className="text-titanium-400">Wearing:</span>
                  <span className={dev.helmetWorn ? 'text-status-success font-medium' : 'text-status-warning'}>
                    {dev.helmetWorn ? 'Secured' : 'Standby'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveDeviceId(dev.deviceId)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-cyan/15 border border-cyan/40 text-cyan'
                      : 'bg-canvas-card border border-canvas-border text-titanium-300 hover:text-white hover:bg-canvas-elevated'
                  }`}
                >
                  {isSelected ? 'Currently Monitoring' : 'Switch to this Helmet'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
