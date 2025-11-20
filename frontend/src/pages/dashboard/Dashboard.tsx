import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  EmojiEvents,
  Upload,
  Assessment,
  Psychology,
  TrendingUp,
  People,
} from '@mui/icons-material'
import { useAppSelector } from '@store/hooks'
import { useGetActiveContestsQuery } from '@store/api/contestApi'
import { useGetAllSubmissionsQuery } from '@store/api/submissionApi'
import { useGetAllAssignmentsQuery } from '@store/api/evaluationApi'
import { useGetAnalysisMetricsQuery } from '@store/api/aiAnalysisApi'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  
  // Fetch data from APIs
  const { data: contests = [], isLoading: contestsLoading, error: contestsError } = useGetActiveContestsQuery()
  const { data: submissions = [], isLoading: submissionsLoading, error: submissionsError } = useGetAllSubmissionsQuery()
  const { data: assignments = [], isLoading: assignmentsLoading, error: assignmentsError } = useGetAllAssignmentsQuery(undefined, {
    skip: user?.role !== 'Admin' && user?.role !== 'Judge', // Solo Admin y Judge necesitan ver todas las asignaciones
  })
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useGetAnalysisMetricsQuery(undefined, {
    skip: user?.role !== 'Admin', // Solo Admin necesita ver métricas de IA
  })
  
  const isLoading = contestsLoading || submissionsLoading || assignmentsLoading || metricsLoading

  // Calculate stats
  const stats = {
    totalContests: contests.length,
    activeContests: contests.filter(c => c.status === 'Published').length,
    totalSubmissions: submissions.length,
    pendingEvaluations: assignments.filter(a => a.status === 'Assigned').length,
    completedEvaluations: assignments.filter(a => a.status === 'Completed').length,
    totalAnalyses: metrics?.totalRequests || 0,
  }

  const StatCard: React.FC<{
    title: string
    value: number
    icon: React.ReactNode
    color: string
    subtitle?: string
  }> = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  const RecentActivity: React.FC = () => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Actividad Reciente
      </Typography>
      {contestsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : contests.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            No hay concursos disponibles
          </Typography>
        </Box>
      ) : (
        <List>
          {contests.slice(0, 5).map((contest) => (
            <ListItem 
              key={contest.id} 
              divider
              component={ListItemButton}
              onClick={() => navigate(`/contests/${contest.id}`)}
            >
              <ListItemIcon>
                <EmojiEvents color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={contest.title}
                secondary={`Estado: ${contest.status}`}
              />
              <Chip
                label={contest.status}
                size="small"
                color={contest.status === 'Published' ? 'success' : 'default'}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  )

  const QuickActions: React.FC = () => {
    const canCreateContest = user?.role === 'Admin'
    const canCreateSubmission = user?.role === 'Participant' || user?.role === 'Admin'
    const canEvaluate = user?.role === 'Judge' || user?.role === 'Admin'
    const canViewAnalysis = user?.role === 'Judge' || user?.role === 'Admin'

    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Acciones Rápidas
        </Typography>
        <List>
          {canCreateContest && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/contests/create')}>
                <ListItemIcon>
                  <EmojiEvents color="primary" />
                </ListItemIcon>
                <ListItemText primary="Crear Concurso" />
              </ListItemButton>
            </ListItem>
          )}
          {canCreateSubmission && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/submissions')}>
                <ListItemIcon>
                  <Upload color="primary" />
                </ListItemIcon>
                <ListItemText primary="Nueva Submission" />
              </ListItemButton>
            </ListItem>
          )}
          {canEvaluate && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/evaluation')}>
                <ListItemIcon>
                  <Assessment color="primary" />
                </ListItemIcon>
                <ListItemText primary="Evaluar Submission" />
              </ListItemButton>
            </ListItem>
          )}
          {canViewAnalysis && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/evaluation')}>
                <ListItemIcon>
                  <Psychology color="primary" />
                </ListItemIcon>
                <ListItemText primary="Análisis IA" secondary="Ver en Evaluación" />
              </ListItemButton>
            </ListItem>
          )}
          {user?.role === 'Admin' && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/users')}>
                <ListItemIcon>
                  <People color="primary" />
                </ListItemIcon>
                <ListItemText primary="Gestionar Usuarios" />
              </ListItemButton>
            </ListItem>
          )}
          {!canCreateContest && !canCreateSubmission && !canEvaluate && !canViewAnalysis && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                No hay acciones disponibles para tu rol
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
    )
  }

  // Show errors if any
  const hasErrors = contestsError || submissionsError || assignmentsError || metricsError

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ¡Bienvenido, {user?.firstName || user?.email}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Aquí tienes un resumen de tu actividad en EGOSCORE
        </Typography>
      </Box>

      {/* Error Messages */}
      {hasErrors && (
        <Box sx={{ mb: 3 }}>
          {contestsError && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              Error al cargar concursos. Algunas funciones pueden estar limitadas.
            </Alert>
          )}
          {submissionsError && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              Error al cargar submissions. Algunas funciones pueden estar limitadas.
            </Alert>
          )}
        </Box>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Concursos Activos"
            value={isLoading && !contests.length ? 0 : stats.activeContests}
            icon={<EmojiEvents />}
            color="primary.main"
            subtitle={contests.length > 0 ? `de ${stats.totalContests} totales` : undefined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Submissions"
            value={isLoading && !submissions.length ? 0 : stats.totalSubmissions}
            icon={<Upload />}
            color="success.main"
          />
        </Grid>
        {(user?.role === 'Admin' || user?.role === 'Judge') && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Evaluaciones Pendientes"
                value={isLoading && !assignments.length ? 0 : stats.pendingEvaluations}
                icon={<Assessment />}
                color="warning.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Análisis IA"
                value={isLoading && !metrics ? 0 : stats.totalAnalyses}
                icon={<Psychology />}
                color="info.main"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <RecentActivity />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickActions />
        </Grid>
      </Grid>

      {/* Role-specific content */}
      {user?.role === 'Admin' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Panel de Administración
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Evaluaciones Completadas"
                value={stats.completedEvaluations}
                icon={<TrendingUp />}
                color="success.main"
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && contests.length === 0 && submissions.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay datos disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role === 'Admin' 
              ? 'Comienza creando tu primer concurso'
              : 'Aún no hay concursos o submissions disponibles'}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Dashboard
