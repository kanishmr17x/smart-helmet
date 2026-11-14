package com.example.myapplication.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.History
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material.icons.rounded.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapplication.data.model.SosLog
import com.example.myapplication.ui.theme.NeonCyan
import com.example.myapplication.ui.theme.NeonRed
import com.example.myapplication.ui.viewmodel.HistoryViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    onNavigateToEvidence: (Long) -> Unit,
    viewModel: HistoryViewModel = viewModel()
) {
    val logs by viewModel.sosLogs.collectAsState()

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("INCIDENT HISTORY", color = NeonCyan, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Transparent)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        if (logs.isEmpty()) {
            EmptyHistory(modifier = Modifier.padding(padding))
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(logs.reversed()) { log ->
                    IncidentCard(log = log, onClick = { onNavigateToEvidence(log.id) })
                }
            }
        }
    }
}

@Composable
fun IncidentCard(log: SosLog, onClick: () -> Unit) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .clickable(onClick = onClick),
        color = MaterialTheme.colorScheme.surface.copy(alpha = 0.5f),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (log.reason == "IMPACT_DETECTED") NeonRed.copy(alpha = 0.2f) else NeonCyan.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (log.reason == "IMPACT_DETECTED") Icons.Rounded.Info else Icons.Rounded.LocationOn,
                    contentDescription = null,
                    tint = if (log.reason == "IMPACT_DETECTED") NeonRed else NeonCyan
                )
            }
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = log.reason.replace("_", " "),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = SimpleDateFormat("MMM dd, HH:mm", Locale.getDefault()).format(Date(log.timestamp)),
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray
                )
            }
            
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = log.status,
                    style = MaterialTheme.typography.labelSmall,
                    color = if (log.status == "SENT") NeonCyan else Color.Gray,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "VIEW EVIDENCE",
                    style = MaterialTheme.typography.labelSmall.copy(fontSize = 8.sp),
                    color = NeonCyan.copy(alpha = 0.7f)
                )
            }
        }
    }
}

@Composable
fun EmptyHistory(modifier: Modifier = Modifier) {
    Box(modifier = modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                Icons.Rounded.History,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = Color.Gray.copy(alpha = 0.3f)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text("NO INCIDENTS RECORDED", color = Color.Gray, fontWeight = FontWeight.Bold)
        }
    }
}
