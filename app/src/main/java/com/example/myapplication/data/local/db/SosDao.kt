package com.example.myapplication.data.local.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.example.myapplication.data.model.SosLog
import kotlinx.coroutines.flow.Flow

@Dao
interface SosDao {
    @Query("SELECT * FROM sos_logs ORDER BY timestamp DESC")
    fun getAllSosLogs(): Flow<List<SosLog>>

    @Insert
    suspend fun insertSosLog(log: SosLog)

    @Query("DELETE FROM sos_logs")
    suspend fun deleteAllSosLogs()
}
