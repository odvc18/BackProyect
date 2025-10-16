import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Submission, SubmissionFile, SubmissionState } from '@types'

const initialState: SubmissionState = {
  submissions: [],
  currentSubmission: null,
  files: [],
  isLoading: false,
  error: null,
}

const submissionSlice = createSlice({
  name: 'submissions',
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

    // Set submissions
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload
      state.isLoading = false
      state.error = null
    },

    // Add submission
    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.push(action.payload)
    },

    // Update submission
    updateSubmission: (state, action: PayloadAction<Submission>) => {
      const index = state.submissions.findIndex(submission => submission.id === action.payload.id)
      if (index !== -1) {
        state.submissions[index] = action.payload
      }
      if (state.currentSubmission?.id === action.payload.id) {
        state.currentSubmission = action.payload
      }
    },

    // Remove submission
    removeSubmission: (state, action: PayloadAction<string>) => {
      state.submissions = state.submissions.filter(submission => submission.id !== action.payload)
      if (state.currentSubmission?.id === action.payload) {
        state.currentSubmission = null
      }
    },

    // Set current submission
    setCurrentSubmission: (state, action: PayloadAction<Submission | null>) => {
      state.currentSubmission = action.payload
    },

    // Set files
    setFiles: (state, action: PayloadAction<SubmissionFile[]>) => {
      state.files = action.payload
    },

    // Add file
    addFile: (state, action: PayloadAction<SubmissionFile>) => {
      state.files.push(action.payload)
    },

    // Update file
    updateFile: (state, action: PayloadAction<SubmissionFile>) => {
      const index = state.files.findIndex(file => file.id === action.payload.id)
      if (index !== -1) {
        state.files[index] = action.payload
      }
    },

    // Remove file
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload)
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
  setSubmissions,
  addSubmission,
  updateSubmission,
  removeSubmission,
  setCurrentSubmission,
  setFiles,
  addFile,
  updateFile,
  removeFile,
  clearError,
  reset,
} = submissionSlice.actions

export default submissionSlice.reducer


