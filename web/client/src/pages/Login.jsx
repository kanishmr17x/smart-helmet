import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@smarthelmet.local');
  const [password, setPassword] = useState('ChangeMeNow!123');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@smarthelmet.local');
    setPassword('ChangeMeNow!123');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-canvas p-4 tech-grid">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-canvas-border bg-canvas-card p-8 shadow-titanium">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-glow border border-cyan/40 text-cyan shadow-cyan-sm mb-3">
            <ShieldCheck className="h-8 w-8 text-cyan" />
          </div>
          <h1 className="text-2xl font-black text-titanium-100 tracking-tight uppercase">
            Smart<span className="text-cyan">Helmet</span> Command
          </h1>
          <p className="text-xs font-mono text-titanium-400 mt-1">
            AUTHORIZED TELEMETRY ACCESS ONLY
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-status-danger/20 border border-status-danger p-3 text-xs text-status-danger font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-titanium-400 block mb-1">
              OPERATOR EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-titanium-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-canvas-subtle border border-canvas-border rounded-xl text-sm text-titanium-100 focus:border-cyan outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-titanium-400 block mb-1">
              COMMAND PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-titanium-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-canvas-subtle border border-canvas-border rounded-xl text-sm text-titanium-100 focus:border-cyan outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-cyan text-canvas font-bold text-sm hover:bg-cyan-light transition-all shadow-cyan-sm active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'AUTHENTICATING...' : 'ACCESS COMMAND CONSOLE'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-canvas-border flex items-center justify-between text-xs font-mono">
          <span className="text-titanium-400">Default Credentials:</span>
          <button
            onClick={handleFillDemo}
            className="text-cyan font-bold hover:underline"
          >
            Fill Admin Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
