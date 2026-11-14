package com.example.myapplication.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.local.db.SosDao
import com.example.myapplication.data.model.SosLog
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@HiltViewModel
class HistoryViewModel @Inject constructor(
    private val sosDao: SosDao
) : ViewModel() {

    val sosLogs: StateFlow<List<SosLog>> = sosDao.getAllSosLogs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
}
