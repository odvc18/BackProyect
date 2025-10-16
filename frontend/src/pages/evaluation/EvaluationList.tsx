import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const EvaluationList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Evaluaciones
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Panel de Evaluación
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta página permitirá a los jueces gestionar sus evaluaciones asignadas.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EvaluationList
