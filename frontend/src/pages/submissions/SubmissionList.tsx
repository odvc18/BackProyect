import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const SubmissionList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Submissions
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Submissions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta página mostrará todas las submissions del sistema.
            Funcionalidades incluirán:
          </Typography>
          <Box component="ul" sx={{ mt: 2, pl: 2 }}>
            <li>Lista de submissions con filtros</li>
            <li>Estado de cada submission</li>
            <li>Archivos adjuntos</li>
            <li>Acciones de gestión</li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SubmissionList
