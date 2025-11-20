import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  IconButton,
  Chip,
} from '@mui/material'
import { ArrowBack, Edit, Delete, Upload } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useAppSelector } from '@store/hooks'
import {
  useGetSubmissionByIdQuery,
  useUpdateSubmissionMutation,
  useGetFilesBySubmissionQuery,
  useUploadFileMutation,
  useDeleteSubmissionFileMutation,
} from '@store/api/submissionApi'
import { useGetContestByIdQuery, useGetCategoriesByContestQuery } from '@store/api/contestApi'
import { Submission } from '@types'

const SubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Queries
  const { data: submission, isLoading: isLoadingSubmission, error: submissionError } = useGetSubmissionByIdQuery(id || '', {
    skip: !id,
  })
  const { data: contest } = useGetContestByIdQuery(submission?.contestId || '', {
    skip: !submission?.contestId,
  })
  const { data: categories = [] } = useGetCategoriesByContestQuery(submission?.contestId || '', {
    skip: !submission?.contestId,
  })
  const { data: files = [], isLoading: isLoadingFiles } = useGetFilesBySubmissionQuery(id || '', {
    skip: !id,
  })

  const [updateSubmission, { isLoading: isUpdating }] = useUpdateSubmissionMutation()
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation()
  const [deleteFile, { isLoading: isDeleting }] = useDeleteSubmissionFileMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ title: string; description: string }>({
    defaultValues: {
      title: submission?.title || '',
      description: submission?.description || '',
    },
  })

  // Actualizar formulario cuando se carga la submission
  React.useEffect(() => {
    if (submission) {
      reset({
        title: submission.title || '',
        description: submission.description || '',
      })
    }
  }, [submission, reset])

  const category = categories.find((c) => c.id === submission?.categoryId)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset({
      title: submission?.title || '',
      description: submission?.description || '',
    })
  }

  const onSubmit = async (data: { title: string; description: string }) => {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      if (!submission) return

      const updatedSubmission: Submission = {
        ...submission,
        title: data.title,
        description: data.description,
      }

      await updateSubmission(updatedSubmission).unwrap()
      setSuccessMessage('Submission actualizada exitosamente')
      setIsEditing(false)

      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err: any) {
      console.error('Error updating submission:', err)
      setErrorMessage(err?.data?.message || err?.message || 'Error al actualizar la submission')
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile || !id) return

    try {
      setErrorMessage(null)
      setSuccessMessage(null)
      
      const result = await uploadFile({
        submissionId: id,
        file: selectedFile,
      }).unwrap()
      
      setSuccessMessage(`Archivo "${selectedFile.name}" subido exitosamente`)
      setSelectedFile(null)
      
      // Resetear el input de archivo
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }

      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (err: any) {
      console.error('Error uploading file:', err)
      
      // Mejorar el manejo de errores
      let errorMsg = 'Error al subir el archivo'
      if (err?.data) {
        if (typeof err.data === 'string') {
          errorMsg = err.data
        } else if (err.data.message) {
          errorMsg = err.data.message
        } else if (err.data.error) {
          errorMsg = err.data.error
        }
      } else if (err?.message) {
        errorMsg = err.message
      }
      
      setErrorMessage(errorMsg)
      
      // Mantener el error visible por más tiempo
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) return

    try {
      setErrorMessage(null)
      await deleteFile(fileId).unwrap()
      setSuccessMessage('Archivo eliminado exitosamente')

      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err: any) {
      console.error('Error deleting file:', err)
      setErrorMessage(err?.data?.message || err?.message || 'Error al eliminar el archivo')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'success'
      case 'UnderReview':
        return 'warning'
      case 'Evaluated':
        return 'info'
      case 'Rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  if (isLoadingSubmission) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (submissionError || !submission) {
    return (
      <Box>
        <Alert severity="error">
          {submissionError ? 'Error al cargar la submission' : 'Submission no encontrada'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/submissions')} sx={{ mt: 2 }}>
          Volver a Submissions
        </Button>
      </Box>
    )
  }

  const canEdit = user?.id === submission.participantId && submission.status === 'Draft'

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/submissions')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Detalle de Submission
          </Typography>
        </Box>
        {canEdit && !isEditing && (
          <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}>
            Editar
          </Button>
        )}
      </Box>

      {/* Messages */}
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
        {/* Información Principal */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Título"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Descripción"
                        multiline
                        rows={6}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        sx={{ mb: 3 }}
                      />
                    )}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" disabled={isUpdating}>
                      {isUpdating ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button variant="outlined" onClick={handleCancel} disabled={isUpdating}>
                      Cancelar
                    </Button>
                  </Box>
                </form>
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Título
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {submission.title || 'Sin título'}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Descripción
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {submission.description || 'Sin descripción'}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estado
                  </Typography>
                  <Chip
                    label={submission.status}
                    color={getStatusColor(submission.status) as any}
                    sx={{ mb: 3 }}
                  />

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Fecha de Creación
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {new Date(submission.createdAt).toLocaleString()}
                  </Typography>

                  {submission.submittedAt && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Fecha de Envío
                      </Typography>
                      <Typography variant="body1">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </Typography>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Información del Concurso */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Concurso
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Nombre
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {contest?.title || 'Cargando...'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Categoría
              </Typography>
              <Typography variant="body1">
                {category?.name || 'Cargando...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Archivos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Archivos
                </Typography>
                {canEdit && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        accept="*/*"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setSelectedFile(file)
                          setErrorMessage(null)
                          setSuccessMessage(null)
                        }}
                        disabled={isUploading}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<Upload />}
                          disabled={isUploading}
                        >
                          Seleccionar Archivo
                        </Button>
                      </label>
                      {selectedFile && (
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={handleFileUpload}
                            disabled={isUploading}
                            startIcon={isUploading ? <CircularProgress size={16} /> : <Upload />}
                          >
                            {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              {isLoadingFiles ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : files.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay archivos adjuntos
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {files.map((file) => (
                    <Paper key={file.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1">{file.originalName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB - {file.mimeType}
                        </Typography>
                      </Box>
                      <Box>
                        {canEdit && (
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteFile(file.id)}
                            disabled={isDeleting}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SubmissionDetail
