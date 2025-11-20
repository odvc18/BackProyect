import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material'
import { useAppSelector } from '@store/hooks'
import { useGetActiveContestsQuery, useGetCategoriesByContestQuery } from '@store/api/contestApi'
import { useGetScoresByContestQuery, useGetScoresByCategoryQuery } from '@store/api/evaluationApi'
import { useGetAllSubmissionsQuery } from '@store/api/submissionApi'
import { useGetAllUsersQuery } from '@store/api/identityApi'

interface ScoreWithDetails {
  score: any
  submission: any
  judge: any
  contest: any
  category: any
}

const ScoresPanel: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [selectedContestId, setSelectedContestId] = useState<string>('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [filterType, setFilterType] = useState<'contest' | 'category'>('contest')

  const { data: contests = [] } = useGetActiveContestsQuery()
  const { data: categories = [] } = useGetCategoriesByContestQuery(selectedContestId, {
    skip: !selectedContestId || filterType !== 'category',
  })

  // Obtener scores según el filtro
  const { data: scoresByContest = [], isLoading: isLoadingContestScores } = useGetScoresByContestQuery(
    selectedContestId,
    {
      skip: !selectedContestId || filterType !== 'contest',
    }
  )

  const { data: scoresByCategory = [], isLoading: isLoadingCategoryScores } = useGetScoresByCategoryQuery(
    selectedCategoryId,
    {
      skip: !selectedCategoryId || filterType !== 'category',
    }
  )

  // Obtener datos adicionales
  const { data: allSubmissions = [] } = useGetAllSubmissionsQuery(undefined, {
    skip: user?.role !== 'Admin',
  })
  const { data: allUsers = [] } = useGetAllUsersQuery(undefined, {
    skip: user?.role !== 'Admin',
  })

  const scores = filterType === 'contest' ? scoresByContest : scoresByCategory
  const isLoading = isLoadingContestScores || isLoadingCategoryScores

  // Enriquecer scores con información adicional
  const enrichedScores: ScoreWithDetails[] = useMemo(() => {
    return scores.map((score) => {
      // Buscar la asignación para obtener submissionId
      const assignment = allSubmissions.find((s: any) => {
        // Necesitamos obtener la asignación, pero no tenemos acceso directo
        // Por ahora, intentaremos buscar por submissionId en los datos disponibles
        return false // Placeholder
      })

      // Buscar el juez
      const judge = allUsers.find((u: any) => {
        // Necesitamos el judgeId de la asignación
        return false // Placeholder
      })

      // Buscar el concurso
      const contest = contests.find((c: any) => c.id === selectedContestId)

      // Buscar la categoría
      const category = categories.find((c: any) => c.id === selectedCategoryId)

      return {
        score,
        submission: null,
        judge: null,
        contest,
        category,
      }
    })
  }, [scores, allSubmissions, allUsers, contests, categories, selectedContestId, selectedCategoryId])

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (scores.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        count: 0,
      }
    }

    const values = scores.map((s: any) => s.value)
    const total = values.reduce((sum: number, val: number) => sum + val, 0)
    const average = total / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    return {
      total,
      average,
      min,
      max,
      count: values.length,
    }
  }, [scores])

  if (user?.role !== 'Admin') {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          Solo los administradores pueden acceder a este panel.
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Calificaciones
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Filtros */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filtros
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                select
                fullWidth
                label="Tipo de Filtro"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as 'contest' | 'category')
                  setSelectedContestId('')
                  setSelectedCategoryId('')
                }}
                sx={{ mb: 2 }}
              >
                <MenuItem value="contest">Por Concurso</MenuItem>
                <MenuItem value="category">Por Categoría</MenuItem>
              </TextField>

              {filterType === 'contest' && (
                <TextField
                  select
                  fullWidth
                  label="Concurso"
                  value={selectedContestId}
                  onChange={(e) => setSelectedContestId(e.target.value)}
                >
                  <MenuItem value="">Seleccionar concurso</MenuItem>
                  {contests.map((contest: any) => (
                    <MenuItem key={contest.id} value={contest.id}>
                      {contest.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {filterType === 'category' && (
                <>
                  <TextField
                    select
                    fullWidth
                    label="Concurso"
                    value={selectedContestId}
                    onChange={(e) => {
                      setSelectedContestId(e.target.value)
                      setSelectedCategoryId('')
                    }}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="">Seleccionar concurso</MenuItem>
                    {contests.map((contest: any) => (
                      <MenuItem key={contest.id} value={contest.id}>
                        {contest.title}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Categoría"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    disabled={!selectedContestId}
                  >
                    <MenuItem value="">Seleccionar categoría</MenuItem>
                    {categories.map((category: any) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Estadísticas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estadísticas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {!selectedContestId && filterType === 'contest' && (
                <Alert severity="info">Selecciona un concurso para ver las estadísticas</Alert>
              )}
              {(!selectedContestId || !selectedCategoryId) && filterType === 'category' && (
                <Alert severity="info">Selecciona un concurso y categoría para ver las estadísticas</Alert>
              )}
              
              {(selectedContestId || (selectedContestId && selectedCategoryId)) && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total de Calificaciones
                    </Typography>
                    <Typography variant="h5">{stats.count}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Promedio
                    </Typography>
                    <Typography variant="h5">{stats.average.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Mínimo
                    </Typography>
                    <Typography variant="h5">{stats.min.toFixed(1)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Máximo
                    </Typography>
                    <Typography variant="h5">{stats.max.toFixed(1)}</Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Calificaciones */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : !selectedContestId && filterType === 'contest' ? (
        <Alert severity="info">Selecciona un concurso para ver las calificaciones</Alert>
      ) : (!selectedContestId || !selectedCategoryId) && filterType === 'category' ? (
        <Alert severity="info">Selecciona un concurso y categoría para ver las calificaciones</Alert>
      ) : scores.length === 0 ? (
        <Alert severity="info">No hay calificaciones para los filtros seleccionados</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Calificación</TableCell>
                <TableCell>Comentarios</TableCell>
                <TableCell>Fecha de Evaluación</TableCell>
                {filterType === 'category' && <TableCell>Categoría</TableCell>}
                {filterType === 'contest' && <TableCell>Concurso</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((score: any) => (
                <TableRow key={score.id} hover>
                  <TableCell>
                    <Chip
                      label={`${score.value.toFixed(1)} / 10`}
                      color={score.value >= 7 ? 'success' : score.value >= 5 ? 'warning' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {score.comments || (
                      <Typography variant="body2" color="text.secondary">
                        Sin comentarios
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(score.scoredAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  {filterType === 'category' && (
                    <TableCell>
                      {categories.find((c: any) => c.id === selectedCategoryId)?.name || selectedCategoryId}
                    </TableCell>
                  )}
                  {filterType === 'contest' && (
                    <TableCell>
                      {contests.find((c: any) => c.id === selectedContestId)?.title || selectedContestId}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default ScoresPanel




