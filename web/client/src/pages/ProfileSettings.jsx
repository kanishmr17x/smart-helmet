import { useState } from 'react';
import { Save, ShieldCheck, User } from 'lucide-react';
import { useHelmet } from '../context/HelmetContext';

export default function ProfileSettings() {
  const { settings, actions } = useHelmet();
  const [formData, setFormData] = useState(settings);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await actions.onSaveSettings(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-canvas-border pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-cyan tracking-wide">
            Preferences & Hardware
          </span>
          <span className="text-titanium-400 text-xs">•</span>
          <span className="text-xs text-titanium-400">Emergency Protocol</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          System Settings & Escalation
        </h1>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-status-success/10 border border-status-success/30 p-4 text-xs font-medium text-status-success shadow-sm">
          <ShieldCheck className="h-5 w-5 text-status-success" />
          <span>Hardware parameters updated successfully across telemetry fleet.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="helmet-card p-7 space-y-7">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">
            Impact Sensitivity Threshold
          </h3>
          <p className="text-xs text-titanium-400 mb-4">
            Determines the G-force trigger level for the 10-second automatic emergency countdown.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {['low', 'medium', 'high'].map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setFormData({ ...formData, sensitivity: lvl })}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                  formData.sensitivity === lvl
                    ? 'border-cyan/50 bg-cyan/10 text-cyan shadow-sm'
                    : 'border-canvas-border bg-canvas-subtle/80 text-titanium-400 hover:text-white'
                }`}
              >
                <span className="capitalize block">{lvl}</span>
                <span className="text-[11px] font-mono text-titanium-400">
                  {lvl === 'low' ? '6.0G Peak' : lvl === 'medium' ? '4.5G Peak' : '3.0G Peak'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-canvas-border pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            Automated Escalation Contacts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-titanium-400 block mb-1.5 font-medium">Primary Dispatch Contact</label>
              <input
                type="text"
                value={formData.primaryContact || ''}
                onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
                className="w-full bg-canvas-subtle/80 border border-canvas-border rounded-xl p-3 text-white focus:border-cyan/60 outline-none font-mono transition-colors"
              />
            </div>

            <div>
              <label className="text-titanium-400 block mb-1.5 font-medium">Secondary Dispatch Contact</label>
              <input
                type="text"
                value={formData.secondaryContact || ''}
                onChange={(e) => setFormData({ ...formData, secondaryContact: e.target.value })}
                className="w-full bg-canvas-subtle/80 border border-canvas-border rounded-xl p-3 text-white focus:border-cyan/60 outline-none font-mono transition-colors"
              />
            </div>

            <div>
              <label className="text-titanium-400 block mb-1.5 font-medium">Family Notification Contact</label>
              <input
                type="text"
                value={formData.familyContact || ''}
                onChange={(e) => setFormData({ ...formData, familyContact: e.target.value })}
                className="w-full bg-canvas-subtle/80 border border-canvas-border rounded-xl p-3 text-white focus:border-cyan/60 outline-none font-mono transition-colors"
              />
            </div>

            <div>
              <label className="text-titanium-400 block mb-1.5 font-medium">Audible Buzzer Level</label>
              <select
                value={formData.alertVolume || 'high'}
                onChange={(e) => setFormData({ ...formData, alertVolume: e.target.value })}
                className="w-full bg-canvas-subtle/80 border border-canvas-border rounded-xl p-3 text-white focus:border-cyan/60 outline-none transition-colors"
              >
                <option value="high">High (85 dB Warning)</option>
                <option value="medium">Medium (70 dB Chime)</option>
                <option value="low">Low (55 dB Discrete)</option>
                <option value="silent">Silent (LED Indicator Only)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-canvas-border flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan text-canvas font-bold text-xs hover:bg-cyan-light transition-all shadow-cyan-sm active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
