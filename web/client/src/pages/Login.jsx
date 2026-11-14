import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
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
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@smarthelmet.local');
    setPassword('ChangeMeNow!123');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-canvas p-4 tech-grid relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-canvas-border bg-canvas-card/90 backdrop-blur-xl p-8 shadow-card">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan/20 to-primary/20 border border-cyan/30 text-cyan shadow-cyan-sm mb-4">
            <ShieldCheck className="h-6 w-6 text-cyan" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Smart<span className="text-cyan">Helmet</span> Command Center
          </h1>
          <p className="text-xs text-titanium-400 mt-1">
            Sign in to access real-time telemetry and dispatch
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 rounded-xl bg-status-danger/10 border border-status-danger/30 p-3 text-xs text-status-danger font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-titanium-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-titanium-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@organization.com"
                className="w-full pl-10 pr-4 py-2.5 bg-canvas-subtle/80 border border-canvas-border rounded-xl text-sm text-white focus:border-cyan/60 focus:bg-canvas-subtle outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-titanium-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-titanium-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-canvas-subtle/80 border border-canvas-border rounded-xl text-sm text-white focus:border-cyan/60 focus:bg-canvas-subtle outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan to-primary hover:from-cyan-light hover:to-primary/90 text-canvas font-bold text-sm transition-all shadow-cyan-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to Console'}</span>
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-canvas-border flex items-center justify-between text-xs text-titanium-400">
          <span>Demo Account</span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-cyan font-medium hover:underline cursor-pointer"
          >
            Auto-fill Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
