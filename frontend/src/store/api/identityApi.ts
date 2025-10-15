import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { 
  User, 
  UserCreateDto, 
  UserUpdateDto, 
  LoginDto, 
  AuthResponse,
  ApiResponse 
} from '@types'

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/identity',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const identityApi = createApi({
  reducerPath: 'identityApi',
  baseQuery,
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Create user
    createUser: builder.mutation<User, UserCreateDto>({
      query: (userData) => ({
        url: '/Create',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Update user
    updateUser: builder.mutation<User, UserUpdateDto>({
      query: (userData) => ({
        url: '/Update',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete user
    deleteUser: builder.mutation<boolean, string>({
      query: (userId) => ({
        url: '/Delete',
        method: 'DELETE',
        params: { request: userId },
      }),
      invalidatesTags: ['User'],
    }),

    // Get user by email
    getUserByEmail: builder.query<User, string>({
      query: (email) => ({
        url: '/GetByEmail',
        method: 'GET',
        params: { email },
      }),
      providesTags: (result, error, email) => [{ type: 'User', id: email }],
    }),

    // Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: '/GetById',
        method: 'GET',
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Get all users (if endpoint exists)
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/GetAll',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // Verify token
    verifyToken: builder.query<User, void>({
      query: () => ({
        url: '/verify',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
})

export const {
  useLoginMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByEmailQuery,
  useGetUserByIdQuery,
  useGetAllUsersQuery,
  useVerifyTokenQuery,
} = identityApi
