import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import { Visibility, MoreVert, CheckCircle, Pending, Assignment } from '@mui/icons-material'
import { useAppSelector } from '@store/hooks'
import {
  useGetAssignmentsByJudgeQuery,
  useUpdateAssignmentStatusMutation,
} from '@store/api/evaluationApi'
import { useGetSubmissionByIdQuery } from '@store/api/submissionApi'
import { useGetContestByIdQuery } from '@store/api/contestApi'
import { AssignmentStatus } from '@types'

// Función auxiliar para validar si un string es un GUID válido
const isValidGuid = (str: string | undefined): boolean => {
  if (!str) return false
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return guidRegex.test(str)
}

const EvaluationList: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null)

  // Validar que el usuario tenga un ID válido y sea Judge
  const isValidUser = user?.id && isValidGuid(user.id) && user?.role === 'Judge'

  const { data: assignments = [], isLoading, error } = useGetAssignmentsByJudgeQuery(
    user?.id || '',
    {
      skip: !isValidUser,
    }
  )

  const [updateStatus] = useUpdateAssignmentStatusMutation()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, assignmentId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedAssignmentId(assignmentId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedAssignmentId(null)
  }

  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null)
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(null)

  const handleStatusChange = async (status: AssignmentStatus) => {
    if (!selectedAssignmentId) return

    try {
      setStatusUpdateError(null)
      setStatusUpdateSuccess(null)
      await updateStatus({
        id: selectedAssignmentId,
        status,
      }).unwrap()
      setStatusUpdateSuccess(`Estado actualizado a "${status}" exitosamente.`)
      handleMenuClose()
      setTimeout(() => {
        setStatusUpdateSuccess(null)
      }, 3000)
    } catch (err: any) {
      console.error('Error updating assignment status:', err)
      setStatusUpdateError(err?.data?.message || err?.message || 'Error al actualizar el estado.')
      setTimeout(() => {
        setStatusUpdateError(null)
      }, 5000)
    }
  }

  const handleViewSubmission = (submissionId: string) => {
    // Validar que el submissionId sea un GUID válido antes de navegar
    if (!submissionId || !isValidGuid(submissionId)) {
      console.error('Invalid submissionId:', submissionId)
      setStatusUpdateError('ID de submission inválido. Por favor, intenta de nuevo.')
      return
    }
    navigate(`/evaluation/${submissionId}`)
  }

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'InProgress':
        return 'warning'
      case 'Assigned':
        return 'info'
      case 'Overdue':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: AssignmentStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle fontSize="small" />
      case 'InProgress':
        return <Pending fontSize="small" />
      default:
        return <Assignment fontSize="small" />
    }
  }

  // Agrupar asignaciones por estado
  const groupedAssignments = useMemo(() => {
    const groups: Record<AssignmentStatus, typeof assignments> = {
      Assigned: [],
      InProgress: [],
      Completed: [],
      Overdue: [],
    }

    assignments.forEach((assignment) => {
      groups[assignment.status as AssignmentStatus]?.push(assignment)
    })

    return groups
  }, [assignments])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Verificar rol antes de mostrar errores
  if (user?.role !== 'Judge') {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          Solo los usuarios con rol de Juez pueden acceder a esta sección.
        </Alert>
      </Box>
    )
  }

  // Verificar que el usuario tenga un ID válido
  if (!user?.id || !isValidGuid(user.id)) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Error: No se pudo obtener la información del usuario. Por favor, cierra sesión e inicia sesión nuevamente.
        </Alert>
      </Box>
    )
  }

  if (error) {
    // Extraer mensaje de error más descriptivo
    const errorMessage = 
      (error as any)?.data?.message || 
      (error as any)?.error || 
      'Error al cargar las asignaciones. Por favor, intenta de nuevo.'
    
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          {errorMessage}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mis Evaluaciones
        </Typography>
      </Box>

      {statusUpdateError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setStatusUpdateError(null)}>
          {statusUpdateError}
        </Alert>
      )}
      {statusUpdateSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setStatusUpdateSuccess(null)}>
          {statusUpdateSuccess}
        </Alert>
      )}

      {assignments.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              No tienes asignaciones pendientes.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Concurso</TableCell>
                <TableCell>Submission</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha de Asignación</TableCell>
                <TableCell>Fecha de Finalización</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
                  onViewSubmission={handleViewSubmission}
                  onMenuOpen={handleMenuOpen}
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleStatusChange('Assigned')}>Marcar como Asignado</MenuItem>
        <MenuItem onClick={() => handleStatusChange('InProgress')}>
          Marcar como En Progreso
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Completed')}>
          Marcar como Completado
        </MenuItem>
      </Menu>
    </Box>
  )
}

// Componente auxiliar para mostrar una fila de asignación
interface AssignmentRowProps {
  assignment: any
  onViewSubmission: (submissionId: string) => void
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, assignmentId: string) => void
  onStatusChange: (status: AssignmentStatus) => void
  getStatusColor: (status: AssignmentStatus) => 'success' | 'warning' | 'info' | 'error' | 'default'
  getStatusIcon: (status: AssignmentStatus) => React.ReactNode
}

const AssignmentRow: React.FC<AssignmentRowProps> = ({
  assignment,
  onViewSubmission,
  onMenuOpen,
  getStatusColor,
  getStatusIcon,
}) => {
  const { data: submission } = useGetSubmissionByIdQuery(assignment.submissionId, {
    skip: !assignment.submissionId,
  })
  const { data: contest } = useGetContestByIdQuery(assignment.contestId, {
    skip: !assignment.contestId,
  })

  return (
    <TableRow hover>
      <TableCell>{contest?.title || assignment.contestId}</TableCell>
      <TableCell>{submission?.title || assignment.submissionId}</TableCell>
      <TableCell>
        <Chip
          icon={getStatusIcon(assignment.status as AssignmentStatus)}
          label={assignment.status}
          color={getStatusColor(assignment.status as AssignmentStatus)}
          size="small"
        />
      </TableCell>
      <TableCell>{new Date(assignment.assignedAt).toLocaleDateString()}</TableCell>
      <TableCell>
        {assignment.completedAt
          ? new Date(assignment.completedAt).toLocaleDateString()
          : '-'}
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={() => onViewSubmission(assignment.submissionId)}
          color="primary"
        >
          <Visibility />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => onMenuOpen(e, assignment.id)}
          color="default"
        >
          <MoreVert />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default EvaluationList
