import { useState } from 'react';
import { AlertOctagon, CheckCircle2, Filter, Phone, ShieldAlert, FileText } from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';

export default function IncidentHistory() {
  const { alerts, actions, setEvidenceData } = useHelmet();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filtered = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.status === filterSeverity;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan tracking-wide">
              Safety Log & Audit
            </span>
            <span className="text-titanium-400 text-xs">•</span>
            <span className="text-xs text-titanium-400">Emergency Escalations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Incident Log & SOS History
          </h1>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-canvas-card border border-canvas-border">
          {['ALL', 'CRITICAL', 'WARNING', 'RESOLVED'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterSeverity === sev
                  ? 'bg-cyan/15 text-cyan border border-cyan/30 font-semibold shadow-sm'
                  : 'text-titanium-400 hover:text-white'
              }`}
            >
              {sev === 'ALL' ? 'All Alerts' : sev.charAt(0) + sev.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Table */}
      <div className="helmet-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle/80 border-b border-canvas-border text-titanium-400 font-medium">
              <tr>
                <th className="p-4">Incident ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Unit / Rider</th>
                <th className="p-4">GPS Location</th>
                <th className="p-4">Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-titanium-400">
                    No incidents matching selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((alert) => (
                  <tr key={alert.id} className="hover:bg-canvas-subtle/40 transition-colors">
                    <td className="p-4 font-mono font-semibold text-cyan">{alert.id}</td>
                    <td className="p-4 font-semibold text-white">
                      {alert.type || 'Crash Impact'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          alert.status === 'CRITICAL'
                            ? 'bg-status-danger/15 border-status-danger/30 text-status-danger'
                            : alert.status === 'RESOLVED'
                            ? 'bg-status-success/10 border-status-success/25 text-status-success'
                            : 'bg-status-warning/10 border-status-warning/25 text-status-warning'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            alert.status === 'CRITICAL'
                              ? 'bg-status-danger animate-pulse'
                              : alert.status === 'RESOLVED'
                              ? 'bg-status-success'
                              : 'bg-status-warning'
                          }`}
                        />
                        {alert.status.charAt(0) + alert.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="p-4 text-titanium-200">
                      {alert.deviceId} ({alert.rider || 'Primary Rider'})
                    </td>
                    <td className="p-4 font-mono text-titanium-400">{alert.location || '11.0168, 76.9558'}</td>
                    <td className="p-4 text-titanium-400">
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Recent'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setEvidenceData(alert)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-cyan hover:bg-white/[0.08] text-[11px] font-medium transition-colors"
                      >
                        Evidence
                      </button>
                      {alert.status === 'CRITICAL' && (
                        <button
                          onClick={() => actions.onResolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded-lg bg-status-success/15 border border-status-success/30 text-status-success text-[11px] font-semibold hover:bg-status-success/25 transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
