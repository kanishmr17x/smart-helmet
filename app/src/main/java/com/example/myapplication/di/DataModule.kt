package com.example.myapplication.di

import android.content.Context
import androidx.room.Room
import com.example.myapplication.data.local.db.RideDao
import com.example.myapplication.data.local.db.SmartHelmetDatabase
import com.example.myapplication.data.local.db.SosDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DataModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): SmartHelmetDatabase {
        return Room.databaseBuilder(
            context,
            SmartHelmetDatabase::class.java,
            "smart_helmet_db"
        ).build()
    }

    @Provides
    fun provideRideDao(database: SmartHelmetDatabase): RideDao {
        return database.rideDao()
    }

    @Provides
    fun provideSosDao(database: SmartHelmetDatabase): SosDao {
        return database.sosDao()
    }
}
