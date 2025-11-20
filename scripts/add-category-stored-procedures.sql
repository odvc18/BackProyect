USE contest_db;
GO

-- Eliminar los stored procedures si existen
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_categories_update]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_categories_update]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_categories_delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_categories_delete]
GO

-- UPDATE Category
CREATE PROCEDURE sp_categories_update
    @category_id UNIQUEIDENTIFIER,
    @name NVARCHAR(255) = NULL,
    @description NVARCHAR(MAX) = NULL,
    @max_submissions INT = NULL,
    @allowed_file_types NVARCHAR(500) = NULL,
    @max_file_size_mb INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE categories 
    SET name = ISNULL(@name, name),
        description = ISNULL(@description, description),
        max_submissions = ISNULL(@max_submissions, max_submissions),
        allowed_file_types = ISNULL(@allowed_file_types, allowed_file_types),
        max_file_size_mb = ISNULL(@max_file_size_mb, max_file_size_mb)
    WHERE id = @category_id;
    
    SELECT * FROM categories WHERE id = @category_id;
END
GO

-- DELETE Category
CREATE PROCEDURE sp_categories_delete
    @category_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @deleted_count INT = 0;
    
    -- Verificar si la categoría existe antes de eliminar
    IF EXISTS (SELECT 1 FROM categories WHERE id = @category_id)
    BEGIN
        -- Eliminar la categoría
        DELETE FROM categories WHERE id = @category_id;
        SET @deleted_count = @@ROWCOUNT;
        
        -- Retornar 1 si se eliminó correctamente
        SELECT CASE WHEN @deleted_count > 0 THEN 1 ELSE 0 END AS deleted;
    END
    ELSE
    BEGIN
        -- La categoría no existe
        SELECT 0 AS deleted;
    END
END
GO

PRINT '✅ Stored procedures de categorías creados exitosamente';
PRINT '📝 Procedimientos disponibles:';
PRINT '   - sp_categories_update';
PRINT '   - sp_categories_delete';
GO

