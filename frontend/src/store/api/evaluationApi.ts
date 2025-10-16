import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { 
  JudgeAssignment, 
  JudgeAssignmentCreateDto,
  Score,
  ScoreCreateDto,
  Rubric,
  RubricCreateDto,
  ApiResponse 
} from '@types'

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/evaluation',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const evaluationApi = createApi({
  reducerPath: 'evaluationApi',
  baseQuery,
  tagTypes: ['JudgeAssignment', 'Score', 'Rubric'],
  endpoints: (builder) => ({
    // Judge Assignment endpoints
    // Create judge assignment
    createJudgeAssignment: builder.mutation<JudgeAssignment, JudgeAssignmentCreateDto>({
      query: (assignmentData) => ({
        url: '/assignments/Create',
        method: 'POST',
        body: assignmentData,
      }),
      invalidatesTags: ['JudgeAssignment'],
    }),

    // Get assignments by judge
    getAssignmentsByJudge: builder.query<JudgeAssignment[], string>({
      query: (judgeId) => ({
        url: '/assignments/GetByJudge',
        method: 'GET',
        params: { judgeId },
      }),
      providesTags: (result, error, judgeId) => [{ type: 'JudgeAssignment', id: judgeId }],
    }),

    // Get assignments by submission
    getAssignmentsBySubmission: builder.query<JudgeAssignment[], string>({
      query: (submissionId) => ({
        url: '/assignments/GetBySubmission',
        method: 'GET',
        params: { submissionId },
      }),
      providesTags: (result, error, submissionId) => [{ type: 'JudgeAssignment', id: submissionId }],
    }),

    // Get all assignments
    getAllAssignments: builder.query<JudgeAssignment[], void>({
      query: () => ({
        url: '/assignments/GetAll',
        method: 'GET',
      }),
      providesTags: ['JudgeAssignment'],
    }),

    // Update assignment status
    updateAssignmentStatus: builder.mutation<JudgeAssignment, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: '/assignments/UpdateStatus',
        method: 'POST',
        body: { id, status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'JudgeAssignment', id }],
    }),

    // Delete assignment
    deleteAssignment: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/assignments/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['JudgeAssignment'],
    }),

    // Score endpoints
    // Create score
    createScore: builder.mutation<Score, ScoreCreateDto>({
      query: (scoreData) => ({
        url: '/scores/Create',
        method: 'POST',
        body: scoreData,
      }),
      invalidatesTags: ['Score'],
    }),

    // Get scores by assignment
    getScoresByAssignment: builder.query<Score[], string>({
      query: (assignmentId) => ({
        url: '/scores/GetByAssignment',
        method: 'GET',
        params: { assignmentId },
      }),
      providesTags: (result, error, assignmentId) => [{ type: 'Score', id: assignmentId }],
    }),

    // Get scores by submission
    getScoresBySubmission: builder.query<Score[], string>({
      query: (submissionId) => ({
        url: '/scores/GetBySubmission',
        method: 'GET',
        params: { submissionId },
      }),
      providesTags: (result, error, submissionId) => [{ type: 'Score', id: submissionId }],
    }),

    // Update score
    updateScore: builder.mutation<Score, Score>({
      query: (scoreData) => ({
        url: '/scores/Update',
        method: 'POST',
        body: scoreData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Score', id }],
    }),

    // Delete score
    deleteScore: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/scores/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['Score'],
    }),

    // Rubric endpoints
    // Create rubric
    createRubric: builder.mutation<Rubric, RubricCreateDto>({
      query: (rubricData) => ({
        url: '/rubrics/Create',
        method: 'POST',
        body: rubricData,
      }),
      invalidatesTags: ['Rubric'],
    }),

    // Get rubrics by contest
    getRubricsByContest: builder.query<Rubric[], string>({
      query: (contestId) => ({
        url: '/rubrics/GetByContest',
        method: 'GET',
        params: { contestId },
      }),
      providesTags: (result, error, contestId) => [{ type: 'Rubric', id: contestId }],
    }),

    // Get all rubrics
    getAllRubrics: builder.query<Rubric[], void>({
      query: () => ({
        url: '/rubrics/GetAll',
        method: 'GET',
      }),
      providesTags: ['Rubric'],
    }),

    // Update rubric
    updateRubric: builder.mutation<Rubric, Rubric>({
      query: (rubricData) => ({
        url: '/rubrics/Update',
        method: 'POST',
        body: rubricData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Rubric', id }],
    }),

    // Delete rubric
    deleteRubric: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/rubrics/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['Rubric'],
    }),

    // Get evaluation summary for a submission
    getEvaluationSummary: builder.query<{
      submissionId: string
      totalScore: number
      maxScore: number
      averageScore: number
      scores: Score[]
      assignments: JudgeAssignment[]
    }, string>({
      query: (submissionId) => ({
        url: '/summary/GetBySubmission',
        method: 'GET',
        params: { submissionId },
      }),
      providesTags: (result, error, submissionId) => [{ type: 'Score', id: submissionId }],
    }),
  }),
})

export const {
  useCreateJudgeAssignmentMutation,
  useGetAssignmentsByJudgeQuery,
  useGetAssignmentsBySubmissionQuery,
  useGetAllAssignmentsQuery,
  useUpdateAssignmentStatusMutation,
  useDeleteAssignmentMutation,
  useCreateScoreMutation,
  useGetScoresByAssignmentQuery,
  useGetScoresBySubmissionQuery,
  useUpdateScoreMutation,
  useDeleteScoreMutation,
  useCreateRubricMutation,
  useGetRubricsByContestQuery,
  useGetAllRubricsQuery,
  useUpdateRubricMutation,
  useDeleteRubricMutation,
  useGetEvaluationSummaryQuery,
} = evaluationApi


