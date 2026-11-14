package com.example.myapplication.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.rounded.Call
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Sms
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapplication.ui.viewmodel.EmergencyViewModel
import com.example.myapplication.ui.viewmodel.EmergencyViewModel.EmergencyState
import com.example.myapplication.ui.viewmodel.EmergencyViewModel.DispatchStep

@Composable
fun EmergencyFlowScreen(
    impactMagnitude: Float,
    latitude: Double,
    longitude: Double,
    isManual: Boolean = false,
    onDismiss: () -> Unit,
    viewModel: EmergencyViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.startEmergencySequence(isManual)
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.95f)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            when (val state = uiState) {
                is EmergencyState.Countdown -> {
                    CountdownContent(
                        secondsLeft = state.secondsLeft,
                        impactMagnitude = impactMagnitude,
                        onCancel = { viewModel.cancelAlert() }
                    )
                }
                is EmergencyState.Dispatching -> {
                    DispatchingContent(state.step, latitude, longitude)
                }
                EmergencyState.Cancelled -> {
                    LaunchedEffect(Unit) {
                        onDismiss()
                    }
                }
                EmergencyState.Completed -> {
                    LaunchedEffect(Unit) {
                        onDismiss()
                    }
                }
            }
        }
    }
}

@Composable
fun CountdownContent(
    secondsLeft: Int,
    impactMagnitude: Float,
    onCancel: () -> Unit
) {
    Icon(
        imageVector = Icons.Default.Warning,
        contentDescription = null,
        tint = MaterialTheme.colorScheme.error,
        modifier = Modifier.size(80.dp)
    )
    
    Spacer(modifier = Modifier.height(24.dp))
    
    Text(
        text = "IMPACT DETECTED!",
        style = MaterialTheme.typography.headlineLarge,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.onErrorContainer
    )
    
    Text(
        text = "Magnitude: ${String.format("%.1f", impactMagnitude)} G",
        style = MaterialTheme.typography.bodyLarge,
        color = MaterialTheme.colorScheme.onErrorContainer
    )
    
    Spacer(modifier = Modifier.height(48.dp))
    
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .size(200.dp)
            .clip(CircleShape)
            .background(MaterialTheme.colorScheme.error.copy(alpha = 0.1f))
    ) {
        CircularProgressIndicator(
            progress = { secondsLeft / 10f },
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.error,
            strokeWidth = 12.dp,
            trackColor = MaterialTheme.colorScheme.error.copy(alpha = 0.2f),
        )
        Text(
            text = "$secondsLeft",
            style = MaterialTheme.typography.displayLarge,
            fontWeight = FontWeight.Black,
            color = MaterialTheme.colorScheme.onErrorContainer
        )
    }
    
    Spacer(modifier = Modifier.height(64.dp))
    
    Button(
        onClick = onCancel,
        modifier = Modifier
            .fillMaxWidth()
            .height(64.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.onErrorContainer,
            contentColor = MaterialTheme.colorScheme.errorContainer
        )
    ) {
        Text(
            text = "CANCEL ALERT",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun DispatchingContent(step: DispatchStep, latitude: Double, longitude: Double) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        val icon = when (step) {
            DispatchStep.SENDING_SMS -> Icons.Rounded.Sms
            DispatchStep.SMS_SENT -> Icons.Rounded.CheckCircle
            DispatchStep.CALLING_CONTACT -> Icons.Rounded.Call
            DispatchStep.CALL_COMPLETED -> Icons.Rounded.CheckCircle
        }

        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onErrorContainer,
            modifier = Modifier.size(100.dp)
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Text(
            text = step.message,
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onErrorContainer,
            textAlign = TextAlign.Center
        )

        if (step == DispatchStep.SENDING_SMS || step == DispatchStep.SMS_SENT) {
            Spacer(modifier = Modifier.height(24.dp))
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.1f)
                ),
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "SMS Preview: \"Emergency! Impact detected at [Lat: ${String.format("%.4f", latitude)}, Long: ${String.format("%.4f", longitude)}]. Rider needs assistance immediately.\"",
                    modifier = Modifier.padding(16.dp),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onErrorContainer
                )
            }
        }
    }
}
