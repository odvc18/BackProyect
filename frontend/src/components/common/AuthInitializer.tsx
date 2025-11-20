import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { setLoading, loginSuccess, logout } from '@store/slices/authSlice'
import { useVerifyTokenQuery } from '@store/api/identityApi'

const AuthInitializer: React.FC = () => {
  const dispatch = useAppDispatch()
  const { token, user, isAuthenticated, isLoading: authIsLoading } = useAppSelector((state) => state.auth)
  
  // Verificar token si existe y aún no tenemos usuario cargado
  // No saltar si hay token pero no hay usuario (caso de recarga de página)
  const shouldVerify = token && !user
  const { data: verifyData, error, isLoading: verifyIsLoading, isFetching } = useVerifyTokenQuery(undefined, {
    skip: !shouldVerify,
  })

  // Sincronizar el estado de loading
  useEffect(() => {
    if (shouldVerify) {
      // Si estamos verificando, mostrar loading
      if (verifyIsLoading || isFetching) {
        dispatch(setLoading(true))
      } else {
        dispatch(setLoading(false))
      }
    } else if (!token) {
      // Si no hay token, no hay nada que verificar
      dispatch(setLoading(false))
    }
  }, [shouldVerify, verifyIsLoading, isFetching, token, dispatch])

  // Manejar el resultado de la verificación
  useEffect(() => {
    if (verifyData && token && !user) {
      // Token válido: restaurar sesión
      dispatch(loginSuccess({ user: verifyData, token }))
    } else if (error && token && !user) {
      // Token inválido o expirado: limpiar y hacer logout
      console.error('Error verifying token:', error)
      dispatch(logout())
    }
  }, [verifyData, error, token, user, dispatch])

  // Si no hay token, asegurar que el estado esté limpio
  useEffect(() => {
    if (!token && (isAuthenticated || user)) {
      // Si no hay token pero el estado dice que estamos autenticados, limpiar
      dispatch(logout())
    }
  }, [token, isAuthenticated, user, dispatch])

  return null
}

export default AuthInitializer

