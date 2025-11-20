import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Slider,
  Chip,
} from '@mui/material'
import { ArrowBack, Save, Download } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useAppSelector } from '@store/hooks'
import {
  useGetAssignmentsBySubmissionQuery,
  useGetScoresByAssignmentQuery,
  useCreateScoreMutation,
  useUpdateScoreMutation,
  useUpdateAssignmentStatusMutation,
} from '@store/api/evaluationApi'
import {
  useGetSubmissionByIdQuery,
  useGetFilesBySubmissionQuery,
} from '@store/api/submissionApi'
import { useGetContestByIdQuery, useGetCategoriesByContestQuery } from '@store/api/contestApi'
import { Score, ScoreCreateDto } from '@types'

interface EvaluationFormData {
  score: number
  comments: string
}

const EvaluationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, token } = useAppSelector((state) => state.auth)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Función auxiliar para validar si un string es un GUID válido
  const isValidGuid = (str: string | undefined): boolean => {
    if (!str) return false
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return guidRegex.test(str)
  }

  // Validar que el ID sea válido
  const isValidId = id && isValidGuid(id)

  // Obtener submission
  const { data: submission, isLoading: isLoadingSubmission, error: submissionError } = useGetSubmissionByIdQuery(
    id || '',
    {
      skip: !isValidId,
    }
  )

  // Obtener asignación del juez actual
  const { data: assignments = [] } = useGetAssignmentsBySubmissionQuery(id || '', {
    skip: !id,
  })
  const currentAssignment = assignments.find((a) => a.judgeId === user?.id)

  // Obtener score existente
  const { data: existingScores = [] } = useGetScoresByAssignmentQuery(
    currentAssignment?.id || '',
    {
      skip: !currentAssignment?.id,
    }
  )
  const existingScore = existingScores.length > 0 ? existingScores[0] : null

  // Obtener información adicional
  const { data: contest } = useGetContestByIdQuery(submission?.contestId || '', {
    skip: !submission?.contestId,
  })
  const { data: categories = [] } = useGetCategoriesByContestQuery(
    submission?.contestId || '',
    {
      skip: !submission?.contestId,
    }
  )
  const { data: files = [] } = useGetFilesBySubmissionQuery(id || '', {
    skip: !id,
  })

  const [createScore] = useCreateScoreMutation()
  const [updateScore] = useUpdateScoreMutation()
  const [updateAssignmentStatus] = useUpdateAssignmentStatusMutation()

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<EvaluationFormData>({
    defaultValues: {
      score: existingScore?.value || 0,
      comments: existingScore?.comments || '',
    },
  })

  // Inicializar valores del formulario con score existente
  useEffect(() => {
    if (existingScore) {
      setValue('score', existingScore.value)
      setValue('comments', existingScore.comments || '')
    }
  }, [existingScore, setValue])

  // Actualizar estado de asignación a "InProgress" cuando se carga
  useEffect(() => {
    if (currentAssignment && currentAssignment.status === 'Assigned') {
      updateAssignmentStatus({
        id: currentAssignment.id,
        status: 'InProgress',
      }).catch(console.error)
    }
  }, [currentAssignment, updateAssignmentStatus])

  const onSubmit = async (data: EvaluationFormData) => {
    if (!currentAssignment) {
      setErrorMessage('No tienes una asignación para esta submission.')
      return
    }

    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      const scoreData: ScoreCreateDto = {
        judgeAssignmentId: currentAssignment.id,
        score: data.score,
        comments: data.comments || undefined,
      }

      if (existingScore) {
        // Actualizar score existente
        await updateScore({
          ...existingScore,
          value: data.score,
          comments: data.comments || undefined,
        }).unwrap()
      } else {
        // Crear nuevo score
        await createScore(scoreData).unwrap()
      }

      // Marcar asignación como completada
      if (currentAssignment) {
        await updateAssignmentStatus({
          id: currentAssignment.id,
          status: 'Completed',
        }).unwrap()
      }

      setSuccessMessage('Evaluación guardada exitosamente.')
      setTimeout(() => {
        navigate('/evaluation')
      }, 2000)
    } catch (err: any) {
      console.error('Error saving evaluation:', err)
      setErrorMessage(
        err?.data?.message || err?.message || 'Error al guardar la evaluación. Por favor, intenta de nuevo.'
      )
    }
  }

  const isLoading = isLoadingSubmission
  const category = categories.find((c) => c.id === submission?.categoryId)
  const currentScore = watch('score')

  // Verificar que el ID sea válido
  if (!id || !isValidGuid(id)) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          ID de submission inválido. Por favor, vuelve a la lista de evaluaciones.
        </Alert>
        <Button onClick={() => navigate('/evaluation')} sx={{ mt: 2 }}>
          Volver a Evaluaciones
        </Button>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (submissionError || !submission) {
    // Extraer mensaje de error más descriptivo
    const error = submissionError as any
    const status = error?.status
    let errorMessage = 'Submission no encontrada.'
    
    if (status === 401) {
      errorMessage = 'No autorizado. Por favor, cierra sesión e inicia sesión nuevamente.'
    } else if (status === 404) {
      errorMessage = 'Submission no encontrada.'
    } else if (error?.data?.message) {
      errorMessage = error.data.message
    } else if (error?.error) {
      errorMessage = error.error
    }
    
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{errorMessage}</Alert>
        <Button onClick={() => navigate('/evaluation')} sx={{ mt: 2 }}>
          Volver a Evaluaciones
        </Button>
      </Box>
    )
  }

  if (!currentAssignment) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          No tienes una asignación para evaluar esta submission.
        </Alert>
        <Button onClick={() => navigate('/evaluation')} sx={{ mt: 2 }}>
          Volver a Evaluaciones
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/evaluation')} sx={{ mb: 3 }}>
        Volver a Evaluaciones
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Evaluar Submission
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Información de la Submission */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de la Submission
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Título:</strong> {submission.title || 'Sin título'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Descripción:</strong> {submission.description || 'Sin descripción'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Concurso:</strong> {contest?.title || submission.contestId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Categoría:</strong> {category?.name || submission.categoryId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Estado:</strong>{' '}
                <Chip label={submission.status} size="small" color="primary" />
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Archivos:</strong>
                </Typography>
                {files.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {files.map((file) => (
                      <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Download />}
                          onClick={async () => {
                            try {
                              setErrorMessage(null)
                              const authToken = token || localStorage.getItem('token')
                              
                              if (!authToken) {
                                setErrorMessage('No estás autenticado. Por favor, cierra sesión e inicia sesión nuevamente.')
                                setTimeout(() => setErrorMessage(null), 5000)
                                return
                              }

                              const response = await fetch(
                                `/api/submission/files/Download?filePath=${encodeURIComponent(file.storedPath)}`,
                                {
                                  headers: {
                                    'Authorization': `Bearer ${authToken}`,
                                  },
                                }
                              )
                              
                              if (response.ok) {
                                const blob = await response.blob()
                                const url = window.URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = file.originalName
                                document.body.appendChild(a)
                                a.click()
                                window.URL.revokeObjectURL(url)
                                document.body.removeChild(a)
                                
                                setSuccessMessage(`Archivo "${file.originalName}" descargado exitosamente`)
                                setTimeout(() => setSuccessMessage(null), 3000)
                              } else {
                                let errorMessage = 'Error al descargar el archivo. Por favor, intenta de nuevo.'
                                try {
                                  const errorData = await response.json()
                                  errorMessage = errorData.message || errorMessage
                                } catch {
                                  // Si no se puede parsear el JSON, usar el mensaje por defecto
                                  if (response.status === 403) {
                                    errorMessage = 'No tienes permisos para descargar este archivo.'
                                  } else if (response.status === 404) {
                                    errorMessage = 'El archivo no se encuentra en el servidor.'
                                  } else if (response.status === 401) {
                                    errorMessage = 'No autorizado. Por favor, cierra sesión e inicia sesión nuevamente.'
                                  } else if (response.status === 500) {
                                    errorMessage = 'Error del servidor. Por favor, intenta más tarde.'
                                  }
                                }
                                setErrorMessage(errorMessage)
                                setTimeout(() => setErrorMessage(null), 5000)
                              }
                            } catch (err) {
                              console.error('Error downloading file:', err)
                              setErrorMessage('Error al descargar el archivo. Por favor, intenta de nuevo.')
                              setTimeout(() => setErrorMessage(null), 5000)
                            }
                          }}
                          sx={{ textTransform: 'none', flexGrow: 1, justifyContent: 'flex-start' }}
                        >
                          {file.originalName}
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No hay archivos adjuntos para esta submission
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Resumen de Puntuación */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calificación
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h4" color="primary">
                {currentScore.toFixed(1)} / 10
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Puntuación Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Formulario de Evaluación */}
        <Grid item xs={12} md={8}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Evaluación
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 4 }}>
                  <Controller
                    name="score"
                    control={control}
                    defaultValue={0}
                    rules={{
                      required: 'La calificación es requerida',
                      min: { value: 1, message: 'La calificación debe ser al menos 1' },
                      max: { value: 10, message: 'La calificación no puede ser mayor a 10' },
                    }}
                    render={({ field }) => (
                      <Box>
                        <Typography gutterBottom>
                          Calificación: {field.value.toFixed(1)} / 10
                        </Typography>
                        <Slider
                          {...field}
                          min={1}
                          max={10}
                          step={0.1}
                          marks={[
                            { value: 1, label: '1' },
                            { value: 5, label: '5' },
                            { value: 10, label: '10' },
                          ]}
                          valueLabelDisplay="auto"
                          sx={{ mb: 2 }}
                        />
                        {errors.score && (
                          <Typography variant="caption" color="error">
                            {errors.score.message}
                          </Typography>
                        )}
                      </Box>
                    )}
                  />
                </Box>

                <Controller
                  name="comments"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Comentarios (opcional)"
                      multiline
                      rows={6}
                      placeholder="Agrega comentarios sobre esta submission..."
                      sx={{ mb: 3 }}
                    />
                  )}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/evaluation')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                  >
                    Guardar Evaluación
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EvaluationDetail
