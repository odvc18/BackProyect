import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { loginStart, loginSuccess, loginFailure, clearError } from '@store/slices/authSlice'
import { useLoginMutation } from '@store/api/identityApi'
import { LoginDto } from '@types'

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
})

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { error: authError } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading }] = useLoginMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Clear error when component mounts or when form changes
  useEffect(() => {
    if (authError) {
      dispatch(clearError())
    }
  }, [])

  const onSubmit = async (data: LoginDto) => {
    try {
      dispatch(loginStart())
      const response = await login(data).unwrap()
      
      // Transform response to match AuthResponse format
      const authResponse = {
        user: response.user,
        token: response.token,
        expiresIn: response.expiresIn,
      }
      
      dispatch(loginSuccess(authResponse))
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Extract error message from different possible formats
      let errorMessage = 'Error al iniciar sesión'
      
      if (error?.data) {
        // Try different possible error message formats
        errorMessage = error.data.message || 
                       error.data.error || 
                       error.data.title ||
                       (typeof error.data === 'string' ? error.data : errorMessage)
      } else if (error?.error) {
        errorMessage = error.error.data?.message || 
                       error.error.message || 
                       error.error
      } else if (error?.status === 401) {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.'
      } else if (error?.status === 400) {
        errorMessage = 'Datos inválidos. Por favor, verifica la información ingresada.'
      } else if (error?.status === 404) {
        errorMessage = 'Usuario no encontrado. Verifica tu email.'
      } else if (error?.status === 500) {
        errorMessage = 'Error del servidor. Por favor, intenta más tarde.'
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      dispatch(loginFailure(errorMessage))
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Iniciar Sesión
      </Typography>

      {/* Error Alert */}
      {authError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
        >
          {authError}
        </Alert>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ mb: 2, py: 1.5 }}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ¿No tienes cuenta?{' '}
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate('/register')}
            sx={{ textTransform: 'none' }}
          >
            Regístrate aquí
          </Button>
        </Typography>
      </Box>
    </Box>
  )
}

export default Login
