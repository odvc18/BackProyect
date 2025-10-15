import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AnalysisRequest, AnalysisResult, AiAnalysisState } from '@types'

const initialState: AiAnalysisState = {
  requests: [],
  results: [],
  isLoading: false,
  error: null,
}

const aiAnalysisSlice = createSlice({
  name: 'aiAnalysis',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Set analysis requests
    setRequests: (state, action: PayloadAction<AnalysisRequest[]>) => {
      state.requests = action.payload
      state.isLoading = false
      state.error = null
    },

    // Add analysis request
    addRequest: (state, action: PayloadAction<AnalysisRequest>) => {
      state.requests.push(action.payload)
    },

    // Update analysis request
    updateRequest: (state, action: PayloadAction<AnalysisRequest>) => {
      const index = state.requests.findIndex(request => request.id === action.payload.id)
      if (index !== -1) {
        state.requests[index] = action.payload
      }
    },

    // Remove analysis request
    removeRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter(request => request.id !== action.payload)
    },

    // Set analysis results
    setResults: (state, action: PayloadAction<AnalysisResult[]>) => {
      state.results = action.payload
    },

    // Add analysis result
    addResult: (state, action: PayloadAction<AnalysisResult>) => {
      state.results.push(action.payload)
    },

    // Update analysis result
    updateResult: (state, action: PayloadAction<AnalysisResult>) => {
      const index = state.results.findIndex(result => result.id === action.payload.id)
      if (index !== -1) {
        state.results[index] = action.payload
      }
    },

    // Remove analysis result
    removeResult: (state, action: PayloadAction<string>) => {
      state.results = state.results.filter(result => result.id !== action.payload)
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Reset state
    reset: () => initialState,
  },
})

export const {
  setLoading,
  setError,
  setRequests,
  addRequest,
  updateRequest,
  removeRequest,
  setResults,
  addResult,
  updateResult,
  removeResult,
  clearError,
  reset,
} = aiAnalysisSlice.actions

export default aiAnalysisSlice.reducer
