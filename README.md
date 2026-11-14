# Smart Helmet Central Command & IoT Safety Ecosystem

An intelligent, full-stack IoT safety and monitoring platform designed for modern motorcycle riders and fleet operators. The system integrates a real-time Android mobile application with an IoT Central Command web dashboard and telemetry server.

---

## 🌟 Key Features

### 1. 📱 Android Mobile Application (`app/`)
- **Helmet Wearing & Safety Monitoring**: Live tracking of "Worn / Not Worn" status and impact detection (MPU6050 simulation).
- **Emergency Flow & False-Alarm Cancellation**: 10-second interactive countdown modal to prevent accidental dispatches, followed by automated emergency escalation.
- **Emergency Dispatch Simulation**: Real-time GPS coordinates, automated SMS alert dispatch, and emergency contact calling sequence.
- **Device Health & Telemetry Dashboard**: Dark-mode IoT interface with gauges for Accelerometer, Tilt, Gyroscope, and status checklists for GPS, GSM, and battery.
- **Accident Evidence & Analytics**: ESP32-CAM simulated image evidence capture, rider safety scoring, and ride history logs.
- **Hardware Event Simulator**: On-screen simulation controls to trigger impacts, SOS signals, helmet removal, and network drops for testing.
- **Tech Stack**: Kotlin, Jetpack Compose, Material 3, Hilt (Dependency Injection), Room Database, DataStore Preferences, Coroutines & Flow, Navigation.

### 2. 🌐 Central Command Web Dashboard (`web/client`)
- **Live Fleet Telemetry & Mapping**: Interactive OpenStreetMap / Leaflet view tracking rider location and status.
- **Real-Time Alert Feed**: Instant notifications for SOS triggers, crash alerts, and device status changes via WebSockets.
- **Telemetry Charts & Gauges**: Recharts-powered telemetry trends (speed, tilt, g-force, battery).
- **Incident Dispatch Management**: Review triggered incidents, evidence photos, and dispatch emergency response teams.
- **Tech Stack**: React 18, Vite, Tailwind CSS, Lucide React, Leaflet, Recharts.

### 3. 🚀 Telemetry & Dispatch API (`web/server`)
- **RESTful Endpoints & WebSocket Server**: Low-latency bi-directional communication between helmets, mobile apps, and central monitoring stations.
- **Authentication & Security**: Secure JWT authentication, bcrypt password hashing, and express-rate-limit protection.
- **Database Support**: MongoDB Atlas integration with automatic in-memory fallback mode for zero-configuration local development.
- **Tech Stack**: Node.js (>=20), Express.js, Mongoose, WebSockets (`ws`), Helmet.js, Node test runner.

---

## 📁 Repository Structure

```
smart-helmet/
├── app/                  # Android application (Jetpack Compose & Kotlin)
│   ├── src/main/java/    # Android source code (UI screens, ViewModels, DI, Room DB)
│   ├── src/test/         # Android unit tests
│   └── build.gradle.kts  # Module Gradle build configuration
├── web/                  # Central Command full-stack application
│   ├── client/           # React + Vite frontend dashboard
│   ├── server/           # Express + WebSocket API & Node test suite
│   └── package.json      # Monorepo scripts
├── gradle/               # Gradle wrapper and version catalog (libs.versions.toml)
├── build.gradle.kts      # Root Gradle configuration
└── README.md             # Project documentation
```

---

## 🚦 Quick Start

### Prerequisites
- **Android**: Android Studio Meerkat or later / JDK 17+ / Android SDK (API 34+)
- **Web & Backend**: Node.js v20+ and npm

---

### Running the Web Server & Dashboard

#### 1. Start the API Server
```bash
cd web/server
npm install
npm run dev
```
> **Note**: For local development, `ALLOW_MEMORY_MODE=1` is supported out-of-the-box, allowing you to run without a local MongoDB instance. Default credentials are seeded as specified in `web/server/.env.example`.

#### 2. Start the Frontend Dashboard
```bash
cd web/client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to access the Central Command dashboard.

---

### Running Tests

#### Backend API Tests
```bash
cd web/server
npm test
```

#### Frontend Client Build & Lint
```bash
cd web/client
npm run build
npm run lint
```

#### Android Unit Tests
```bash
./gradlew test
```

---

## 🔒 Security & Best Practices
- Environment configurations are managed via `.env` files (see `.env.example` in `web/server` and `web/client`).
- Sensitive keys and local SDK paths (`local.properties`, `.env`) are excluded via `.gitignore`.
- Production WebSocket and REST routes require valid JWT tokens.
