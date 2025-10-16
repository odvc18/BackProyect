import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAppSelector } from '@store/hooks'
import { UserRole } from '@types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  fallbackPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login',
}) => {
  const location = useLocation()
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 3,
        }}
      >
        <Typography variant="h4" color="error" align="center">
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          No tienes permisos para acceder a esta sección.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Tu rol actual: <strong>{user.role}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Rol requerido: <strong>{requiredRole}</strong>
        </Typography>
      </Box>
    )
  }

  // Check if user is active
  if (!user.isActive) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 3,
        }}
      >
        <Typography variant="h4" color="error" align="center">
          Cuenta Desactivada
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Tu cuenta ha sido desactivada. Contacta al administrador.
        </Typography>
      </Box>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute


