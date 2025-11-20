-- =============================================
-- Script para permitir NULL en rubric_criterion_id
-- =============================================
-- Este script modifica la tabla scores y el stored procedure
-- para permitir que rubric_criterion_id sea NULL
-- =============================================

USE evaluation_db;
GO

-- 1. Modificar la tabla para permitir NULL en rubric_criterion_id
PRINT 'Modificando tabla scores para permitir NULL en rubric_criterion_id...';
GO

ALTER TABLE scores
ALTER COLUMN rubric_criterion_id UNIQUEIDENTIFIER NULL;
GO

PRINT '✅ Tabla scores modificada exitosamente';
GO

-- 2. Eliminar el stored procedure si existe
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_scores_create]') AND type in (N'P', N'PC'))
BEGIN
    DROP PROCEDURE [dbo].[sp_scores_create];
    PRINT 'Stored procedure sp_scores_create eliminado';
END
GO

-- 3. Recrear el stored procedure con rubric_criterion_id opcional
PRINT 'Creando stored procedure sp_scores_create con rubric_criterion_id opcional...';
GO

CREATE PROCEDURE sp_scores_create
    @judge_assignment_id UNIQUEIDENTIFIER,
    @rubric_criterion_id UNIQUEIDENTIFIER = NULL,
    @score DECIMAL(5,2),
    @comments NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    BEGIN TRY
        INSERT INTO scores (id, judge_assignment_id, rubric_criterion_id, score, comments)
        VALUES (@new_id, @judge_assignment_id, @rubric_criterion_id, @score, @comments);
        
        -- Update judge assignment status
        UPDATE judge_assignments SET status = 'Completed', completed_at = GETDATE()
        WHERE id = @judge_assignment_id;
        
        SELECT * FROM scores WHERE id = @new_id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO

PRINT '✅ Stored procedure sp_scores_create creado exitosamente';
GO

PRINT '';
PRINT '========================================';
PRINT '✅ Script ejecutado exitosamente';
PRINT '========================================';
PRINT 'La tabla scores ahora permite NULL en rubric_criterion_id';
PRINT 'El stored procedure sp_scores_create acepta NULL en @rubric_criterion_id';
PRINT '========================================';
GO

