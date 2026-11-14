package com.example.myapplication.data.local.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.example.myapplication.data.model.RideHistory
import kotlinx.coroutines.flow.Flow

@Dao
interface RideDao {
    @Query("SELECT * FROM ride_history ORDER BY startTime DESC")
    fun getAllRides(): Flow<List<RideHistory>>

    @Insert
    suspend fun insertRide(ride: RideHistory)

    @Query("DELETE FROM ride_history")
    suspend fun deleteAllRides()
}
