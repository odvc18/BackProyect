import React from 'react'
import { Box, Container, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '400px',
  justifyContent: 'center',
}))

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <StyledPaper elevation={8}>
          {/* Logo/Title */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2 30%, #dc004e 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              BackProyect
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Sistema de Gestión de Concursos Académicos
            </Typography>
          </Box>

          {/* Auth Form */}
          <Box sx={{ width: '100%' }}>
            {children}
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © 2025 Equipo de Arquitectura de Software
            </Typography>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  )
}

export default AuthLayout
