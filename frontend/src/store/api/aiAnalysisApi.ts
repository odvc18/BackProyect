import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { 
  AnalysisRequest, 
  AnalysisRequestCreateDto,
  AnalysisResult,
  AnalysisResultCreateDto,
  ApiResponse 
} from '@types'

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/ai-analysis',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const aiAnalysisApi = createApi({
  reducerPath: 'aiAnalysisApi',
  baseQuery,
  tagTypes: ['AnalysisRequest', 'AnalysisResult'],
  endpoints: (builder) => ({
    // Analysis Request endpoints
    // Create analysis request
    createAnalysisRequest: builder.mutation<AnalysisRequest, AnalysisRequestCreateDto>({
      query: (requestData) => ({
        url: '/requests/Create',
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['AnalysisRequest'],
    }),

    // Get analysis requests by status
    getAnalysisRequestsByStatus: builder.query<AnalysisRequest[], string>({
      query: (status) => ({
        url: '/requests/GetByStatus',
        method: 'GET',
        params: { status },
      }),
      providesTags: (result, error, status) => [{ type: 'AnalysisRequest', id: status }],
    }),

    // Get analysis requests by submission file
    getAnalysisRequestsByFile: builder.query<AnalysisRequest[], string>({
      query: (submissionFileId) => ({
        url: '/requests/GetByFile',
        method: 'GET',
        params: { submissionFileId },
      }),
      providesTags: (result, error, submissionFileId) => [{ type: 'AnalysisRequest', id: submissionFileId }],
    }),

    // Get all analysis requests
    getAllAnalysisRequests: builder.query<AnalysisRequest[], void>({
      query: () => ({
        url: '/requests/GetAll',
        method: 'GET',
      }),
      providesTags: ['AnalysisRequest'],
    }),

    // Update analysis request status
    updateAnalysisRequestStatus: builder.mutation<AnalysisRequest, { 
      id: string; 
      status: string; 
      errorMessage?: string 
    }>({
      query: ({ id, status, errorMessage }) => ({
        url: '/requests/UpdateStatus',
        method: 'POST',
        body: { id, status, errorMessage },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AnalysisRequest', id }],
    }),

    // Delete analysis request
    deleteAnalysisRequest: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/requests/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['AnalysisRequest'],
    }),

    // Analysis Result endpoints
    // Create analysis result
    createAnalysisResult: builder.mutation<AnalysisResult, AnalysisResultCreateDto>({
      query: (resultData) => ({
        url: '/results/Create',
        method: 'POST',
        body: resultData,
      }),
      invalidatesTags: ['AnalysisResult'],
    }),

    // Get analysis results by request
    getAnalysisResultsByRequest: builder.query<AnalysisResult[], string>({
      query: (requestId) => ({
        url: '/results/GetByRequest',
        method: 'GET',
        params: { requestId },
      }),
      providesTags: (result, error, requestId) => [{ type: 'AnalysisResult', id: requestId }],
    }),

    // Get analysis results by submission file
    getAnalysisResultsByFile: builder.query<AnalysisResult[], string>({
      query: (submissionFileId) => ({
        url: '/results/GetByFile',
        method: 'GET',
        params: { submissionFileId },
      }),
      providesTags: (result, error, submissionFileId) => [{ type: 'AnalysisResult', id: submissionFileId }],
    }),

    // Get all analysis results
    getAllAnalysisResults: builder.query<AnalysisResult[], void>({
      query: () => ({
        url: '/results/GetAll',
        method: 'GET',
      }),
      providesTags: ['AnalysisResult'],
    }),

    // Update analysis result
    updateAnalysisResult: builder.mutation<AnalysisResult, AnalysisResult>({
      query: (resultData) => ({
        url: '/results/Update',
        method: 'POST',
        body: resultData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AnalysisResult', id }],
    }),

    // Delete analysis result
    deleteAnalysisResult: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/results/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['AnalysisResult'],
    }),

    // Analysis execution endpoints
    // Execute analysis
    executeAnalysis: builder.mutation<AnalysisRequest, { 
      submissionFileId: string; 
      analysisType: string 
    }>({
      query: ({ submissionFileId, analysisType }) => ({
        url: '/execute',
        method: 'POST',
        body: { submissionFileId, analysisType },
      }),
      invalidatesTags: ['AnalysisRequest', 'AnalysisResult'],
    }),

    // Get analysis metrics
    getAnalysisMetrics: builder.query<{
      totalRequests: number
      completedRequests: number
      failedRequests: number
      pendingRequests: number
      averageProcessingTime: number
      analysisTypes: { [key: string]: number }
    }, void>({
      query: () => ({
        url: '/metrics',
        method: 'GET',
      }),
      providesTags: ['AnalysisRequest', 'AnalysisResult'],
    }),

    // Get analysis summary for a submission
    getAnalysisSummary: builder.query<{
      submissionId: string
      totalAnalyses: number
      completedAnalyses: number
      failedAnalyses: number
      pendingAnalyses: number
      results: AnalysisResult[]
      requests: AnalysisRequest[]
    }, string>({
      query: (submissionId) => ({
        url: '/summary/GetBySubmission',
        method: 'GET',
        params: { submissionId },
      }),
      providesTags: (result, error, submissionId) => [{ type: 'AnalysisResult', id: submissionId }],
    }),
  }),
})

export const {
  useCreateAnalysisRequestMutation,
  useGetAnalysisRequestsByStatusQuery,
  useGetAnalysisRequestsByFileQuery,
  useGetAllAnalysisRequestsQuery,
  useUpdateAnalysisRequestStatusMutation,
  useDeleteAnalysisRequestMutation,
  useCreateAnalysisResultMutation,
  useGetAnalysisResultsByRequestQuery,
  useGetAnalysisResultsByFileQuery,
  useGetAllAnalysisResultsQuery,
  useUpdateAnalysisResultMutation,
  useDeleteAnalysisResultMutation,
  useExecuteAnalysisMutation,
  useGetAnalysisMetricsQuery,
  useGetAnalysisSummaryQuery,
} = aiAnalysisApi


