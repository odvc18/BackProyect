import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Card, CardContent, Grid, Chip, Button, Divider } from '@mui/material'
import { Edit, ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useGetContestByIdQuery, useGetCategoriesByContestQuery } from '@store/api/contestApi'
import { useAppSelector } from '@store/hooks'

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const { data: contest, isLoading, error } = useGetContestByIdQuery(id!)
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesByContestQuery(id!)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Cargando concurso...</Typography>
      </Box>
    )
  }

  if (error || !contest) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          Error al cargar el concurso o el concurso no existe.
        </Typography>
      </Box>
    )
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
          {contest.title}
        </Typography>
        {user?.role === 'Admin' && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/contests/${contest.id}/edit`)}
          >
            Editar
          </Button>
        )}
      </Box>

      {/* Contest Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Descripción
              </Typography>
              <Typography variant="body1" paragraph>
                {contest.description || 'Sin descripción disponible'}
              </Typography>

              {contest.rules && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Reglas
                  </Typography>
                  <Typography variant="body1">
                    {contest.rules}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Concurso
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Estado
                </Typography>
                <Chip label={contest.status} color="primary" />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Inicio
                </Typography>
                <Typography variant="body1">
                  {new Date(contest.startDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Fin
                </Typography>
                <Typography variant="body1">
                  {new Date(contest.endDate).toLocaleDateString()}
                </Typography>
              </Box>

              {contest.judgingDate && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Evaluación
                  </Typography>
                  <Typography variant="body1">
                    {new Date(contest.judgingDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Máximo de Submissions por Participante
                </Typography>
                <Typography variant="body1">
                  {contest.maxSubmissionsPerParticipant}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Categories Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Categorías
              </Typography>
              {categoriesLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Cargando categorías...
                </Typography>
              ) : categories.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay categorías disponibles para este concurso.
                </Typography>
              ) : (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {categories.map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {category.name}
                          </Typography>
                          {category.description && (
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {category.description}
                            </Typography>
                          )}
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ mt: 1 }}>
                            {category.maxSubmissions && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                Máx. submissions: {category.maxSubmissions}
                              </Typography>
                            )}
                            {category.allowedFileTypes && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                Tipos de archivo: {category.allowedFileTypes}
                              </Typography>
                            )}
                            <Typography variant="caption" display="block" color="text.secondary">
                              Tamaño máximo: {category.maxFileSizeMb} MB
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ContestDetail
