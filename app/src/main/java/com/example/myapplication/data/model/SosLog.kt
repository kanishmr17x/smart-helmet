package com.example.myapplication.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "sos_logs")
data class SosLog(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val timestamp: Long,
    val latitude: Double,
    val longitude: Double,
    val reason: String, // e.g., "IMPACT_DETECTED", "MANUAL_TRIGGER"
    val status: String // e.g., "SENT", "CANCELLED"
)
