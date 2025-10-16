import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Card, CardContent, Grid, Chip, Button } from '@mui/material'
import { Edit, ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useGetContestByIdQuery } from '@store/api/contestApi'

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: contest, isLoading, error } = useGetContestByIdQuery(id!)

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
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/contests/${contest.id}/edit`)}
        >
          Editar
        </Button>
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
    </Box>
  )
}

export default ContestDetail
