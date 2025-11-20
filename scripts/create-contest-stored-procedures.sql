-- =============================================
-- CREAR STORED PROCEDURES PARA CONTEST_DB
-- =============================================
-- Este script crea todos los stored procedures necesarios para el servicio ws-contest
-- Ejecutar en la base de datos contest_db

USE contest_db;
GO

-- Verificar si los stored procedures ya existen y eliminarlos
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_contests_create]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_contests_create]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_contests_get_by_id]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_contests_get_by_id]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_contests_get_by_active]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_contests_get_by_active]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_contests_get_active]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_contests_get_active]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_contests_update]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_contests_update]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_categories_create]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_categories_create]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_categories_get_by_contest]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_categories_get_by_contest]
GO

GO

-- =============================================
-- STORED PROCEDURES PARA CONTESTS
-- =============================================

-- CREATE Contest
CREATE PROCEDURE sp_contests_create
    @title NVARCHAR(255),
    @description NVARCHAR(MAX) = NULL,
    @rules NVARCHAR(MAX) = NULL,
    @status NVARCHAR(50),
    @start_date DATETIME2,
    @end_date DATETIME2,
    @judging_date DATETIME2 = NULL,
    @max_submissions_per_participant INT = 1,
    @created_by_user_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO contests (id, title, description, rules, status, start_date, end_date, 
                         judging_date, max_submissions_per_participant, created_by_user_id)
    VALUES (@new_id, @title, @description, @rules, @status, @start_date, @end_date,
            @judging_date, @max_submissions_per_participant, @created_by_user_id);
    
    SELECT * FROM contests WHERE id = @new_id;
END
GO

-- READ Contest by ID
CREATE PROCEDURE sp_contests_get_by_id
    @contest_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM contests WHERE id = @contest_id;
END
GO

-- READ Active Contests (nombre usado por el código)
CREATE PROCEDURE sp_contests_get_by_active
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM contests 
    WHERE status IN ('Published', 'Draft', 'Closed', 'Judging', 'Completed')
    ORDER BY start_date DESC;
END
GO

-- READ Active Contests (nombre alternativo del script original)
CREATE PROCEDURE sp_contests_get_active
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM contests 
    WHERE status IN ('Published', 'Closed') 
    ORDER BY start_date DESC;
END
GO

-- UPDATE Contest
CREATE PROCEDURE sp_contests_update
    @contest_id UNIQUEIDENTIFIER,
    @title NVARCHAR(255) = NULL,
    @description NVARCHAR(MAX) = NULL,
    @rules NVARCHAR(MAX) = NULL,
    @status NVARCHAR(50) = NULL,
    @end_date DATETIME2 = NULL,
    @judging_date DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE contests 
    SET title = ISNULL(@title, title),
        description = ISNULL(@description, description),
        rules = ISNULL(@rules, rules),
        status = ISNULL(@status, status),
        end_date = ISNULL(@end_date, end_date),
        judging_date = ISNULL(@judging_date, judging_date),
        updated_at = GETDATE()
    WHERE id = @contest_id;
    
    SELECT * FROM contests WHERE id = @contest_id;
END
GO

-- DELETE Contest
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

-- =============================================
-- STORED PROCEDURES PARA CATEGORIES
-- =============================================

-- CREATE Category
CREATE PROCEDURE sp_categories_create
    @contest_id UNIQUEIDENTIFIER,
    @name NVARCHAR(255),
    @description NVARCHAR(MAX) = NULL,
    @max_submissions INT = NULL,
    @allowed_file_types NVARCHAR(500) = NULL,
    @max_file_size_mb INT = 100
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_id UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO categories (id, contest_id, name, description, max_submissions, allowed_file_types, max_file_size_mb)
    VALUES (@new_id, @contest_id, @name, @description, @max_submissions, @allowed_file_types, @max_file_size_mb);
    
    SELECT * FROM categories WHERE id = @new_id;
END
GO

-- READ Categories by Contest
CREATE PROCEDURE sp_categories_get_by_contest
    @contest_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM categories 
    WHERE contest_id = @contest_id
    ORDER BY name;
END
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

PRINT '✅ Stored procedures creados exitosamente en contest_db';
PRINT '📝 Procedimientos disponibles:';
PRINT '   - sp_contests_create';
PRINT '   - sp_contests_get_by_id';
PRINT '   - sp_contests_get_by_active';
PRINT '   - sp_contests_get_active';
PRINT '   - sp_contests_update';
PRINT '   - sp_contests_delete';
PRINT '   - sp_categories_create';
PRINT '   - sp_categories_get_by_contest';
PRINT '   - sp_categories_update';
PRINT '   - sp_categories_delete';

