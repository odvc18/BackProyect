import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Contest, Category, ContestState } from '@types'

const initialState: ContestState = {
  contests: [],
  currentContest: null,
  categories: [],
  isLoading: false,
  error: null,
}

const contestSlice = createSlice({
  name: 'contests',
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

    // Set contests
    setContests: (state, action: PayloadAction<Contest[]>) => {
      state.contests = action.payload
      state.isLoading = false
      state.error = null
    },

    // Add contest
    addContest: (state, action: PayloadAction<Contest>) => {
      state.contests.push(action.payload)
    },

    // Update contest
    updateContest: (state, action: PayloadAction<Contest>) => {
      const index = state.contests.findIndex(contest => contest.id === action.payload.id)
      if (index !== -1) {
        state.contests[index] = action.payload
      }
      if (state.currentContest?.id === action.payload.id) {
        state.currentContest = action.payload
      }
    },

    // Remove contest
    removeContest: (state, action: PayloadAction<string>) => {
      state.contests = state.contests.filter(contest => contest.id !== action.payload)
      if (state.currentContest?.id === action.payload) {
        state.currentContest = null
      }
    },

    // Set current contest
    setCurrentContest: (state, action: PayloadAction<Contest | null>) => {
      state.currentContest = action.payload
    },

    // Set categories
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload
    },

    // Add category
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload)
    },

    // Update category
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(category => category.id === action.payload.id)
      if (index !== -1) {
        state.categories[index] = action.payload
      }
    },

    // Remove category
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload)
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
  setContests,
  addContest,
  updateContest,
  removeContest,
  setCurrentContest,
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  clearError,
  reset,
} = contestSlice.actions

export default contestSlice.reducer

