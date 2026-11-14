package com.example.myapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.viewmodel.compose.rememberViewModelStoreProvider
import androidx.lifecycle.viewmodel.navigation3.ViewModelStoreNavEntryDecorator
import androidx.navigation3.runtime.NavEntry
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.example.myapplication.domain.SafetyEvent
import com.example.myapplication.ui.navigation.Route
import com.example.myapplication.ui.screens.DashboardScreen
import com.example.myapplication.ui.screens.HistoryScreen
import com.example.myapplication.ui.screens.SettingsScreen
import com.example.myapplication.ui.screens.AnalyticsScreen
import com.example.myapplication.ui.screens.EmergencyFlowScreen
import com.example.myapplication.ui.screens.EvidenceViewerScreen
import com.example.myapplication.ui.theme.MyApplicationTheme
import com.example.myapplication.domain.SafetyManager
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var safetyManager: SafetyManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                val backStack = rememberNavBackStack(Route.Dashboard)
                val viewModelStoreProvider = rememberViewModelStoreProvider()

                LaunchedEffect(Unit) {
                    safetyManager.safetyEvents.collect { event ->
                        when (event) {
                            is SafetyEvent.ImpactDetected -> {
                                backStack.add(
                                    Route.EmergencyFlow(
                                        impactMagnitude = event.magnitude,
                                        latitude = event.telemetry.latitude,
                                        longitude = event.telemetry.longitude,
                                        isManual = false
                                    )
                                )
                            }
                            is SafetyEvent.SosTriggered -> {
                                // For manual SOS from helmet button/service, show dispatch sequence
                                if (backStack.last() !is Route.EmergencyFlow) {
                                    backStack.add(
                                        Route.EmergencyFlow(
                                            impactMagnitude = 0f,
                                            latitude = event.log.latitude,
                                            longitude = event.log.longitude,
                                            isManual = true
                                        )
                                    )
                                }
                            }
                        }
                    }
                }
                
                Scaffold(
                    modifier = Modifier.fillMaxSize()
                ) { innerPadding ->
                    NavDisplay(
                        backStack = backStack,
                        modifier = Modifier.padding(innerPadding),
                        entryDecorators = listOf(ViewModelStoreNavEntryDecorator(viewModelStoreProvider))
                    ) { key ->
                        NavEntry(key) {
                            when (key) {
                                is Route.Dashboard -> DashboardScreen(
                                    onNavigateToHistory = { backStack.add(Route.History) },
                                    onNavigateToAnalytics = { backStack.add(Route.Analytics) },
                                    onNavigateToSettings = { backStack.add(Route.Settings) }
                                )
                                is Route.History -> HistoryScreen(
                                    onNavigateToEvidence = { id -> backStack.add(Route.EvidenceViewer(id)) }
                                )
                                is Route.Settings -> SettingsScreen()
                                is Route.Analytics -> AnalyticsScreen(
                                    onBack = { if (backStack.size > 1) backStack.removeAt(backStack.lastIndex) }
                                )
                                is Route.EmergencyFlow -> EmergencyFlowScreen(
                                    impactMagnitude = key.impactMagnitude,
                                    latitude = key.latitude,
                                    longitude = key.longitude,
                                    isManual = key.isManual,
                                    onDismiss = { 
                                        if (backStack.isNotEmpty() && backStack.last() is Route.EmergencyFlow) {
                                            backStack.removeAt(backStack.lastIndex)
                                        }
                                    }
                                )
                                is Route.EvidenceViewer -> EvidenceViewerScreen(
                                    incidentId = key.incidentId,
                                    onBack = { if (backStack.size > 1) backStack.removeAt(backStack.lastIndex) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MyApplicationTheme {
        Greeting("Android")
    }
}