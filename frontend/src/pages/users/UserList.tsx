import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const UserList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Usuarios
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta página permitirá a los administradores gestionar usuarios del sistema.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserList

