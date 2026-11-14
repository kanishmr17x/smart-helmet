import { useState } from 'react';
import { AlertOctagon, CheckCircle2, Filter, Phone, ShieldAlert, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-cyan uppercase tracking-widest">
            SAFETY LOG & DISPATCH ESCALATION
          </span>
          <h1 className="text-2xl font-black text-titanium-100 tracking-tight mt-0.5">
            Emergency Incidents & SOS History
          </h1>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                filterSeverity === sev
                  ? 'bg-cyan text-canvas shadow-cyan-sm'
                  : 'bg-canvas-card border border-canvas-border text-titanium-300 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Table */}
      <div className="helmet-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-canvas-subtle border-b border-canvas-border text-titanium-400 uppercase text-[10px]">
              <tr>
                <th className="p-4">Incident ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Unit / Rider</th>
                <th className="p-4">GPS Location</th>
                <th className="p-4">Timestamp</th>
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
                  <tr key={alert.id} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="p-4 font-bold text-cyan">{alert.id}</td>
                    <td className="p-4 font-semibold text-titanium-100">
                      {alert.type || 'CRASH_IMPACT'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          alert.status === 'CRITICAL'
                            ? 'bg-status-danger/20 border-status-danger text-status-danger'
                            : alert.status === 'RESOLVED'
                            ? 'bg-status-success/20 border-status-success text-status-success'
                            : 'bg-status-warning/20 border-status-warning text-status-warning'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="p-4 text-titanium-200">
                      {alert.deviceId} ({alert.rider || 'Aarav Nair'})
                    </td>
                    <td className="p-4 text-titanium-400">{alert.location || '11.0168, 76.9558'}</td>
                    <td className="p-4 text-titanium-400">
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Recent'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setEvidenceData(alert)}
                        className="px-2.5 py-1 rounded bg-canvas-elevated border border-canvas-border text-cyan hover:border-cyan text-[11px]"
                      >
                        Evidence
                      </button>
                      {alert.status === 'CRITICAL' && (
                        <button
                          onClick={() => actions.onResolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded bg-status-success/20 text-status-success text-[11px] font-bold hover:bg-status-success/30"
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
