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
    const token = (getState() as any).auth.token || localStorage.getItem('token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    // No establecer Content-Type aquí - se establecerá según el tipo de body
    // Para FormData, el navegador lo establecerá automáticamente con el boundary
    // Para JSON, RTK Query lo establecerá automáticamente
    return headers
  },
  // Configurar fetchFn para manejar FormData correctamente
  fetchFn: async (input, init) => {
    // Si el body es FormData, asegurarse de que no haya Content-Type establecido
    // El navegador lo establecerá automáticamente con el boundary correcto
    if (init?.body instanceof FormData) {
      const headers = new Headers(init.headers)
      // Eliminar Content-Type si existe para que el navegador lo establezca
      headers.delete('Content-Type')
      
      // Crear un nuevo RequestInit sin Content-Type
      const newInit: RequestInit = {
        ...init,
        headers: headers,
      }
      
      return fetch(input, newInit)
    }
    // Para otros tipos de body (JSON), establecer Content-Type si no existe
    if (init && !(init.body instanceof FormData)) {
      const headers = new Headers(init.headers)
      if (!headers.has('Content-Type') && init.body) {
        headers.set('Content-Type', 'application/json')
      }
      return fetch(input, {
        ...init,
        headers: headers
      })
    }
    // Para otros tipos de body, usar el comportamiento por defecto
    return fetch(input, init)
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
          // No establecer Content-Type aquí - el navegador lo establecerá automáticamente con el boundary
        }
      },
      invalidatesTags: (result, error, { submissionId }) => [
        { type: 'SubmissionFile', id: submissionId },
        'SubmissionFile',
      ],
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








