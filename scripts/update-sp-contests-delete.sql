-- =============================================
-- ACTUALIZAR STORED PROCEDURE sp_contests_delete
-- =============================================
-- Este script actualiza el stored procedure de eliminación de concursos
-- Ejecutar en la base de datos contest_db

USE contest_db;
GO

-- Eliminar el stored procedure si existe
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_contests_delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_contests_delete]
GO

-- CREATE PROCEDURE sp_contests_delete (versión mejorada)
CREATE PROCEDURE sp_contests_delete
    @contest_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @deleted_count INT = 0;
    
    -- Verificar si el concurso existe antes de eliminar
    IF EXISTS (SELECT 1 FROM contests WHERE id = @contest_id)
    BEGIN
        -- Eliminar categorías relacionadas primero
        DELETE FROM categories WHERE contest_id = @contest_id;
        SET @deleted_count = @deleted_count + @@ROWCOUNT;
        
        -- Eliminar el concurso
        DELETE FROM contests WHERE id = @contest_id;
        SET @deleted_count = @deleted_count + @@ROWCOUNT;
        
        -- Retornar 1 si se eliminó correctamente (al menos el concurso)
        SELECT CASE WHEN @deleted_count > 0 THEN 1 ELSE 0 END AS deleted;
    END
    ELSE
    BEGIN
        -- El concurso no existe
        SELECT 0 AS deleted;
    END
END
GO

PRINT '✅ Stored procedure sp_contests_delete actualizado exitosamente';
GO


