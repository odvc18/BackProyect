import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Alert,
  MenuItem,
  Divider,
  IconButton,
  Paper,
} from '@mui/material'
import { ArrowBack, Save, Add, Delete } from '@mui/icons-material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppSelector } from '@store/hooks'
import { 
  useCreateContestMutation, 
  useUpdateContestMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetContestByIdQuery,
  useGetCategoriesByContestQuery,
} from '@store/api/contestApi'
import { ContestCreateDto, ContestUpdateDto, CategoryCreateDto, ContestStatus } from '@types'
import { useEffect } from 'react'

const contestSchema = yup.object({
  title: yup.string().required('El título es requerido').min(3, 'El título debe tener al menos 3 caracteres'),
  description: yup.string(),
  rules: yup.string(),
  status: yup.string().oneOf(['Draft', 'Published', 'Closed']).required('El estado es requerido'),
  startDate: yup.string().required('La fecha de inicio es requerida'),
  endDate: yup.string().required('La fecha de fin es requerida'),
  maxSubmissionsPerParticipant: yup.number().min(1, 'Debe ser al menos 1').required('El límite es requerido'),
  categories: yup.array().of(
    yup.object({
      id: yup.string().optional(), // ID opcional para identificar categorías existentes en modo edición
      name: yup.string().required('El nombre de la categoría es requerido'),
      description: yup.string(),
      maxSubmissions: yup.number().min(1),
      allowedFileTypes: yup.string(),
      maxFileSizeMb: yup.number().min(1).required('El tamaño máximo es requerido'),
    })
  ).min(1, 'Debe haber al menos una categoría'),
})

const ContestCreate: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  const { user } = useAppSelector((state) => state.auth)
  const [createContest, { isLoading: isCreatingContest }] = useCreateContestMutation()
  const [updateContest, { isLoading: isUpdatingContest }] = useUpdateContestMutation()
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Si estamos editando, obtener el concurso existente
  const { data: existingContest, isLoading: isLoadingContest } = useGetContestByIdQuery(id || '', {
    skip: !isEditMode,
  })
  const { data: existingCategories = [] } = useGetCategoriesByContestQuery(id || '', {
    skip: !isEditMode,
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContestCreateDto & { categories: (CategoryCreateDto & { id?: string })[] }>({
    resolver: yupResolver(contestSchema),
    defaultValues: {
      title: '',
      description: '',
      rules: '',
      status: 'Draft' as ContestStatus,
      startDate: '',
      endDate: '',
      maxSubmissionsPerParticipant: 1,
      createdByUserId: user?.id || '',
      categories: [
        {
          name: '',
          description: '',
          maxFileSizeMb: 100,
          allowedFileTypes: 'pdf,doc,docx',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  })

  // Cargar datos del concurso cuando esté en modo edición
  useEffect(() => {
    if (isEditMode && existingContest) {
      // Convertir fechas a formato datetime-local (YYYY-MM-DDTHH:mm)
      const formatDateTimeLocal = (date: string | Date) => {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }
      
      const startDate = formatDateTimeLocal(existingContest.startDate)
      const endDate = formatDateTimeLocal(existingContest.endDate)
      
      reset({
        title: existingContest.title,
        description: existingContest.description || '',
        rules: existingContest.rules || '',
        status: existingContest.status as ContestStatus,
        startDate,
        endDate,
        maxSubmissionsPerParticipant: existingContest.maxSubmissionsPerParticipant,
        createdByUserId: existingContest.createdByUserId,
        categories: existingCategories.length > 0
          ? existingCategories.map((cat) => ({
              id: cat.id, // Mantener el ID para identificar categorías existentes
              name: cat.name,
              description: cat.description || '',
              maxSubmissions: cat.maxSubmissions || undefined,
              allowedFileTypes: cat.allowedFileTypes || 'pdf,doc,docx',
              maxFileSizeMb: cat.maxFileSizeMb || 100,
            }))
          : [
              {
                name: '',
                description: '',
                maxFileSizeMb: 100,
                allowedFileTypes: 'pdf,doc,docx',
              },
            ],
      })
    }
  }, [existingContest, existingCategories, isEditMode, reset])

  const onSubmit = async (data: ContestCreateDto & { categories: (CategoryCreateDto & { id?: string })[] }) => {
    try {
      setError(null)
      setSuccess(false)

      if (!user?.id) {
        setError('Debes estar autenticado para crear un concurso')
        return
      }

      if (isEditMode && id) {
        // Modo edición
        // Convertir fechas de datetime-local a ISO string para el backend
        const convertToISO = (dateTimeLocal: string) => {
          return new Date(dateTimeLocal).toISOString()
        }

        const updateData: ContestUpdateDto = {
          id,
          title: data.title,
          description: data.description,
          rules: data.rules,
          status: data.status,
          endDate: convertToISO(data.endDate),
          judgingDate: existingContest?.judgingDate ? new Date(existingContest.judgingDate).toISOString() : undefined,
        }

        await updateContest(updateData).unwrap()

        // Manejar categorías: eliminar las que ya no están, crear las nuevas, actualizar las existentes
        if (existingCategories && existingCategories.length > 0) {
          // Eliminar categorías que ya no están en el formulario
          const categoryIdsInForm = data.categories
            .map((cat: any) => cat.id)
            .filter((id: string | undefined) => id !== undefined)
          
          const categoriesToDelete = existingCategories.filter(
            (existing) => !categoryIdsInForm.includes(existing.id)
          )

          for (const categoryToDelete of categoriesToDelete) {
            try {
              await deleteCategory(categoryToDelete.id).unwrap()
              console.log('Category deleted:', categoryToDelete.id)
            } catch (err: any) {
              console.error('Error deleting category:', err)
            }
          }

          // Crear nuevas categorías y actualizar existentes
          for (const category of data.categories) {
            try {
              if ((category as any).id) {
                // Actualizar categoría existente
                const existingCat = existingCategories.find((c) => c.id === (category as any).id)
                if (existingCat) {
                  // Verificar si hay cambios
                  const hasChanges = 
                    existingCat.name !== category.name ||
                    existingCat.description !== (category.description || '') ||
                    existingCat.maxSubmissions !== category.maxSubmissions ||
                    existingCat.allowedFileTypes !== (category.allowedFileTypes || '') ||
                    existingCat.maxFileSizeMb !== category.maxFileSizeMb

                  if (hasChanges) {
                    await updateCategory({
                      id: existingCat.id,
                      contestId: existingCat.contestId,
                      name: category.name,
                      description: category.description || '',
                      maxSubmissions: category.maxSubmissions || null,
                      allowedFileTypes: category.allowedFileTypes || '',
                      maxFileSizeMb: category.maxFileSizeMb,
                      createdAt: existingCat.createdAt,
                    }).unwrap()
                    console.log('Category updated:', existingCat.id)
                  }
                }
              } else {
                // Crear nueva categoría
                const newCategory = await createCategory({
                  ...category,
                  contestId: id,
                }).unwrap()
                console.log('Category created:', newCategory.id)
              }
            } catch (err: any) {
              console.error('Error saving category:', err)
              throw new Error(`Error al guardar la categoría "${category.name}": ${err?.data?.message || err?.message || 'Error desconocido'}`)
            }
          }
        } else {
          // No hay categorías existentes, crear todas como nuevas
          const categoryPromises = data.categories.map(async (category) => {
            try {
              console.log('Creating category:', category)
              const result = await createCategory({
                ...category,
                contestId: id,
              }).unwrap()
              console.log('Category created successfully:', result)
              return result
            } catch (err: any) {
              console.error('Error creating category:', err)
              throw new Error(`Error al crear la categoría "${category.name}": ${err?.data?.message || err?.message || 'Error desconocido'}`)
            }
          })
          await Promise.all(categoryPromises)
        }

        setSuccess(true)
        setTimeout(() => {
          navigate(`/contests/${id}`)
        }, 1500)
      } else {
        // Modo creación
        const contestData: ContestCreateDto = {
          title: data.title,
          description: data.description,
          rules: data.rules,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          maxSubmissionsPerParticipant: data.maxSubmissionsPerParticipant,
          createdByUserId: user.id,
        }

        const contest = await createContest(contestData).unwrap()

        // Crear las categorías una por una con manejo de errores mejorado
        const categoryPromises = data.categories.map(async (category) => {
          try {
            console.log('Creating category:', category)
            const result = await createCategory({
              ...category,
              contestId: contest.id,
            }).unwrap()
            console.log('Category created successfully:', result)
            return result
          } catch (err: any) {
            console.error('Error creating category:', err)
            throw new Error(`Error al crear la categoría "${category.name}": ${err?.data?.message || err?.message || 'Error desconocido'}`)
          }
        })

        // Esperar a que todas las categorías se creen
        await Promise.all(categoryPromises)
        console.log(`✅ Todas las ${data.categories.length} categorías se crearon exitosamente`)

        setSuccess(true)
        setTimeout(() => {
          navigate(`/contests/${contest.id}`)
        }, 1500)
      }
    } catch (err: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} contest:`, err)
      setError(err?.data?.message || err?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el concurso`)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/contests')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {isEditMode ? 'Editar Concurso' : 'Crear Concurso'}
        </Typography>
      </Box>

      {/* Loading */}
      {isLoadingContest && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Cargando datos del concurso...
        </Alert>
      )}

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {isEditMode ? 'Concurso actualizado exitosamente. Redirigiendo...' : 'Concurso creado exitosamente. Redirigiendo...'}
        </Alert>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Información Básica */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información Básica
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Título del Concurso"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      sx={{ mb: 3 }}
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
                      sx={{ mb: 3 }}
                    />
                  )}
                />

                <Controller
                  name="rules"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Reglas"
                      multiline
                      rows={6}
                      error={!!errors.rules}
                      helperText={errors.rules?.message}
                      sx={{ mb: 3 }}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Configuración */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configuración
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Estado"
                      error={!!errors.status}
                      helperText={errors.status?.message}
                      sx={{ mb: 3 }}
                      required
                    >
                      <MenuItem value="Draft">Borrador</MenuItem>
                      <MenuItem value="Published">Publicado</MenuItem>
                      <MenuItem value="Closed">Cerrado</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="datetime-local"
                      label="Fecha de Inicio"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.startDate}
                      helperText={isEditMode ? 'La fecha de inicio no se puede modificar' : errors.startDate?.message}
                      sx={{ mb: 3 }}
                      required
                      disabled={isEditMode}
                    />
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="datetime-local"
                      label="Fecha de Fin"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.endDate}
                      helperText={errors.endDate?.message}
                      sx={{ mb: 3 }}
                      required
                    />
                  )}
                />

                <Controller
                  name="maxSubmissionsPerParticipant"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Máximo de Submissions por Participante"
                      inputProps={{ min: 1 }}
                      error={!!errors.maxSubmissionsPerParticipant}
                      helperText={errors.maxSubmissionsPerParticipant?.message}
                      required
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Categorías */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Categorías
                  </Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={() => append({
                      name: '',
                      description: '',
                      maxFileSizeMb: 100,
                      allowedFileTypes: 'pdf,doc,docx',
                    })}
                    variant="outlined"
                    size="small"
                  >
                    Agregar Categoría
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {fields.map((field, index) => (
                  <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Categoría {index + 1}
                      </Typography>
                      {fields.length > 1 && (
                        <IconButton
                          onClick={() => remove(index)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name={`categories.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Nombre de la Categoría"
                              error={!!errors.categories?.[index]?.name}
                              helperText={errors.categories?.[index]?.name?.message}
                              required
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name={`categories.${index}.maxFileSizeMb`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type="number"
                              label="Tamaño Máximo (MB)"
                              inputProps={{ min: 1 }}
                              error={!!errors.categories?.[index]?.maxFileSizeMb}
                              helperText={errors.categories?.[index]?.maxFileSizeMb?.message}
                              required
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name={`categories.${index}.allowedFileTypes`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Tipos de Archivo Permitidos"
                              placeholder="pdf,doc,docx,jpg,png"
                              helperText="Separa con comas (ej: pdf,doc,jpg)"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name={`categories.${index}.maxSubmissions`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type="number"
                              label="Máximo de Submissions (opcional)"
                              inputProps={{ min: 1 }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name={`categories.${index}.description`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Descripción de la Categoría"
                              multiline
                              rows={2}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}

                {errors.categories && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.categories.message || 'Debe haber al menos una categoría'}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/contests')}
                disabled={isCreatingContest || isUpdatingContest || isLoadingContest}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={isCreatingContest || isUpdatingContest || isLoadingContest}
              >
                {isEditMode
                  ? isUpdatingContest
                    ? 'Actualizando...'
                    : 'Actualizar Concurso'
                  : isCreatingContest
                  ? 'Creando...'
                  : 'Crear Concurso'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default ContestCreate
