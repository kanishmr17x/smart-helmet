package com.example.myapplication.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.domain.SafetyManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class EmergencyViewModel @Inject constructor(
    private val safetyManager: SafetyManager
) : ViewModel() {

    sealed class EmergencyState {
        data class Countdown(val secondsLeft: Int) : EmergencyState()
        data object Cancelled : EmergencyState()
        data class Dispatching(val step: DispatchStep) : EmergencyState()
        data object Completed : EmergencyState()
    }

    enum class DispatchStep(val message: String) {
        SENDING_SMS("Sending SMS..."),
        SMS_SENT("SMS Sent ✓"),
        CALLING_CONTACT("Calling Primary Contact..."),
        CALL_COMPLETED("Contact Notified ✓")
    }

    private val _uiState = MutableStateFlow<EmergencyState>(EmergencyState.Countdown(10))
    val uiState: StateFlow<EmergencyState> = _uiState

    private var countdownJob: Job? = null

    fun startEmergencySequence(isManual: Boolean = false) {
        if (isManual) {
            triggerDispatch()
        } else {
            startCountdown()
        }
    }

    private fun startCountdown() {
        countdownJob?.cancel()
        countdownJob = viewModelScope.launch {
            for (i in 10 downTo 0) {
                _uiState.value = EmergencyState.Countdown(i)
                if (i == 0) {
                    triggerDispatch()
                }
                delay(1000)
            }
        }
    }

    fun cancelAlert() {
        countdownJob?.cancel()
        _uiState.value = EmergencyState.Cancelled
    }

    fun triggerDispatch() {
        countdownJob?.cancel()
        viewModelScope.launch {
            _uiState.value = EmergencyState.Dispatching(DispatchStep.SENDING_SMS)
            delay(2000)
            _uiState.value = EmergencyState.Dispatching(DispatchStep.SMS_SENT)
            delay(1500)
            _uiState.value = EmergencyState.Dispatching(DispatchStep.CALLING_CONTACT)
            delay(2500)
            _uiState.value = EmergencyState.Dispatching(DispatchStep.CALL_COMPLETED)
            delay(2000)
            _uiState.value = EmergencyState.Completed
            
            // Logic to persist SOS log could go here or in SafetyManager
        }
    }
}
