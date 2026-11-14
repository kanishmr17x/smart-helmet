const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'sh_auth_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getWsUrl(token) {
  const explicit = (import.meta.env.VITE_WS_URL || '').replace(/\/$/, '');
  const activeToken = token || getToken();
  if (explicit) {
    const url = new URL(explicit.includes('://') ? explicit : ('ws://' + explicit));
    if (activeToken) url.searchParams.set('token', activeToken);
    return url.toString();
  }
  if (import.meta.env.DEV) {
    return 'ws://localhost:4000/ws?token=' + encodeURIComponent(activeToken);
  }
  const url = new URL(window.location.origin);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/ws';
  if (activeToken) url.searchParams.set('token', activeToken);
  return url.toString();
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
    ...(options.headers || {}),
  };

  const url = API_BASE + path;
  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    setToken('');
    window.dispatchEvent(new CustomEvent('sh:auth-expired'));
    throw new Error('Session expired or unauthorized');
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = (typeof data === 'object' && data?.error) ? data.error : ('HTTP error ' + response.status);
    throw new Error(message);
  }

  return data;
}

export const fetchHealth = async () => request('/api/health');

export const login = async (email, password) => {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.token) setToken(data.token);
  return data;
};

export const logout = () => {
  setToken('');
};

export const fetchMe = async () => {
  const data = await request('/api/auth/me');
  return data.user;
};

export const fetchTelemetry = async (deviceId = 'SH-0001') => {
  const data = await request('/api/telemetry?deviceId=' + encodeURIComponent(deviceId));
  return data.telemetry;
};

export const updateTelemetry = async (updates) => {
  const data = await request('/api/telemetry/update', {
    method: 'POST',
    body: JSON.stringify(updates),
  });
  return data.telemetry;
};

export const fetchAlerts = async () => {
  const data = await request('/api/alerts');
  return data.alerts || [];
};

export const createAlert = async (alertPayload) => {
  return request('/api/alerts', {
    method: 'POST',
    body: JSON.stringify(alertPayload),
  });
};

export const resolveAlert = async (alertId) => {
  return request('/api/alerts/' + encodeURIComponent(alertId) + '/resolve', {
    method: 'POST',
  });
};

export const fetchDevices = async () => {
  const data = await request('/api/devices');
  return data.devices || [];
};

export const fetchConfig = async () => {
  const data = await request('/api/config');
  return data.config || {};
};

export const saveSettings = async (settings) => {
  return request('/api/config/update', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
};

export const simulateImpact = async (magnitude = 6.8) => {
  return updateTelemetry({
    impactMagnitude: magnitude,
    tiltAngle: 48,
    online: true,
  });
};

export const simulateManualSOS = async () => {
  return createAlert({
    type: 'MANUAL_SOS',
    status: 'CRITICAL',
    deviceId: 'SH-0001',
    rider: 'Command Rider',
    sms: 'DISPATCHED',
  });
};

export const toggleHelmetWorn = async (currentWorn) => {
  return updateTelemetry({
    helmetWorn: !currentWorn,
  });
};

export const toggleNetworkDrop = async (currentOnline) => {
  return updateTelemetry({
    online: !currentOnline,
    networkAvailable: !currentOnline,
  });
};
