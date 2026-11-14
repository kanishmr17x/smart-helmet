package com.example.myapplication.domain

import com.example.myapplication.data.local.datastore.AppSettingsManager
import com.example.myapplication.data.local.db.SosDao
import com.example.myapplication.data.model.HelmetTelemetry
import com.example.myapplication.data.model.SosLog
import com.example.myapplication.data.service.HelmetSimulationService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SafetyManager @Inject constructor(
    private val simulationService: HelmetSimulationService,
    private val appSettingsManager: AppSettingsManager,
    private val sosDao: SosDao
) {
    private val _safetyEvents = MutableSharedFlow<SafetyEvent>()
    val safetyEvents: SharedFlow<SafetyEvent> = _safetyEvents.asSharedFlow()

    private val scope = CoroutineScope(Dispatchers.IO)

    init {
        startMonitoring()
    }

    private fun startMonitoring() {
        scope.launch {
            combine(
                simulationService.getTelemetryStream(),
                appSettingsManager.impactSensitivity,
                appSettingsManager.autoSosEnabled
            ) { telemetry, sensitivity, autoSos ->
                Triple(telemetry, sensitivity, autoSos)
            }.collectLatest { (telemetry, sensitivity, autoSos) ->
                checkImpact(telemetry, sensitivity, autoSos)
            }
        }
    }

    private suspend fun checkImpact(telemetry: HelmetTelemetry, sensitivity: Float, autoSos: Boolean) {
        if (telemetry.impactMagnitude > sensitivity) {
            _safetyEvents.emit(SafetyEvent.ImpactDetected(telemetry.impactMagnitude, telemetry))
            
            // We'll let the UI handle the 10s countdown before triggering actual SOS
            // if (autoSos) {
            //     triggerSos(telemetry, "IMPACT_DETECTED")
            // }
        }
    }

    suspend fun triggerSos(telemetry: HelmetTelemetry, reason: String) {
        val log = SosLog(
            timestamp = System.currentTimeMillis(),
            latitude = telemetry.latitude,
            longitude = telemetry.longitude,
            reason = reason,
            status = "SENT"
        )
        sosDao.insertSosLog(log)
        _safetyEvents.emit(SafetyEvent.SosTriggered(log))
    }
}

sealed class SafetyEvent {
    data class ImpactDetected(val magnitude: Float, val telemetry: HelmetTelemetry) : SafetyEvent()
    data class SosTriggered(val log: SosLog) : SafetyEvent()
}
