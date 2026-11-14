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
      <div className="border-b border-canvas-border pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-cyan tracking-wide">
            Rider Intelligence
          </span>
          <span className="text-titanium-400 text-xs">•</span>
          <span className="text-xs text-titanium-400">Compliance & Scoring</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Ride Safety Analytics & Mileage Trends
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="helmet-card p-6">
          <span className="text-xs font-medium text-titanium-400">Safety Index</span>
          <div className="text-3xl font-extrabold text-status-success mt-1">94.8 / 100</div>
          <span className="text-[11px] text-titanium-400 mt-1 block">Tier A+ Protective Compliance</span>
        </div>

        <div className="helmet-card p-6">
          <span className="text-xs font-medium text-titanium-400">Distance Monitored</span>
          <div className="text-3xl font-extrabold text-cyan mt-1">150.0 km</div>
          <span className="text-[11px] text-titanium-400 mt-1 block">Active GPS telemetry logging</span>
        </div>

        <div className="helmet-card p-6">
          <span className="text-xs font-medium text-titanium-400">Helmet Usage Compliance</span>
          <div className="text-3xl font-extrabold text-white mt-1">99.4%</div>
          <span className="text-[11px] text-titanium-400 mt-1 block">Capacitive sensor verification</span>
        </div>
      </div>

      {/* Bar Chart of Distance & G-Force */}
      <div className="helmet-card p-6">
        <h3 className="text-sm font-semibold text-white mb-5">
          Weekly Ride Mileage vs Peak Impact G-Force
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" opacity={0.6} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151923',
                  borderColor: '#232A3B',
                  borderRadius: '12px',
                  color: '#F1F5F9',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 12,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                }}
              />
              <Bar dataKey="tripKm" name="Distance (km)" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="peakG" name="Peak Impact (G)" fill="#F43F5E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
