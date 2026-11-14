import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  createAlert,
  fetchAlerts,
  fetchConfig,
  fetchDevices,
  fetchTelemetry,
  getToken,
  getWsUrl,
  resolveAlert as apiResolveAlert,
  saveSettings,
  simulateImpact as apiSimulateImpact,
  simulateManualSOS as apiSimulateManualSOS,
  toggleHelmetWorn as apiToggleHelmetWorn,
  toggleNetworkDrop as apiToggleNetworkDrop,
  updateTelemetry,
} from '../services/api';
import { useAuth } from './AuthContext';

const HelmetContext = createContext(null);

const DEFAULT_TELEMETRY = {
  deviceId: 'SH-0001',
  riderName: 'Command Operator',
  status: 'ACTIVE',
  online: true,
  battery: 84,
  batteryLevel: 84,
  lastSeenSecondsAgo: 1,
  gpsFix: true,
  satellites: 14,
  latitude: 11.0168,
  longitude: 76.9558,
  accuracy: 3.2,
  impactMagnitude: 1.15,
  tiltAngle: 28,
  gyroscope: { x: 3.4, y: 1.2, z: 5.6 },
  accelerometer: { x: 0.85, y: 0.12, z: 9.81 },
  helmetWorn: true,
  networkAvailable: true,
  lastKnownLocation: '11.0168, 76.9558',
  modules: {
    mpu6050: true,
    gps: true,
    gsm: true,
    oled: true,
    touchSensor: true,
  },
};

export function HelmetProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [activeDeviceId, setActiveDeviceId] = useState('SH-0001');
  const [telemetry, setTelemetry] = useState(DEFAULT_TELEMETRY);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [settings, setSettings] = useState({
    sensitivity: 'medium',
    primaryContact: '+91 98765 43210',
    secondaryContact: '+91 91234 56789',
    familyContact: '+91 99887 66554',
    buzzersEnabled: true,
    alertVolume: 'high',
    autoDispatch: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsStatus, setWsStatus] = useState('connecting'); // 'connecting' | 'connected' | 'disconnected'

  // Emergency Modal State
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyDetails, setEmergencyDetails] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const countdownTimerRef = useRef(null);

  // Evidence Modal State
  const [evidenceData, setEvidenceData] = useState(null);

  // 1. Initial Data Fetch
  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setError(null);
      const [tel, altList, devList, cfg] = await Promise.all([
        fetchTelemetry(activeDeviceId).catch(() => DEFAULT_TELEMETRY),
        fetchAlerts().catch(() => []),
        fetchDevices().catch(() => []),
        fetchConfig().catch(() => ({})),
      ]);

      if (tel) {
        setTelemetry(tel);
        setTelemetryHistory((prev) => [...prev, { ...tel, time: new Date().toLocaleTimeString() }].slice(-30));
      }
      setAlerts(altList || []);
      setDevices(devList || []);
      if (cfg && Object.keys(cfg).length > 0) {
        setSettings((prev) => ({ ...prev, ...cfg }));
      }
    } catch (err) {
      setError(err.message || 'Failed to synchronize with Smart Helmet backend');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, activeDeviceId]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // 2. WebSocket Realtime Sync
  useEffect(() => {
    if (!isAuthenticated) {
      setWsStatus('disconnected');
      return;
    }

    const token = getToken();
    const wsUrl = getWsUrl(token);
    let socket = null;
    let reconnectTimeout = null;
    let active = true;

    function connect() {
      if (!active) return;
      setWsStatus('connecting');
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        if (!active) return;
        setWsStatus('connected');
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.event === 'telemetry' && msg.data) {
            setTelemetry((prev) => {
              const updated = { ...prev, ...msg.data };
              setTelemetryHistory((h) => [...h, { ...updated, time: new Date().toLocaleTimeString() }].slice(-30));
              return updated;
            });
            // Check impact threshold
            if (msg.data.impactMagnitude && msg.data.impactMagnitude > 4.5) {
              triggerEmergencyFlow('CRITICAL_IMPACT', msg.data);
            }
          } else if (msg.event === 'alert' && msg.data) {
            setAlerts((prev) => [msg.data, ...prev.filter((a) => a.id !== msg.data.id)].slice(0, 50));
            if (msg.data.status === 'CRITICAL') {
              triggerEmergencyFlow(msg.data.type || 'CRITICAL_ALERT', msg.data);
            }
          }
        } catch {}
      };

      socket.onerror = () => {
        if (active) setWsStatus('disconnected');
      };

      socket.onclose = () => {
        if (active) {
          setWsStatus('disconnected');
          reconnectTimeout = setTimeout(connect, 3500);
        }
      };
    }

    connect();

    // Fallback Polling in case WebSocket is blocked or disconnected
    const pollInterval = setInterval(() => {
      fetchTelemetry(activeDeviceId)
        .then((tel) => {
          if (tel) {
            setTelemetry(tel);
            setTelemetryHistory((h) => [...h, { ...tel, time: new Date().toLocaleTimeString() }].slice(-30));
          }
        })
        .catch(() => {});
    }, 6000);

    return () => {
      active = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
      clearInterval(pollInterval);
    };
  }, [isAuthenticated, activeDeviceId]);

  // 3. Emergency Verification Countdown Flow
  const triggerEmergencyFlow = useCallback((reason, data) => {
    setEmergencyDetails({ reason, data, timestamp: new Date() });
    setCountdown(10);
    setEmergencyModalOpen(true);

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          handleAutoDispatchEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleAutoDispatchEmergency = useCallback(async () => {
    try {
      const result = await createAlert({
        type: 'AUTO_DISPATCH_CONFIRMED',
        status: 'CRITICAL',
        deviceId: activeDeviceId,
        rider: telemetry.riderName || 'Command Rider',
        location: `${telemetry.latitude}, ${telemetry.longitude}`,
        sms: 'DISPATCHED_TO_EMS',
      });
      if (result?.alert) {
        setAlerts((prev) => [result.alert, ...prev]);
      }
    } catch {}
  }, [activeDeviceId, telemetry]);

  const handleEmergencyCancel = useCallback(async () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setEmergencyModalOpen(false);
    try {
      const result = await createAlert({
        type: 'FALSE_ALARM_CANCELLED',
        status: 'INFO',
        deviceId: activeDeviceId,
        rider: telemetry.riderName || 'Command Rider',
        location: `${telemetry.latitude}, ${telemetry.longitude}`,
        sms: 'CANCELLED_BY_RIDER',
      });
      if (result?.alert) {
        setAlerts((prev) => [result.alert, ...prev]);
      }
    } catch {}
  }, [activeDeviceId, telemetry]);

  const handleEmergencyConfirm = useCallback(async () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setEmergencyModalOpen(false);
    await handleAutoDispatchEmergency();
  }, [handleAutoDispatchEmergency]);

  // 4. Action Handlers
  const handleSimulateImpact = useCallback(async () => {
    triggerEmergencyFlow('SIMULATED_HIGH_IMPACT', { magnitude: 7.2 });
    await apiSimulateImpact(7.2);
  }, [triggerEmergencyFlow]);

  const handleSimulateSOS = useCallback(async () => {
    triggerEmergencyFlow('MANUAL_SOS_TRIGGERED', { manual: true });
    await apiSimulateManualSOS();
  }, [triggerEmergencyFlow]);

  const handleToggleHelmet = useCallback(async () => {
    const updated = await apiToggleHelmetWorn(telemetry.helmetWorn);
    if (updated) setTelemetry((prev) => ({ ...prev, ...updated }));
  }, [telemetry.helmetWorn]);

  const handleToggleNetwork = useCallback(async () => {
    const updated = await apiToggleNetworkDrop(telemetry.online);
    if (updated) setTelemetry((prev) => ({ ...prev, ...updated }));
  }, [telemetry.online]);

  const handleResolveAlert = useCallback(async (alertId) => {
    await apiResolveAlert(alertId);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED', sms: 'RESOLVED' } : a))
    );
  }, []);

  const handleSaveSettings = useCallback(async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    await saveSettings(merged);
  }, [settings]);

  const value = useMemo(
    () => ({
      activeDeviceId,
      setActiveDeviceId,
      telemetry,
      telemetryHistory,
      alerts,
      devices,
      settings,
      loading,
      error,
      wsStatus,
      isEmergencyModalOpen,
      emergencyDetails,
      countdown,
      evidenceData,
      setEvidenceData,
      refreshAll,
      actions: {
        onImpact: handleSimulateImpact,
        onManualSOS: handleSimulateSOS,
        onToggleHelmet: handleToggleHelmet,
        onToggleNetwork: handleToggleNetwork,
        onResolveAlert: handleResolveAlert,
        onEmergencyCancel: handleEmergencyCancel,
        onEmergencyConfirm: handleEmergencyConfirm,
        onSaveSettings: handleSaveSettings,
      },
    }),
    [
      activeDeviceId,
      telemetry,
      telemetryHistory,
      alerts,
      devices,
      settings,
      loading,
      error,
      wsStatus,
      isEmergencyModalOpen,
      emergencyDetails,
      countdown,
      evidenceData,
      refreshAll,
      handleSimulateImpact,
      handleSimulateSOS,
      handleToggleHelmet,
      handleToggleNetwork,
      handleResolveAlert,
      handleEmergencyCancel,
      handleEmergencyConfirm,
      handleSaveSettings,
    ]
  );

  return <HelmetContext.Provider value={value}>{children}</HelmetContext.Provider>;
}

export function useHelmet() {
  const ctx = useContext(HelmetContext);
  if (!ctx) throw new Error('useHelmet must be used inside HelmetProvider');
  return ctx;
}
