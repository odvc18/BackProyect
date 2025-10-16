import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Notifications,
  AccountCircle,
  Settings,
  Logout,
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { logout } from '@store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { notifications } = useAppSelector((state) => state.ui)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    handleProfileMenuClose()
  }

  const handleProfile = () => {
    navigate('/profile')
    handleProfileMenuClose()
  }

  const handleSettings = () => {
    navigate('/settings')
    handleProfileMenuClose()
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      {/* Title */}
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        BackProyect
      </Typography>

      {/* Right side actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Notifications */}
        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
          onClick={handleNotificationMenuOpen}
        >
          <Badge badgeContent={unreadNotifications} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Profile Menu */}
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'secondary.main',
            }}
          >
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Perfil</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Configuración</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cerrar Sesión</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          id="notification-menu"
          anchorEl={notificationAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationMenuClose}
        >
          {notifications.length === 0 ? (
            <MenuItem disabled>
              <ListItemText>No hay notificaciones</ListItemText>
            </MenuItem>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <MenuItem key={notification.id}>
                <ListItemText
                  primary={notification.title}
                  secondary={notification.message}
                />
              </MenuItem>
            ))
          )}
        </Menu>
      </Box>
    </Box>
  )
}

export default Header


