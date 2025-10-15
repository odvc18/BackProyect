import React from 'react'
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
  Chip,
  Avatar,
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
  const { user } = useAppSelector((state) => state.auth)
  
  // Fetch data from APIs
  const { data: contests = [], isLoading: contestsLoading } = useGetActiveContestsQuery()
  const { data: submissions = [], isLoading: submissionsLoading } = useGetAllSubmissionsQuery()
  const { data: assignments = [], isLoading: assignmentsLoading } = useGetAllAssignmentsQuery()
  const { data: metrics, isLoading: metricsLoading } = useGetAnalysisMetricsQuery()

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
      <List>
        {contests.slice(0, 5).map((contest) => (
          <ListItem key={contest.id} divider>
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
    </Paper>
  )

  const QuickActions: React.FC = () => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Acciones Rápidas
      </Typography>
      <List>
        <ListItem button>
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText primary="Crear Concurso" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Upload />
          </ListItemIcon>
          <ListItemText primary="Nueva Submission" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary="Evaluar Submission" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Psychology />
          </ListItemIcon>
          <ListItemText primary="Análisis IA" />
        </ListItem>
      </List>
    </Paper>
  )

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ¡Bienvenido, {user?.firstName || user?.email}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Aquí tienes un resumen de tu actividad en BackProyect
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Concursos Activos"
            value={stats.activeContests}
            icon={<EmojiEvents />}
            color="primary.main"
            subtitle={`de ${stats.totalContests} totales`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Submissions"
            value={stats.totalSubmissions}
            icon={<Upload />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Evaluaciones Pendientes"
            value={stats.pendingEvaluations}
            icon={<Assessment />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Análisis IA"
            value={stats.totalAnalyses}
            icon={<Psychology />}
            color="info.main"
          />
        </Grid>
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
                title="Usuarios"
                value={0} // TODO: Get from API
                icon={<People />}
                color="secondary.main"
              />
            </Grid>
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
    </Box>
  )
}

export default Dashboard
