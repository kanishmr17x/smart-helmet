import { Gauge, MoveRight } from 'lucide-react';

function clampPercent(value, max) {
    if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((Math.abs(value) / max) * 100)));
}

export default function SensorDashboard({ telemetry }) {
    const sensorList = [
        { label: 'Accelerometer X', value: `${telemetry.accelerometer.x.toFixed(2)} g`, percent: clampPercent(telemetry.accelerometer.x, 2.5) },
        { label: 'Accelerometer Y', value: `${telemetry.accelerometer.y.toFixed(2)} g`, percent: clampPercent(telemetry.accelerometer.y, 2.5) },
        { label: 'Accelerometer Z', value: `${telemetry.accelerometer.z.toFixed(2)} g`, percent: clampPercent(telemetry.accelerometer.z, 12) },
        { label: 'Tilt Angle', value: `${telemetry.tiltAngle}°`, percent: clampPercent(telemetry.tiltAngle, 90) },
        { label: 'Gyro X', value: `${telemetry.gyroscope.x}°`, percent: clampPercent(telemetry.gyroscope.x, 45) },
        { label: 'Gyro Y', value: `${telemetry.gyroscope.y}°`, percent: clampPercent(telemetry.gyroscope.y, 45) },
        { label: 'Gyro Z', value: `${telemetry.gyroscope.z}°`, percent: clampPercent(telemetry.gyroscope.z, 45) },
    ];

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_40px_rgba(15,23,42,0.7)]">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Telemetry</p>
                    <h3 className="mt-1 text-xl font-bold text-white">Motion Sensor Dashboard</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-100">
                    <Gauge className="h-3.5 w-3.5" />
                    Live feed
                </div>
            </div>

            <div className="grid gap-3">
                {sensorList.map((sensor) => (
                    <div key={sensor.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="text-slate-300">{sensor.label}</span>
                            <span className="font-semibold text-white">{sensor.value}</span>
                        </div>
                        <div className="sensor-bar">
                            <span style={{ width: `${sensor.percent}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 text-sm text-violet-200">
                <div className="mb-2 flex items-center gap-2 font-medium">
                    <MoveRight className="h-4 w-4" />
                    Sudden Impact Magnitude
                </div>
                <div className="text-2xl font-bold text-white">{telemetry.impactMagnitude.toFixed(2)} g</div>
            </div>
        </div>
    );
}
