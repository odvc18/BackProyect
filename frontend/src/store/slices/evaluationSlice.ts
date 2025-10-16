import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JudgeAssignment, Score, Rubric, EvaluationState } from '@types'

const initialState: EvaluationState = {
  assignments: [],
  scores: [],
  rubrics: [],
  isLoading: false,
  error: null,
}

const evaluationSlice = createSlice({
  name: 'evaluation',
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

    // Set assignments
    setAssignments: (state, action: PayloadAction<JudgeAssignment[]>) => {
      state.assignments = action.payload
      state.isLoading = false
      state.error = null
    },

    // Add assignment
    addAssignment: (state, action: PayloadAction<JudgeAssignment>) => {
      state.assignments.push(action.payload)
    },

    // Update assignment
    updateAssignment: (state, action: PayloadAction<JudgeAssignment>) => {
      const index = state.assignments.findIndex(assignment => assignment.id === action.payload.id)
      if (index !== -1) {
        state.assignments[index] = action.payload
      }
    },

    // Remove assignment
    removeAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(assignment => assignment.id !== action.payload)
    },

    // Set scores
    setScores: (state, action: PayloadAction<Score[]>) => {
      state.scores = action.payload
    },

    // Add score
    addScore: (state, action: PayloadAction<Score>) => {
      state.scores.push(action.payload)
    },

    // Update score
    updateScore: (state, action: PayloadAction<Score>) => {
      const index = state.scores.findIndex(score => score.id === action.payload.id)
      if (index !== -1) {
        state.scores[index] = action.payload
      }
    },

    // Remove score
    removeScore: (state, action: PayloadAction<string>) => {
      state.scores = state.scores.filter(score => score.id !== action.payload)
    },

    // Set rubrics
    setRubrics: (state, action: PayloadAction<Rubric[]>) => {
      state.rubrics = action.payload
    },

    // Add rubric
    addRubric: (state, action: PayloadAction<Rubric>) => {
      state.rubrics.push(action.payload)
    },

    // Update rubric
    updateRubric: (state, action: PayloadAction<Rubric>) => {
      const index = state.rubrics.findIndex(rubric => rubric.id === action.payload.id)
      if (index !== -1) {
        state.rubrics[index] = action.payload
      }
    },

    // Remove rubric
    removeRubric: (state, action: PayloadAction<string>) => {
      state.rubrics = state.rubrics.filter(rubric => rubric.id !== action.payload)
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
  setAssignments,
  addAssignment,
  updateAssignment,
  removeAssignment,
  setScores,
  addScore,
  updateScore,
  removeScore,
  setRubrics,
  addRubric,
  updateRubric,
  removeRubric,
  clearError,
  reset,
} = evaluationSlice.actions

export default evaluationSlice.reducer
