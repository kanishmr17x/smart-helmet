package com.example.myapplication.data.model

data class HelmetTelemetry(
    val accelX: Float,
    val accelY: Float,
    val accelZ: Float,
    val gyroX: Float,
    val gyroY: Float,
    val gyroZ: Float,
    val tiltAngle: Float,
    val latitude: Double,
    val longitude: Double,
    val batteryLevel: Int,
    val isOnline: Boolean,
    val isWorn: Boolean,
    val impactMagnitude: Float,
    val moduleStatus: ModuleStatus
)

data class ModuleStatus(
    val mpu6050: Boolean = true,
    val gps: Boolean = true,
    val gsm: Boolean = true,
    val oled: Boolean = true,
    val touchSensor: Boolean = true
)
