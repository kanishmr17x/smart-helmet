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
      <div className="border-b border-canvas-border pb-4">
        <span className="font-mono text-xs font-bold text-cyan uppercase tracking-widest">
          HARDWARE & CONTACT CONFIGURATION
        </span>
        <h1 className="text-2xl font-black text-titanium-100 tracking-tight mt-0.5">
          System Settings & Emergency Escalation
        </h1>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-status-success/20 border border-status-success p-4 text-xs font-bold text-status-success">
          <ShieldCheck className="h-5 w-5" />
          <span>Hardware configuration updated on Smart Helmet Central Command!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="helmet-card p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-titanium-100 mb-1">
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
                className={`p-3 rounded-lg border font-mono text-xs uppercase font-bold transition-all ${
                  formData.sensitivity === lvl
                    ? 'border-cyan bg-cyan/15 text-cyan shadow-cyan-sm'
                    : 'border-canvas-border bg-canvas-subtle text-titanium-400'
                }`}
              >
                {lvl} ({lvl === 'low' ? '6.0G' : lvl === 'medium' ? '4.5G' : '3.0G'})
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-canvas-border pt-4 space-y-4">
          <h3 className="text-base font-bold text-titanium-100">
            Automated SMS & Call Escalation Contacts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-titanium-400 block mb-1">PRIMARY EMERGENCY CONTACT</label>
              <input
                type="text"
                value={formData.primaryContact || ''}
                onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg p-3 text-titanium-100 focus:border-cyan outline-none"
              />
            </div>

            <div>
              <label className="text-titanium-400 block mb-1">SECONDARY EMERGENCY CONTACT</label>
              <input
                type="text"
                value={formData.secondaryContact || ''}
                onChange={(e) => setFormData({ ...formData, secondaryContact: e.target.value })}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg p-3 text-titanium-100 focus:border-cyan outline-none"
              />
            </div>

            <div>
              <label className="text-titanium-400 block mb-1">FAMILY NOTIFICATION CONTACT</label>
              <input
                type="text"
                value={formData.familyContact || ''}
                onChange={(e) => setFormData({ ...formData, familyContact: e.target.value })}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg p-3 text-titanium-100 focus:border-cyan outline-none"
              />
            </div>

            <div>
              <label className="text-titanium-400 block mb-1">AUDIBLE BUZZER VOLUME</label>
              <select
                value={formData.alertVolume || 'high'}
                onChange={(e) => setFormData({ ...formData, alertVolume: e.target.value })}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg p-3 text-titanium-100 focus:border-cyan outline-none"
              >
                <option value="low">Low (60 dB)</option>
                <option value="medium">Medium (80 dB)</option>
                <option value="high">High (105 dB Siren)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-canvas-border flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan text-canvas font-bold text-sm hover:bg-cyan-light transition-all shadow-cyan-sm"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
