-- Modificar tabla scores para hacer rubric_criterion_id opcional
USE evaluation_db;
GO

-- Eliminar la restricción NOT NULL de rubric_criterion_id
ALTER TABLE scores
ALTER COLUMN rubric_criterion_id UNIQUEIDENTIFIER NULL;
GO

PRINT '✅ Tabla scores modificada: rubric_criterion_id ahora es opcional (NULL)';
GO




