import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, AuthState } from '@types'

// Estado inicial: solo cargar el token, pero no establecer isAuthenticated hasta verificar
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false, // No establecer como true hasta verificar el token
  isLoading: !!localStorage.getItem('token'), // Mostrar loading si hay token para verificar
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('token', action.payload.token)
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = action.payload
      localStorage.removeItem('token')
    },

    // Logout action
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
    },

    // Update user profile
    updateProfile: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem('token')
      if (token) {
        state.token = token
        state.isAuthenticated = true
      }
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  clearError,
  setLoading,
  initializeAuth,
} = authSlice.actions

export default authSlice.reducer

