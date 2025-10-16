import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { 
  Submission, 
  SubmissionCreateDto,
  SubmissionFile,
  SubmissionFileCreateDto,
  ApiResponse 
} from '@types'

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/submission',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const submissionApi = createApi({
  reducerPath: 'submissionApi',
  baseQuery,
  tagTypes: ['Submission', 'SubmissionFile'],
  endpoints: (builder) => ({
    // Create submission
    createSubmission: builder.mutation<Submission, SubmissionCreateDto>({
      query: (submissionData) => ({
        url: '/Create',
        method: 'POST',
        body: submissionData,
      }),
      invalidatesTags: ['Submission'],
    }),

    // Submit submission (change status to Submitted)
    submitSubmission: builder.mutation<Submission, string>({
      query: (submissionId) => ({
        url: '/Submit',
        method: 'POST',
        params: { submissionId },
      }),
      invalidatesTags: (result, error, submissionId) => [{ type: 'Submission', id: submissionId }],
    }),

    // Get submission by ID
    getSubmissionById: builder.query<Submission, string>({
      query: (id) => ({
        url: '/GetById',
        method: 'GET',
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: 'Submission', id }],
    }),

    // Get submissions by contest
    getSubmissionsByContest: builder.query<Submission[], string>({
      query: (contestId) => ({
        url: '/GetByContest',
        method: 'GET',
        params: { contestId },
      }),
      providesTags: (result, error, contestId) => [{ type: 'Submission', id: contestId }],
    }),

    // Get submissions by participant
    getSubmissionsByParticipant: builder.query<Submission[], string>({
      query: (participantId) => ({
        url: '/GetByParticipant',
        method: 'GET',
        params: { participantId },
      }),
      providesTags: (result, error, participantId) => [{ type: 'Submission', id: participantId }],
    }),

    // Get all submissions
    getAllSubmissions: builder.query<Submission[], void>({
      query: () => ({
        url: '/GetAll',
        method: 'GET',
      }),
      providesTags: ['Submission'],
    }),

    // Update submission
    updateSubmission: builder.mutation<Submission, Submission>({
      query: (submissionData) => ({
        url: '/Update',
        method: 'POST',
        body: submissionData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Submission', id }],
    }),

    // Delete submission
    deleteSubmission: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['Submission'],
    }),

    // File endpoints
    // Create submission file
    createSubmissionFile: builder.mutation<SubmissionFile, SubmissionFileCreateDto>({
      query: (fileData) => ({
        url: '/files/Create',
        method: 'POST',
        body: fileData,
      }),
      invalidatesTags: ['SubmissionFile'],
    }),

    // Get files by submission
    getFilesBySubmission: builder.query<SubmissionFile[], string>({
      query: (submissionId) => ({
        url: '/files/GetBySubmission',
        method: 'GET',
        params: { submissionId },
      }),
      providesTags: (result, error, submissionId) => [{ type: 'SubmissionFile', id: submissionId }],
    }),

    // Delete submission file
    deleteSubmissionFile: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/files/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['SubmissionFile'],
    }),

    // Upload file (multipart form data)
    uploadFile: builder.mutation<SubmissionFile, { submissionId: string; file: File }>({
      query: ({ submissionId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('submissionId', submissionId)
        
        return {
          url: '/files/Upload',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['SubmissionFile'],
    }),
  }),
})

export const {
  useCreateSubmissionMutation,
  useSubmitSubmissionMutation,
  useGetSubmissionByIdQuery,
  useGetSubmissionsByContestQuery,
  useGetSubmissionsByParticipantQuery,
  useGetAllSubmissionsQuery,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
  useCreateSubmissionFileMutation,
  useGetFilesBySubmissionQuery,
  useDeleteSubmissionFileMutation,
  useUploadFileMutation,
} = submissionApi

