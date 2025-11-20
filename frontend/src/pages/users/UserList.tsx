import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@store/api/identityApi'
import { User, UserCreateDto, UserUpdateDto, UserRole } from '@types'

// Esquema de validación para crear usuario
const createUserSchema = yup.object({
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
  role: yup.string().oneOf(['Admin', 'Judge', 'Participant', 'Viewer']).required('El rol es requerido'),
  firstName: yup.string(),
  lastName: yup.string(),
  phone: yup.string(),
  institution: yup.string(),
})

// Esquema de validación para actualizar usuario
const updateUserSchema = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
  phone: yup.string(),
  institution: yup.string(),
})

const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data: users = [], isLoading, error, refetch } = useGetAllUsersQuery()
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  // Formulario para crear usuario
  const {
    control: createControl,
    handleSubmit: handleCreateSubmit,
    formState: { errors: createErrors },
    reset: resetCreateForm,
  } = useForm<UserCreateDto>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'Participant' as UserRole,
      firstName: '',
      lastName: '',
      phone: '',
      institution: '',
    },
  })

  // Formulario para actualizar usuario
  const {
    control: updateControl,
    handleSubmit: handleUpdateSubmit,
    formState: { errors: updateErrors },
    reset: resetUpdateForm,
  } = useForm<UserUpdateDto>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
      institution: '',
    },
  })

  const handleOpenCreateDialog = () => {
    resetCreateForm()
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
    resetCreateForm()
  }

  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user)
    resetUpdateForm({
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      institution: user.institution || '',
    })
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setSelectedUser(null)
    resetUpdateForm()
  }

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setDeleteError(null)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedUser(null)
    setDeleteError(null)
  }

  const onCreateSubmit = async (data: UserCreateDto) => {
    try {
      // Transformar password a passwordHash para el backend
      // El backend espera passwordHash en lugar de password
      const userDataToSend: any = {
        email: data.email,
        passwordHash: data.password,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        institution: data.institution,
      }
      await createUser(userDataToSend).unwrap()
      handleCloseCreateDialog()
      refetch()
    } catch (err: any) {
      console.error('Error creating user:', err)
    }
  }

  const onUpdateSubmit = async (data: UserUpdateDto) => {
    if (!selectedUser) return
    try {
      await updateUser(data).unwrap()
      handleCloseEditDialog()
      refetch()
    } catch (err: any) {
      console.error('Error updating user:', err)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return
    try {
      setDeleteError(null)
      await deleteUser(selectedUser.id).unwrap()
      handleCloseDeleteDialog()
      refetch()
    } catch (err: any) {
      console.error('Error deleting user:', err)
      setDeleteError(err?.data?.message || err?.message || 'Error al eliminar el usuario')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'error'
      case 'Judge':
        return 'warning'
      case 'Participant':
        return 'success'
      case 'Viewer':
        return 'info'
      default:
        return 'default'
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los usuarios
        </Alert>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {error && 'data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data
            ? (error.data as any).message
            : 'No se pudo conectar con el servidor. Verifica que el servicio ws-identity esté corriendo.'}
        </Typography>
        <Button variant="outlined" onClick={() => refetch()}>
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
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Crear Usuario
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar usuarios..."
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
          label="Rol"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Judge">Juez</MenuItem>
          <MenuItem value="Participant">Participante</MenuItem>
          <MenuItem value="Viewer">Viewer</MenuItem>
        </TextField>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Institución</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron usuarios
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstName || '-'}</TableCell>
                  <TableCell>{user.lastName || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>{user.institution || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Activo' : 'Inactivo'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                      icon={user.isActive ? <Visibility /> : <VisibilityOff />}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(user)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(user)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateSubmit(onCreateSubmit)}>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Controller
                name="email"
                control={createControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!createErrors.email}
                    helperText={createErrors.email?.message}
                    required
                  />
                )}
              />
              <Controller
                name="password"
                control={createControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contraseña"
                    type="password"
                    error={!!createErrors.password}
                    helperText={createErrors.password?.message}
                    required
                  />
                )}
              />
              <Controller
                name="role"
                control={createControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Rol"
                    error={!!createErrors.role}
                    helperText={createErrors.role?.message}
                    required
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Judge">Juez</MenuItem>
                    <MenuItem value="Participant">Participante</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="firstName"
                control={createControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre"
                    error={!!createErrors.firstName}
                    helperText={createErrors.firstName?.message}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={createControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Apellido"
                    error={!!createErrors.lastName}
                    helperText={createErrors.lastName?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={createControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Teléfono"
                    error={!!createErrors.phone}
                    helperText={createErrors.phone?.message}
                  />
                )}
              />
              <Controller
                name="institution"
                control={createControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Institución"
                    error={!!createErrors.institution}
                    helperText={createErrors.institution?.message}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateDialog} disabled={isCreating}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleUpdateSubmit(onUpdateSubmit)}>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                value={selectedUser?.email || ''}
                disabled
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Rol"
                value={selectedUser?.role || ''}
                disabled
                sx={{ mb: 1 }}
              />
              <Controller
                name="firstName"
                control={updateControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre"
                    error={!!updateErrors.firstName}
                    helperText={updateErrors.firstName?.message}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={updateControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Apellido"
                    error={!!updateErrors.lastName}
                    helperText={updateErrors.lastName?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={updateControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Teléfono"
                    error={!!updateErrors.phone}
                    helperText={updateErrors.phone?.message}
                  />
                )}
              />
              <Controller
                name="institution"
                control={updateControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Institución"
                    error={!!updateErrors.institution}
                    helperText={updateErrors.institution?.message}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isUpdating}>
              {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            ¿Estás seguro de que deseas eliminar el usuario "{selectedUser?.email}"?
            Esta acción no se puede deshacer.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
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

export default UserList












