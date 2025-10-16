import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const UserProfile: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Perfil de Usuario
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información del Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta página permitirá a los usuarios gestionar su perfil personal.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserProfile

