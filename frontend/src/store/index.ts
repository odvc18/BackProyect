import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// Slices
import authSlice from './slices/authSlice'
import contestSlice from './slices/contestSlice'
import submissionSlice from './slices/submissionSlice'
import evaluationSlice from './slices/evaluationSlice'
import aiAnalysisSlice from './slices/aiAnalysisSlice'
import uiSlice from './slices/uiSlice'

// RTK Query APIs
import { identityApi } from './api/identityApi'
import { contestApi } from './api/contestApi'
import { submissionApi } from './api/submissionApi'
import { evaluationApi } from './api/evaluationApi'
import { aiAnalysisApi } from './api/aiAnalysisApi'

export const store = configureStore({
  reducer: {
    // Slices
    auth: authSlice,
    contests: contestSlice,
    submissions: submissionSlice,
    evaluation: evaluationSlice,
    aiAnalysis: aiAnalysisSlice,
    ui: uiSlice,
    
    // RTK Query APIs
    [identityApi.reducerPath]: identityApi.reducer,
    [contestApi.reducerPath]: contestApi.reducer,
    [submissionApi.reducerPath]: submissionApi.reducer,
    [evaluationApi.reducerPath]: evaluationApi.reducer,
    [aiAnalysisApi.reducerPath]: aiAnalysisApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    })
      .concat(identityApi.middleware)
      .concat(contestApi.middleware)
      .concat(submissionApi.middleware)
      .concat(evaluationApi.middleware)
      .concat(aiAnalysisApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Setup listeners for RTK Query
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks'

