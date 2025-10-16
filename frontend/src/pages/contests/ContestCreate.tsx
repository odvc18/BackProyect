import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'

const ContestCreate: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/contests')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Crear Concurso
        </Typography>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={() => {
            // TODO: Implement save functionality
            console.log('Save contest')
          }}
        >
          Guardar
        </Button>
      </Box>

      {/* Form Placeholder */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Formulario de Creación de Concurso
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Este formulario será implementado en la siguiente fase del desarrollo.
            Incluirá campos para:
          </Typography>
          <Box component="ul" sx={{ mt: 2, pl: 2 }}>
            <li>Título del concurso</li>
            <li>Descripción</li>
            <li>Reglas</li>
            <li>Fechas de inicio y fin</li>
            <li>Límite de submissions</li>
            <li>Categorías</li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ContestCreate
