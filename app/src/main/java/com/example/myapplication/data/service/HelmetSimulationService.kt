package com.example.myapplication.data.service

import com.example.myapplication.data.model.HelmetTelemetry
import com.example.myapplication.data.model.ModuleStatus
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.atan2
import kotlin.math.sqrt
import kotlin.random.Random

@Singleton
class HelmetSimulationService @Inject constructor() {

    private val scope = CoroutineScope(Dispatchers.Default)
    private val isWorn = MutableStateFlow(true)
    private val isOnline = MutableStateFlow(true)
    private val manualImpactTrigger = MutableStateFlow(false)
    
    private val _telemetry = MutableStateFlow<HelmetTelemetry?>(null)
    val telemetry: StateFlow<HelmetTelemetry?> = _telemetry.asStateFlow()

    init {
        startSimulation()
    }

    private fun startSimulation() {
        scope.launch {
            var battery = 85
            while (true) {
                val impact = if (manualImpactTrigger.value) {
                    manualImpactTrigger.value = false
                    15.0f
                } else if (Random.nextFloat() > 0.99f) {
                    Random.nextFloat() * 5f
                } else {
                    Random.nextFloat() * 0.2f
                }

                val ax = Random.nextFloat() * 2 - 1
                val ay = Random.nextFloat() * 2 - 1
                val az = 9.8f + (Random.nextFloat() * 2 - 1)
                val tilt = Math.toDegrees(atan2(sqrt(ax * ax + ay * ay).toDouble(), az.toDouble())).toFloat()

                _telemetry.value = HelmetTelemetry(
                    accelX = ax,
                    accelY = ay,
                    accelZ = az,
                    gyroX = Random.nextFloat() * 10 - 5,
                    gyroY = Random.nextFloat() * 10 - 5,
                    gyroZ = Random.nextFloat() * 10 - 5,
                    tiltAngle = tilt,
                    latitude = 37.7749 + (Random.nextDouble() - 0.5) * 0.001,
                    longitude = -122.4194 + (Random.nextDouble() - 0.5) * 0.001,
                    batteryLevel = battery,
                    isOnline = isOnline.value,
                    isWorn = isWorn.value,
                    impactMagnitude = impact,
                    moduleStatus = ModuleStatus(
                        mpu6050 = true,
                        gps = isOnline.value,
                        gsm = isOnline.value,
                        oled = true,
                        touchSensor = true
                    )
                )

                if (Random.nextFloat() > 0.95f && battery > 0) battery--
                delay(1000)
            }
        }
    }

    fun toggleWornState() {
        isWorn.update { !it }
    }

    fun toggleNetworkState() {
        isOnline.update { !it }
    }

    fun triggerSimulatedImpact() {
        manualImpactTrigger.value = true
    }

    // Deprecated, use telemetry property instead. Keeping for backward compatibility if needed temporarily.
    fun getTelemetryStream(): Flow<HelmetTelemetry> = telemetry.filterNotNull()
}
