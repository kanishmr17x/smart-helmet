package com.example.myapplication.ui.navigation

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

@Serializable
sealed class Route : NavKey {
    @Serializable
    data object Dashboard : Route()
    
    @Serializable
    data object History : Route()
    
    @Serializable
    data object Settings : Route()

    @Serializable
    data object Analytics : Route()

    @Serializable
    data class EmergencyFlow(
        val impactMagnitude: Float,
        val latitude: Double,
        val longitude: Double,
        val isManual: Boolean = false
    ) : Route()

    @Serializable
    data class EvidenceViewer(val incidentId: Long) : Route()
}
