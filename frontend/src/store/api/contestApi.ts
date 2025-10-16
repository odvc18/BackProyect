import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { 
  Contest, 
  ContestCreateDto, 
  ContestUpdateDto,
  Category,
  CategoryCreateDto,
  ApiResponse 
} from '@types'

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/contest',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery,
  tagTypes: ['Contest', 'Category'],
  endpoints: (builder) => ({
    // Create contest
    createContest: builder.mutation<Contest, ContestCreateDto>({
      query: (contestData) => ({
        url: '/Create',
        method: 'POST',
        body: contestData,
      }),
      invalidatesTags: ['Contest'],
    }),

    // Update contest
    updateContest: builder.mutation<Contest, ContestUpdateDto>({
      query: (contestData) => ({
        url: '/Update',
        method: 'POST',
        body: contestData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contest', id }],
    }),

    // Get contest by ID
    getContestById: builder.query<Contest, string>({
      query: (id) => ({
        url: '/GetById',
        method: 'GET',
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: 'Contest', id }],
    }),

    // Get active contests
    getActiveContests: builder.query<Contest[], void>({
      query: () => ({
        url: '/GetByActive',
        method: 'GET',
      }),
      providesTags: ['Contest'],
    }),

    // Get all contests (if endpoint exists)
    getAllContests: builder.query<Contest[], void>({
      query: () => ({
        url: '/GetAll',
        method: 'GET',
      }),
      providesTags: ['Contest'],
    }),

    // Delete contest (if endpoint exists)
    deleteContest: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['Contest'],
    }),

    // Category endpoints
    // Create category
    createCategory: builder.mutation<Category, CategoryCreateDto>({
      query: (categoryData) => ({
        url: '/categories/Create',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),

    // Get categories by contest
    getCategoriesByContest: builder.query<Category[], string>({
      query: (contestId) => ({
        url: '/categories/GetByContest',
        method: 'GET',
        params: { contestId },
      }),
      providesTags: (result, error, contestId) => [{ type: 'Category', id: contestId }],
    }),

    // Update category
    updateCategory: builder.mutation<Category, Category>({
      query: (categoryData) => ({
        url: '/categories/Update',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),

    // Delete category
    deleteCategory: builder.mutation<boolean, string>({
      query: (id) => ({
        url: '/categories/Delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['Category'],
    }),
  }),
})

export const {
  useCreateContestMutation,
  useUpdateContestMutation,
  useGetContestByIdQuery,
  useGetActiveContestsQuery,
  useGetAllContestsQuery,
  useDeleteContestMutation,
  useCreateCategoryMutation,
  useGetCategoriesByContestQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = contestApi


