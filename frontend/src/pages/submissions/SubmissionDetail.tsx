import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const SubmissionDetail: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Detalle de Submission
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información de la Submission
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta página mostrará los detalles completos de una submission específica.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SubmissionDetail
