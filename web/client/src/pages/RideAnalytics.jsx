import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Award, Compass, Flame, Shield, TrendingUp } from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';

export default function RideAnalytics() {
  const weeklyData = [
    { day: 'Mon', tripKm: 14.2, peakG: 1.4, safetyScore: 98 },
    { day: 'Tue', tripKm: 22.8, peakG: 1.8, safetyScore: 95 },
    { day: 'Wed', tripKm: 18.5, peakG: 2.1, safetyScore: 92 },
    { day: 'Thu', tripKm: 9.4, peakG: 1.2, safetyScore: 99 },
    { day: 'Fri', tripKm: 31.0, peakG: 3.4, safetyScore: 88 },
    { day: 'Sat', tripKm: 42.1, peakG: 2.6, safetyScore: 91 },
    { day: 'Sun', tripKm: 12.0, peakG: 1.1, safetyScore: 100 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-canvas-border pb-4">
        <span className="font-mono text-xs font-bold text-cyan uppercase tracking-widest">
          RIDER SAFETY INTELLIGENCE
        </span>
        <h1 className="text-2xl font-black text-titanium-100 tracking-tight mt-0.5">
          Ride Safety Analytics & Impact Telemetry Trends
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="helmet-card p-5">
          <span className="text-xs text-titanium-400">OVERALL SAFETY INDEX</span>
          <div className="text-3xl font-black text-status-success mt-1">94.8 / 100</div>
          <span className="text-[11px] text-titanium-400">Tier A+ Protective Compliance</span>
        </div>

        <div className="helmet-card p-5">
          <span className="text-xs text-titanium-400">TOTAL DISTANCE MONITORED</span>
          <div className="text-3xl font-black text-cyan mt-1">150.0 KM</div>
          <span className="text-[11px] text-titanium-400">Active telemetry logging</span>
        </div>

        <div className="helmet-card p-5">
          <span className="text-xs text-titanium-400">HELMET USAGE COMPLIANCE</span>
          <div className="text-3xl font-black text-titanium-100 mt-1">99.4%</div>
          <span className="text-[11px] text-titanium-400">Worn sensor verification</span>
        </div>
      </div>

      {/* Bar Chart of Distance & G-Force */}
      <div className="helmet-card p-5">
        <h3 className="text-sm font-bold text-titanium-100 mb-4">
          Weekly Ride Mileage vs Peak Impact G-Force
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3745" />
              <XAxis dataKey="day" stroke="#98A7B7" fontSize={11} />
              <YAxis stroke="#98A7B7" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161F29',
                  borderColor: '#2A3745',
                  color: '#F1F5F9',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="tripKm" name="Distance (KM)" fill="#35D6E7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="peakG" name="Peak Impact (G)" fill="#FF5C68" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
