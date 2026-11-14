import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HelmetProvider } from './context/HelmetContext';
import AppShell from './components/layout/AppShell';

import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import GpsTracking from './pages/GpsTracking';
import IncidentHistory from './pages/IncidentHistory';
import DeviceManager from './pages/DeviceManager';
import RideAnalytics from './pages/RideAnalytics';
import ProfileSettings from './pages/ProfileSettings';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-canvas text-cyan font-mono text-sm">
        INITIALIZING CENTRAL COMMAND LINK...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="monitoring" element={<LiveMonitoring />} />
              <Route path="tracking" element={<GpsTracking />} />
              <Route path="alerts" element={<IncidentHistory />} />
              <Route path="devices" element={<DeviceManager />} />
              <Route path="analytics" element={<RideAnalytics />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}
