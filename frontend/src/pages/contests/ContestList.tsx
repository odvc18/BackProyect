import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useGetActiveContestsQuery, useDeleteContestMutation } from '@store/api/contestApi'
import { useAppSelector } from '@store/hooks'
import { Contest } from '@types'
import { Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'

const ContestList: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data: contests = [], isLoading, error, refetch } = useGetActiveContestsQuery()
  const [deleteContest, { isLoading: isDeleting }] = useDeleteContestMutation()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, contest: Contest) => {
    setAnchorEl(event.currentTarget)
    setSelectedContest(contest)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    // No limpiar selectedContest aquí porque podría usarse en el diálogo de eliminación
  }

  const handleEdit = () => {
    if (selectedContest) {
      navigate(`/contests/${selectedContest.id}/edit`)
    }
    setAnchorEl(null)
    setSelectedContest(null)
  }

  const handleView = () => {
    if (selectedContest) {
      navigate(`/contests/${selectedContest.id}`)
    }
    setAnchorEl(null)
    setSelectedContest(null)
  }

  const handleDeleteClick = () => {
    console.log('Delete clicked, selectedContest:', selectedContest)
    if (!selectedContest) {
      console.error('No contest selected for deletion')
      return
    }
    setAnchorEl(null) // Cerrar el menú pero mantener selectedContest
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    console.log('Delete confirm clicked, selectedContest:', selectedContest)
    if (!selectedContest) {
      console.error('No contest selected for deletion')
      setDeleteError('No se ha seleccionado un concurso para eliminar')
      return
    }

    try {
      console.log('Attempting to delete contest:', selectedContest.id)
      setDeleteError(null)
      const result = await deleteContest(selectedContest.id).unwrap()
      console.log('Delete successful, result:', result)
      setDeleteDialogOpen(false)
      const contestId = selectedContest.id // Guardar el ID antes de limpiar
      setSelectedContest(null)
      refetch() // Refrescar la lista
      console.log('Contest deleted successfully:', contestId)
    } catch (err: any) {
      console.error('Error deleting contest:', err)
      console.error('Error details:', {
        status: err?.status,
        data: err?.data,
        message: err?.message,
      })
      setDeleteError(err?.data?.message || err?.message || 'Error al eliminar el concurso')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedContest(null)
    setDeleteError(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'success'
      case 'Draft':
        return 'default'
      case 'Closed':
        return 'warning'
      case 'Judging':
        return 'info'
      case 'Completed':
        return 'primary'
      default:
        return 'default'
    }
  }

  const filteredContests = contests.filter((contest) => {
    const matchesSearch = contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contest.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || contest.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Cargando concursos...</Typography>
      </Box>
    )
  }

  if (error) {
    console.error('Error loading contests:', error)
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error al cargar los concursos
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {error && 'data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data
            ? (error.data as any).message
            : 'No se pudo conectar con el servidor. Verifica que el servicio ws-contest esté corriendo en el puerto 5002.'}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Concursos
        </Typography>
        {user?.role === 'Admin' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/contests/create')}
          >
            Crear Concurso
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar concursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <TextField
          select
          label="Estado"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Published">Publicados</MenuItem>
          <MenuItem value="Draft">Borrador</MenuItem>
          <MenuItem value="Closed">Cerrados</MenuItem>
          <MenuItem value="Judging">En Evaluación</MenuItem>
          <MenuItem value="Completed">Completados</MenuItem>
        </TextField>
      </Box>

      {/* Contests Grid */}
      <Grid container spacing={3}>
        {filteredContests.map((contest) => (
          <Grid item xs={12} sm={6} md={4} key={contest.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" noWrap>
                    {contest.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, contest)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {contest.description || 'Sin descripción'}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={contest.status}
                    color={getStatusColor(contest.status) as any}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(contest.endDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Máx. submissions: {contest.maxSubmissionsPerParticipant}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => navigate(`/contests/${contest.id}`)}
                >
                  Ver Detalles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredContests.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron concursos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchTerm || filterStatus !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Crea tu primer concurso para comenzar'
            }
          </Typography>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <Visibility sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        {user?.role === 'Admin' && (
          <MenuItem onClick={handleEdit}>
            <Edit sx={{ mr: 1 }} />
            Editar
          </MenuItem>
        )}
        {user?.role === 'Admin' && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Estás seguro de que deseas eliminar el concurso "{selectedContest?.title}"?
            Esta acción no se puede deshacer y también se eliminarán todas las categorías asociadas.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ContestList
