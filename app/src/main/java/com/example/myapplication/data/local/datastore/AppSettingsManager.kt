package com.example.myapplication.data.local.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "app_settings")

@Singleton
class AppSettingsManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val SENSITIVITY_KEY = floatPreferencesKey("impact_sensitivity")
    private val EMERGENCY_CONTACT_NAME_KEY = stringPreferencesKey("emergency_contact_name")
    private val EMERGENCY_CONTACT_PHONE_KEY = stringPreferencesKey("emergency_contact_phone")
    private val AUTO_SOS_ENABLED_KEY = booleanPreferencesKey("auto_sos_enabled")

    val impactSensitivity: Flow<Float> = context.dataStore.data
        .map { preferences ->
            preferences[SENSITIVITY_KEY] ?: 5.0f // Default G-force threshold
        }

    val emergencyContact: Flow<Pair<String, String>> = context.dataStore.data
        .map { preferences ->
            val name = preferences[EMERGENCY_CONTACT_NAME_KEY] ?: ""
            val phone = preferences[EMERGENCY_CONTACT_PHONE_KEY] ?: ""
            Pair(name, phone)
        }

    val autoSosEnabled: Flow<Boolean> = context.dataStore.data
        .map { preferences ->
            preferences[AUTO_SOS_ENABLED_KEY] ?: true
        }

    suspend fun updateImpactSensitivity(sensitivity: Float) {
        context.dataStore.edit { preferences ->
            preferences[SENSITIVITY_KEY] = sensitivity
        }
    }

    suspend fun updateEmergencyContact(name: String, phone: String) {
        context.dataStore.edit { preferences ->
            preferences[EMERGENCY_CONTACT_NAME_KEY] = name
            preferences[EMERGENCY_CONTACT_PHONE_KEY] = phone
        }
    }

    suspend fun setAutoSosEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[AUTO_SOS_ENABLED_KEY] = enabled
        }
    }
}
