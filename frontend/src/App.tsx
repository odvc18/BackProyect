import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAppSelector } from '@store/hooks'

// Layout Components
import MainLayout from '@components/layout/MainLayout'
import AuthLayout from '@components/layout/AuthLayout'

// Pages
import Login from '@pages/auth/Login'
import Dashboard from '@pages/dashboard/Dashboard'
import ContestList from '@pages/contests/ContestList'
import ContestDetail from '@pages/contests/ContestDetail'
import ContestCreate from '@pages/contests/ContestCreate'
import SubmissionList from '@pages/submissions/SubmissionList'
import SubmissionDetail from '@pages/submissions/SubmissionDetail'
import EvaluationList from '@pages/evaluation/EvaluationList'
import EvaluationDetail from '@pages/evaluation/EvaluationDetail'
import UserList from '@pages/users/UserList'
import UserProfile from '@pages/users/UserProfile'

// Protected Route Component
import ProtectedRoute from '@components/common/ProtectedRoute'

const App: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <Login />
              </AuthLayout>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Contests */}
          <Route path="contests" element={<ContestList />} />
          <Route path="contests/create" element={<ContestCreate />} />
          <Route path="contests/:id" element={<ContestDetail />} />

          {/* Submissions */}
          <Route path="submissions" element={<SubmissionList />} />
          <Route path="submissions/:id" element={<SubmissionDetail />} />

          {/* Evaluation */}
          <Route path="evaluation" element={<EvaluationList />} />
          <Route path="evaluation/:id" element={<EvaluationDetail />} />

          {/* Users */}
          <Route path="users" element={<UserList />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Box>
  )
}

export default App
