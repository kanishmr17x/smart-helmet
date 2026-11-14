package com.example.myapplication.data.local.db

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.myapplication.data.model.RideHistory
import com.example.myapplication.data.model.SosLog

@Database(entities = [RideHistory::class, SosLog::class], version = 1, exportSchema = false)
abstract class SmartHelmetDatabase : RoomDatabase() {
    abstract fun rideDao(): RideDao
    abstract fun sosDao(): SosDao
}
