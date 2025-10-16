import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const EvaluationDetail: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Detalle de Evaluación
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Formulario de Evaluación
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta página permitirá a los jueces evaluar submissions específicas.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EvaluationDetail
