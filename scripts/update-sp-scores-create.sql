-- Actualizar stored procedure para permitir rubric_criterion_id NULL
USE evaluation_db;
GO

-- Eliminar el stored procedure si existe
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_scores_create]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_scores_create]
GO

-- Recrear el stored procedure con rubric_criterion_id opcional
CREATE PROCEDURE sp_scores_create
    @judge_assignment_id UNIQUEIDENTIFIER,
    @rubric_criterion_id UNIQUEIDENTIFIER = NULL,
    @score DECIMAL(5,2),
    @comments NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO scores (id, judge_assignment_id, rubric_criterion_id, score, comments)
    VALUES (@new_id, @judge_assignment_id, @rubric_criterion_id, @score, @comments);
    
    -- Update judge assignment status
    UPDATE judge_assignments SET status = 'Completed', completed_at = GETDATE()
    WHERE id = @judge_assignment_id;
    
    SELECT * FROM scores WHERE id = @new_id;
END
GO

PRINT '✅ Stored procedure sp_scores_create actualizado';
GO




