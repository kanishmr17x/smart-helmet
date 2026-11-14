package com.example.myapplication.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.RotateRight
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapplication.data.model.HelmetTelemetry
import com.example.myapplication.data.model.ModuleStatus
import com.example.myapplication.ui.theme.NeonCyan
import com.example.myapplication.ui.theme.NeonGreen
import com.example.myapplication.ui.theme.NeonPurple
import com.example.myapplication.ui.theme.NeonRed
import com.example.myapplication.ui.viewmodel.DashboardViewModel
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onNavigateToHistory: () -> Unit,
    onNavigateToAnalytics: () -> Unit,
    onNavigateToSettings: () -> Unit,
    viewModel: DashboardViewModel = viewModel()
) {
    val telemetry by viewModel.telemetry.collectAsState()

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "COMMAND CENTER",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            letterSpacing = 2.sp
                        ),
                        color = NeonCyan
                    )
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.Transparent
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.8f),
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 24.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .border(1.dp, NeonCyan.copy(alpha = 0.2f), RoundedCornerShape(24.dp))
            ) {
                NavigationBarItem(
                    selected = true,
                    onClick = { /* Already on Dashboard */ },
                    icon = { Icon(Icons.Rounded.Dashboard, contentDescription = "Dashboard") },
                    label = { Text("Dashboard") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = NeonCyan,
                        selectedTextColor = NeonCyan,
                        indicatorColor = NeonCyan.copy(alpha = 0.1f)
                    )
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToAnalytics,
                    icon = { Icon(Icons.Rounded.Analytics, contentDescription = "Analytics") },
                    label = { Text("Analytics") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToHistory,
                    icon = { Icon(Icons.Rounded.History, contentDescription = "History") },
                    label = { Text("History") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToSettings,
                    icon = { Icon(Icons.Rounded.Settings, contentDescription = "Settings") },
                    label = { Text("Settings") }
                )
            }
        }
    ) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            // Background Glow
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .blur(100.dp)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(NeonCyan.copy(alpha = 0.05f), Color.Transparent),
                            radius = 1000f
                        )
                    )
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                // Live Status Indicators
                StatusHeader(telemetry)

                // Telemetry Gauges
                TelemetrySection(telemetry)

                // Module Health Checklist
                ModuleHealthSection(telemetry?.moduleStatus)

                // Simulator Controls
                SimulationActionBar(
                    onSimulateImpact = viewModel::simulateImpact,
                    onSimulateSos = viewModel::triggerManualSos,
                    onToggleWorn = viewModel::toggleWornState,
                    onToggleNetwork = viewModel::toggleNetworkState
                )
                
                Spacer(modifier = Modifier.height(80.dp))
            }

            // Alerts Overlay
            AlertsOverlay(telemetry)
        }
    }
}

@Composable
fun StatusHeader(telemetry: HelmetTelemetry?) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.5f))
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        StatusIndicator(
            label = "NETWORK",
            status = if (telemetry?.isOnline == true) "ONLINE" else "OFFLINE",
            icon = if (telemetry?.isOnline == true) Icons.Rounded.Wifi else Icons.Rounded.WifiOff,
            color = if (telemetry?.isOnline == true) NeonGreen else NeonRed
        )
        VerticalDivider(modifier = Modifier.height(40.dp), color = Color.Gray.copy(alpha = 0.3f))
        StatusIndicator(
            label = "HELMET",
            status = if (telemetry?.isWorn == true) "WORN" else "NOT WORN",
            icon = Icons.Rounded.Person,
            color = if (telemetry?.isWorn == true) NeonCyan else NeonRed
        )
        VerticalDivider(modifier = Modifier.height(40.dp), color = Color.Gray.copy(alpha = 0.3f))
        StatusIndicator(
            label = "BATTERY",
            status = "${telemetry?.batteryLevel ?: 0}%",
            icon = when {
                (telemetry?.batteryLevel ?: 0) > 80 -> Icons.Rounded.BatteryFull
                (telemetry?.batteryLevel ?: 0) > 20 -> Icons.Rounded.Battery4Bar
                else -> Icons.Rounded.BatteryAlert
            },
            color = when {
                (telemetry?.batteryLevel ?: 0) > 20 -> NeonGreen
                else -> NeonRed
            }
        )
    }
}

@Composable
fun StatusIndicator(label: String, status: String, icon: ImageVector, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(24.dp))
        Text(label, style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp), color = Color.Gray)
        Text(
            status,
            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
            color = color
        )
    }
}

@Composable
fun TelemetrySection(telemetry: HelmetTelemetry?) {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SectionTitle("TELEMETRY", NeonCyan)
        
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            TelemetryGaugeCard(
                modifier = Modifier.weight(1f),
                title = "ACCEL (X,Y,Z)",
                value = String.format(Locale.US, "%.1f, %.1f, %.1f", telemetry?.accelX ?: 0f, telemetry?.accelY ?: 0f, telemetry?.accelZ ?: 0f),
                icon = Icons.Rounded.Speed,
                color = NeonCyan,
                progress = (telemetry?.impactMagnitude ?: 0f) / 10f
            )
            TelemetryGaugeCard(
                modifier = Modifier.weight(1f),
                title = "GYRO (X,Y,Z)",
                value = String.format(Locale.US, "%.0f, %.0f, %.0f", telemetry?.gyroX ?: 0f, telemetry?.gyroY ?: 0f, telemetry?.gyroZ ?: 0f),
                icon = Icons.AutoMirrored.Rounded.RotateRight,
                color = NeonPurple,
                progress = 0.5f
            )
        }
        
        TelemetryGaugeCard(
            modifier = Modifier.fillMaxWidth(),
            title = "TILT ANGLE",
            value = String.format(Locale.US, "%.1f°", telemetry?.tiltAngle ?: 0f),
            icon = Icons.Rounded.ScreenRotation,
            color = NeonGreen,
            isWide = true,
            progress = (telemetry?.tiltAngle ?: 0f) / 90f
        )
    }
}

@Composable
fun TelemetryGaugeCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    icon: ImageVector,
    color: Color,
    progress: Float,
    isWide: Boolean = false
) {
    Surface(
        modifier = modifier
            .border(1.dp, color.copy(alpha = 0.2f), RoundedCornerShape(16.dp))
            .clip(RoundedCornerShape(16.dp)),
        color = MaterialTheme.colorScheme.surface.copy(alpha = 0.7f),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(if (isWide) 28.dp else 20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(title, style = MaterialTheme.typography.labelSmall, color = Color.Gray)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                value,
                style = if (isWide) MaterialTheme.typography.headlineSmall else MaterialTheme.typography.bodyLarge,
                color = color,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            LinearProgressIndicator(
                progress = { progress.coerceIn(0f, 1f) },
                modifier = Modifier.fillMaxWidth().height(4.dp).clip(CircleShape),
                color = color,
                trackColor = color.copy(alpha = 0.1f)
            )
        }
    }
}

@Composable
fun ModuleHealthSection(status: ModuleStatus?) {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SectionTitle("MODULE HEALTH", NeonGreen)
        
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier.height(140.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            userScrollEnabled = false
        ) {
            item { HealthItem("MPU6050", status?.mpu6050 ?: false) }
            item { HealthItem("GPS", status?.gps ?: false) }
            item { HealthItem("GSM", status?.gsm ?: false) }
            item { HealthItem("OLED", status?.oled ?: false) }
            item { HealthItem("TOUCH", status?.touchSensor ?: false) }
        }
    }
}

@Composable
fun HealthItem(label: String, isOk: Boolean) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = if (isOk) NeonGreen.copy(alpha = 0.05f) else NeonRed.copy(alpha = 0.05f),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, if (isOk) NeonGreen.copy(alpha = 0.3f) else NeonRed.copy(alpha = 0.3f))
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                if (isOk) Icons.Rounded.CheckCircle else Icons.Rounded.Error,
                contentDescription = null,
                tint = if (isOk) NeonGreen else NeonRed,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(label, style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp), color = Color.White)
        }
    }
}

@Composable
fun SimulationActionBar(
    onSimulateImpact: () -> Unit,
    onSimulateSos: () -> Unit,
    onToggleWorn: () -> Unit,
    onToggleNetwork: () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SectionTitle("TEST SIMULATOR", NeonPurple)
        
        @OptIn(ExperimentalLayoutApi::class)
        (FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SimButton("IMPACT", Icons.Rounded.FlashOn, NeonRed, onSimulateImpact)
            SimButton("SOS", Icons.Rounded.Sos, NeonRed, onSimulateSos)
            SimButton("WORN", Icons.Rounded.TouchApp, NeonCyan, onToggleWorn)
            SimButton("NET", Icons.Rounded.Wifi, NeonGreen, onToggleNetwork)
        })
    }
}

@Composable
fun SimButton(label: String, icon: ImageVector, color: Color, onClick: () -> Unit) {
    OutlinedButton(
        onClick = onClick,
        colors = ButtonDefaults.outlinedButtonColors(contentColor = color),
        border = BorderStroke(1.dp, color.copy(alpha = 0.5f)),
        shape = RoundedCornerShape(12.dp),
        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Icon(icon, contentDescription = null, modifier = Modifier.size(16.dp))
        Spacer(modifier = Modifier.width(6.dp))
        Text(label, fontSize = 10.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun AlertsOverlay(telemetry: HelmetTelemetry?) {
    Column(
        modifier = Modifier.fillMaxSize().padding(bottom = 120.dp),
        verticalArrangement = Arrangement.Bottom,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        AnimatedVisibility(
            visible = telemetry?.isWorn == false,
            enter = slideInVertically { it } + fadeIn(),
            exit = slideOutVertically { it } + fadeOut()
        ) {
            AlertCard("PLEASE WEAR HELMET", Icons.Rounded.Warning, NeonRed)
        }
        
        Spacer(modifier = Modifier.height(12.dp))
        
        AnimatedVisibility(
            visible = (telemetry?.batteryLevel ?: 100) < 20,
            enter = slideInVertically { it } + fadeIn(),
            exit = slideOutVertically { it } + fadeOut()
        ) {
            AlertCard("LOW BATTERY WARNING", Icons.Rounded.BatteryAlert, NeonRed)
        }
    }
}

@Composable
fun AlertCard(message: String, icon: ImageVector, color: Color) {
    Surface(
        color = color,
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
            .padding(horizontal = 32.dp)
            .border(2.dp, Color.White.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = Color.White)
            Spacer(modifier = Modifier.width(12.dp))
            Text(message, color = Color.White, fontWeight = FontWeight.Black, style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
fun SectionTitle(title: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(modifier = Modifier.size(width = 4.dp, height = 16.dp).background(color, CircleShape))
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            title,
            style = MaterialTheme.typography.labelLarge.copy(letterSpacing = 1.sp),
            color = color,
            fontWeight = FontWeight.Bold
        )
    }
}
