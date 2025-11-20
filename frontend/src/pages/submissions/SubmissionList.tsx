import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material'
import { Add, Visibility, Edit, People, CheckCircle } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppSelector } from '@store/hooks'
import { useGetAllSubmissionsQuery, useGetSubmissionsByParticipantQuery, useCreateSubmissionMutation, useUploadFileMutation } from '@store/api/submissionApi'
import { useGetActiveContestsQuery, useGetCategoriesByContestQuery } from '@store/api/contestApi'
import { useGetAllUsersQuery } from '@store/api/identityApi'
import { useCreateJudgeAssignmentMutation, useGetAssignmentsBySubmissionQuery, useDeleteAssignmentMutation } from '@store/api/evaluationApi'
import { SubmissionCreateDto } from '@types'
import { Checkbox, FormControlLabel, Chip, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material'

const submissionSchema = yup.object({
  contestId: yup.string().required('Debes seleccionar un concurso'),
  categoryId: yup.string().required('Debes seleccionar una categoría'),
  title: yup.string().required('El título es requerido'),
  description: yup.string(),
})

const SubmissionList: React.FC = () => {
  const navigate = useNavigate()
  const { user, token } = useAppSelector((state) => state.auth)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<{ id: string; contestId: string } | null>(null)
  const [selectedContestId, setSelectedContestId] = useState<string>('')
  const [selectedJudges, setSelectedJudges] = useState<string[]>([])
  
  // Queries
  const { data: contests = [], isLoading: contestsLoading } = useGetActiveContestsQuery()
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesByContestQuery(selectedContestId, {
    skip: !selectedContestId,
  })
  
  // Get submissions based on user role
  const { data: allSubmissions = [], isLoading: allSubmissionsLoading } = useGetAllSubmissionsQuery(undefined, {
    skip: user?.role !== 'Admin',
  })
  const { data: userSubmissions = [], isLoading: userSubmissionsLoading } = useGetSubmissionsByParticipantQuery(user?.id || '', {
    skip: !user?.id || user?.role === 'Admin',
  })
  
  const [createSubmission, { isLoading: isCreating }] = useCreateSubmissionMutation()
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation()
  const [createJudgeAssignment, { isLoading: isAssigning }] = useCreateJudgeAssignmentMutation()
  const [deleteAssignment] = useDeleteAssignmentMutation()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Obtener lista de usuarios con rol Judge
  const { data: allUsers = [], isLoading: isLoadingUsers } = useGetAllUsersQuery(undefined, {
    skip: user?.role !== 'Admin',
  })
  
  const judges = React.useMemo(() => {
    const filtered = allUsers.filter(u => {
      const role = u.role?.toString().toLowerCase()
      return role === 'judge'
    })
    console.log('All users:', allUsers)
    console.log('Judges filtered:', filtered)
    return filtered
  }, [allUsers])
  
  const submissions = user?.role === 'Admin' ? allSubmissions : userSubmissions
  const isLoading = allSubmissionsLoading || userSubmissionsLoading

  // Componente para cargar asignaciones de una submission
  const SubmissionRow: React.FC<{
    submission: any
    contestMap: Map<string, string>
    additionalContestNames: Map<string, string>
    categoryNamesMap: Map<string, string>
    judges: any[]
    user: any
    navigate: any
    setSelectedSubmission: (submission: { id: string; contestId: string } | null) => void
    setSelectedJudges: (judges: string[]) => void
    setOpenAssignDialog: (open: boolean) => void
  }> = ({
    submission,
    contestMap,
    additionalContestNames,
    categoryNamesMap,
    judges,
    user,
    navigate,
    setSelectedSubmission,
    setSelectedJudges,
    setOpenAssignDialog,
  }) => {
    const { data: assignments = [] } = useGetAssignmentsBySubmissionQuery(submission.id, {
      skip: user?.role !== 'Admin' || !submission.id,
    })

    const handleOpenAssignDialog = () => {
      setSelectedSubmission({ id: submission.id, contestId: submission.contestId })
      setSelectedJudges(assignments.map(a => a.judgeId))
      setOpenAssignDialog(true)
    }

    const assignedJudges = assignments.map(a => {
      const judge = judges.find(j => j.id === a.judgeId)
      return judge ? judge.email : a.judgeId
    })

    return (
      <TableRow hover>
        <TableCell>{submission.title || 'Sin título'}</TableCell>
        <TableCell>{contestMap.get(submission.contestId) || additionalContestNames.get(submission.contestId) || submission.contestId}</TableCell>
        <TableCell>{categoryNamesMap.get(submission.categoryId) || submission.categoryId}</TableCell>
        <TableCell>
          {new Date(submission.createdAt).toLocaleDateString()}
        </TableCell>
        {user?.role === 'Admin' && (
          <TableCell>
            {assignedJudges.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {assignedJudges.map((judgeEmail, idx) => (
                  <Chip
                    key={idx}
                    label={judgeEmail}
                    size="small"
                    icon={<CheckCircle />}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Sin asignar
              </Typography>
            )}
          </TableCell>
        )}
        <TableCell align="right">
          <IconButton
            size="small"
            onClick={() => navigate(`/submissions/${submission.id}`)}
          >
            <Visibility />
          </IconButton>
          {submission.status === 'Draft' && (
            <IconButton
              size="small"
              onClick={() => navigate(`/submissions/${submission.id}`)}
            >
              <Edit />
            </IconButton>
          )}
          {user?.role === 'Admin' && (
            <IconButton
              size="small"
              onClick={handleOpenAssignDialog}
              color="primary"
              title="Asignar Jueces"
            >
              <People />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    )
  }
  
  // Crear mapa de ID -> nombre para concursos
  const contestMap = React.useMemo(() => {
    const map = new Map<string, string>()
    contests.forEach(contest => {
      map.set(contest.id, contest.title)
    })
    return map
  }, [contests])
  
  // Cargar nombres de concursos que no están en la lista activa
  const [additionalContestNames, setAdditionalContestNames] = React.useState<Map<string, string>>(new Map())
  
  React.useEffect(() => {
    const loadAdditionalContestNames = async () => {
      const namesMap = new Map<string, string>()
      const uniqueContestIds = [...new Set(submissions.map(s => s.contestId))]
      
      // Cargar nombres de concursos que no están en la lista activa
      for (const contestId of uniqueContestIds) {
        if (!contestMap.has(contestId)) {
          try {
            const authToken = token || localStorage.getItem('token')
            const response = await fetch(`/api/contest/GetById?id=${contestId}`, {
              headers: {
                'Authorization': authToken ? `Bearer ${authToken}` : '',
                'Content-Type': 'application/json',
              },
            })
            
            if (response.ok) {
              const contestData = await response.json()
              namesMap.set(contestId, contestData.title)
            }
          } catch (err) {
            console.error('Error loading contest name:', contestId, err)
          }
        }
      }
      
      setAdditionalContestNames(namesMap)
    }
    
    if (submissions.length > 0) {
      loadAdditionalContestNames()
    }
  }, [submissions, token, contestMap])
  
  // Estado para almacenar nombres de categorías (categoryId -> name)
  const [categoryNamesMap, setCategoryNamesMap] = React.useState<Map<string, string>>(new Map())
  
  // Cargar nombres de categorías cuando cambien las submissions
  React.useEffect(() => {
    const loadCategoryNames = async () => {
      const namesMap = new Map<string, string>()
      const uniqueContestIds = [...new Set(submissions.map(s => s.contestId))]
      
      // Cargar categorías de cada concurso único
      for (const contestId of uniqueContestIds) {
        try {
          // Obtener token del estado de Redux (se pasa como dependencia)
          const authToken = token || localStorage.getItem('token')
          const response = await fetch(`/api/contest/categories/GetByContest?contestId=${contestId}`, {
            headers: {
              'Authorization': authToken ? `Bearer ${authToken}` : '',
              'Content-Type': 'application/json',
            },
          })
          
          if (response.ok) {
            const categoriesData = await response.json()
            categoriesData.forEach((cat: any) => {
              namesMap.set(cat.id, cat.name)
            })
          }
        } catch (err) {
          console.error('Error loading category names for contest:', contestId, err)
        }
      }
      
      setCategoryNamesMap(namesMap)
    }
    
    if (submissions.length > 0) {
      loadCategoryNames()
    }
  }, [submissions, token])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SubmissionCreateDto>({
    resolver: yupResolver(submissionSchema),
    defaultValues: {
      contestId: '',
      categoryId: '',
      title: '',
      description: '',
      participantId: user?.id || '',
    },
  })

  const watchedContestId = watch('contestId')

  React.useEffect(() => {
    setSelectedContestId(watchedContestId)
  }, [watchedContestId])

  const handleOpenDialog = () => {
    setOpenDialog(true)
    reset({
      contestId: '',
      categoryId: '',
      title: '',
      description: '',
      participantId: user?.id || '',
    })
    setSelectedContestId('')
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    reset()
    setSelectedContestId('')
    setSelectedFile(null)
  }

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false)
    setSelectedSubmission(null)
    setSelectedJudges([])
  }

  const handleAssignJudges = async () => {
    if (!selectedSubmission) return

    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      // Obtener asignaciones existentes
      const existingAssignments = await fetch(
        `/api/evaluation/assignments/GetBySubmission?submissionId=${selectedSubmission.id}`,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      ).then(res => res.json()).catch(() => [])

      const existingJudgeIds = existingAssignments.map((a: any) => a.judgeId)

      // Crear nuevas asignaciones para jueces seleccionados que no están asignados
      const judgesToAdd = selectedJudges.filter(judgeId => !existingJudgeIds.includes(judgeId))
      
      // Eliminar asignaciones para jueces que fueron deseleccionados
      const judgesToRemove = existingJudgeIds.filter((judgeId: string) => !selectedJudges.includes(judgeId))

      // Crear nuevas asignaciones
      const createPromises = judgesToAdd.map(async (judgeId: string) => {
        await createJudgeAssignment({
          contestId: selectedSubmission.contestId,
          submissionId: selectedSubmission.id,
          judgeId,
        }).unwrap()
      })

      // Eliminar asignaciones
      const deletePromises = judgesToRemove.map(async (judgeId: string) => {
        const assignmentToDelete = existingAssignments.find((a: any) => a.judgeId === judgeId)
        if (assignmentToDelete) {
          await deleteAssignment(assignmentToDelete.id).unwrap()
        }
      })

      await Promise.all([...createPromises, ...deletePromises])

      setSuccessMessage(`Jueces asignados exitosamente. ${judgesToAdd.length} nuevo(s), ${judgesToRemove.length} removido(s).`)
      handleCloseAssignDialog()

      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err: any) {
      console.error('Error assigning judges:', err)
      setErrorMessage(err?.data?.message || err?.message || 'Error al asignar jueces. Por favor, intenta de nuevo.')
    }
  }

  const onSubmit = async (data: SubmissionCreateDto) => {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      if (!user?.id) {
        setErrorMessage('Debes estar autenticado para crear una submission')
        return
      }

      const submissionData: SubmissionCreateDto = {
        ...data,
        participantId: user.id,
      }

      console.log('Creating submission with data:', submissionData)
      const submission = await createSubmission(submissionData).unwrap()
      console.log('Submission created:', submission)
      
      // Si hay un archivo seleccionado, subirlo
      if (selectedFile && submission.id) {
        try {
          console.log('Uploading file:', selectedFile.name)
          const fileResult = await uploadFile({
            submissionId: submission.id,
            file: selectedFile,
          }).unwrap()
          console.log('File uploaded successfully:', fileResult)
        } catch (uploadErr: any) {
          console.error('Error uploading file:', uploadErr)
          
          // Mejorar el manejo de errores
          let errorMsg = 'Error al subir el archivo'
          if (uploadErr?.data) {
            if (typeof uploadErr.data === 'string') {
              errorMsg = uploadErr.data
            } else if (uploadErr.data.message) {
              errorMsg = uploadErr.data.message
            } else if (uploadErr.data.error) {
              errorMsg = uploadErr.data.error
            }
          } else if (uploadErr?.message) {
            errorMsg = uploadErr.message
          } else if (uploadErr?.status) {
            if (uploadErr.status === 400) {
              errorMsg = 'Datos inválidos. Verifica el archivo y la submission.'
            } else if (uploadErr.status === 401) {
              errorMsg = 'No autorizado. Por favor, cierra sesión e inicia sesión nuevamente.'
            } else if (uploadErr.status === 404) {
              errorMsg = 'Submission no encontrada.'
            } else if (uploadErr.status === 500) {
              errorMsg = 'Error del servidor. Por favor, intenta más tarde.'
            } else {
              errorMsg = `Error HTTP ${uploadErr.status}`
            }
          }
          
          setErrorMessage(`Submission creada exitosamente, pero hubo un error al subir el archivo: ${errorMsg}`)
        }
      }

      if (!errorMessage) {
        setSuccessMessage('Submission creada exitosamente')
      }
      
      handleCloseDialog()
      setSelectedFile(null)
      
      // Limpiar mensajes después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null)
        setErrorMessage(null)
      }, 3000)
    } catch (err: any) {
      console.error('Error creating submission:', err)
      const errorMsg = err?.data?.message || err?.message || 'Error al crear la submission. Por favor, intenta de nuevo.'
      setErrorMessage(errorMsg)
    }
  }


  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Submissions
        </Typography>
        {(user?.role === 'Participant' || user?.role === 'Admin') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
          >
            Nueva Submission
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

      {/* Submissions Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              {user?.role === 'Admin'
                ? 'No hay submissions en el sistema'
                : 'No has creado ninguna submission. Haz clic en "Nueva Submission" para comenzar.'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Concurso</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                {user?.role === 'Admin' && <TableCell>Jueces Asignados</TableCell>}
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <SubmissionRow
                  key={submission.id}
                  submission={submission}
                  contestMap={contestMap}
                  additionalContestNames={additionalContestNames}
                  categoryNamesMap={categoryNamesMap}
                  judges={judges}
                  user={user}
                  navigate={navigate}
                  setSelectedSubmission={setSelectedSubmission}
                  setSelectedJudges={setSelectedJudges}
                  setOpenAssignDialog={setOpenAssignDialog}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Submission Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Nueva Submission</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Controller
                name="contestId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Concurso"
                    error={!!errors.contestId}
                    helperText={errors.contestId?.message}
                    sx={{ mb: 3 }}
                    disabled={contestsLoading || isCreating}
                    required
                  >
                    {contests.map((contest) => (
                      <MenuItem key={contest.id} value={contest.id}>
                        {contest.title}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Categoría"
                    error={!!errors.categoryId}
                    helperText={errors.categoryId?.message || (!selectedContestId && 'Selecciona un concurso primero')}
                    sx={{ mb: 3 }}
                    disabled={!selectedContestId || categoriesLoading || isCreating}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

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
                    disabled={isCreating}
                    required
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
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isCreating || isUploading}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Archivo (opcional)
                </Typography>
                <input
                  accept="*/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setSelectedFile(file)
                  }}
                  disabled={isCreating || isUploading}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={isCreating || isUploading}
                    sx={{ mr: 2 }}
                  >
                    Seleccionar Archivo
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
                {selectedContestId && categories.length > 0 && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Tipos permitidos: {categories.find(c => c.id === watch('categoryId'))?.allowedFileTypes || 'Todos'}
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isCreating || isUploading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isCreating || isUploading}>
              {isCreating || isUploading ? 'Procesando...' : 'Crear Submission'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Assign Judges Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Jueces a Submission</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {judges.length === 0 ? (
              <Alert severity="info">
                No hay jueces disponibles en el sistema. Crea usuarios con rol "Judge" primero.
              </Alert>
            ) : (
              <List>
                {judges.map((judge) => (
                  <ListItem key={judge.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedJudges.includes(judge.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedJudges([...selectedJudges, judge.id])
                            } else {
                              setSelectedJudges(selectedJudges.filter(id => id !== judge.id))
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {judge.firstName?.charAt(0) || judge.email.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">
                              {judge.firstName && judge.lastName
                                ? `${judge.firstName} ${judge.lastName}`
                                : judge.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {judge.email}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog} disabled={isAssigning}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssignJudges}
            variant="contained"
            disabled={isAssigning || judges.length === 0}
          >
            {isAssigning ? 'Asignando...' : 'Asignar Jueces'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SubmissionList
