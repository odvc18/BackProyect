import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Chip,
} from '@mui/material'
import {
  Dashboard,
  EmojiEvents,
  Upload,
  Assessment,
  Psychology,
  People,
  Settings,
  Logout,
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { logout } from '@store/slices/authSlice'
import { UserRole } from '@types'

interface SidebarProps {
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
      roles: ['Admin', 'Judge', 'Participant', 'Viewer'] as UserRole[],
    },
    {
      id: 'contests',
      label: 'Concursos',
      path: '/contests',
      icon: <EmojiEvents />,
      roles: ['Admin', 'Judge', 'Participant', 'Viewer'] as UserRole[],
    },
    {
      id: 'submissions',
      label: 'Submissions',
      path: '/submissions',
      icon: <Upload />,
      roles: ['Admin', 'Judge', 'Participant'] as UserRole[],
    },
    {
      id: 'evaluation',
      label: 'Evaluación',
      path: '/evaluation',
      icon: <Assessment />,
      roles: ['Admin', 'Judge'] as UserRole[],
    },
    {
      id: 'ai-analysis',
      label: 'Análisis IA',
      path: '/ai-analysis',
      icon: <Psychology />,
      roles: ['Admin', 'Judge'] as UserRole[],
    },
    {
      id: 'users',
      label: 'Usuarios',
      path: '/users',
      icon: <People />,
      roles: ['Admin'] as UserRole[],
    },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    if (onClose) {
      onClose()
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const canAccess = (roles: UserRole[]) => {
    return user && roles.includes(user.role)
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Profile Section */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              mr: 2,
            }}
          >
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email}
            </Typography>
            <Chip
              label={user?.role}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List>
          {navigationItems.map((item) => {
            if (!canAccess(item.roles)) return null

            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>

      <Divider />

      {/* Bottom Actions */}
      <Box sx={{ p: 1 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/profile')}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                },
              }}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mx: 1,
                borderRadius: 1,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}

export default Sidebar
