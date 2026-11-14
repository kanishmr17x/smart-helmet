package com.example.myapplication.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.model.HelmetTelemetry
import com.example.myapplication.data.service.HelmetSimulationService
import com.example.myapplication.domain.SafetyManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val simulationService: HelmetSimulationService,
    private val safetyManager: SafetyManager
) : ViewModel() {

    val telemetry: StateFlow<HelmetTelemetry?> = simulationService.telemetry

    fun simulateImpact() {
        simulationService.triggerSimulatedImpact()
    }

    fun toggleWornState() {
        simulationService.toggleWornState()
    }

    fun toggleNetworkState() {
        simulationService.toggleNetworkState()
    }

    fun triggerManualSos() {
        viewModelScope.launch {
            telemetry.value?.let {
                safetyManager.triggerSos(it, "MANUAL_SOS")
            }
        }
    }
}
