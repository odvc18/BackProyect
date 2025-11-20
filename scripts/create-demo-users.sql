-- =============================================
-- CREAR USUARIOS DE PRUEBA CON @demo.com
-- =============================================
-- Este script crea usuarios de prueba con el dominio @demo.com
-- Si los usuarios ya existen, los actualiza con la contraseña correcta

USE identity_db;
GO

-- Verificar si los usuarios existen y actualizarlos, o crearlos si no existen
-- Administrador
IF EXISTS (SELECT 1 FROM users WHERE email = 'admin@demo.com')
BEGIN
    UPDATE users 
    SET password_hash = '123456',
        role = 'Admin',
        first_name = 'Admin',
        last_name = 'Sistema',
        is_active = 1
    WHERE email = 'admin@demo.com';
    PRINT '✅ Usuario admin@demo.com actualizado';
END
ELSE
BEGIN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active)
    VALUES (NEWID(), 'admin@demo.com', '123456', 'Admin', 'Admin', 'Sistema', 1);
    PRINT '✅ Usuario admin@demo.com creado';
END
GO

-- Juez
IF EXISTS (SELECT 1 FROM users WHERE email = 'judge1@demo.com')
BEGIN
    UPDATE users 
    SET password_hash = '123456',
        role = 'Judge',
        first_name = 'María',
        last_name = 'García',
        is_active = 1
    WHERE email = 'judge1@demo.com';
    PRINT '✅ Usuario judge1@demo.com actualizado';
END
ELSE
BEGIN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active)
    VALUES (NEWID(), 'judge1@demo.com', '123456', 'Judge', 'María', 'García', 1);
    PRINT '✅ Usuario judge1@demo.com creado';
END
GO

-- Participante
IF EXISTS (SELECT 1 FROM users WHERE email = 'participant1@demo.com')
BEGIN
    UPDATE users 
    SET password_hash = '123456',
        role = 'Participant',
        first_name = 'Carlos',
        last_name = 'López',
        is_active = 1
    WHERE email = 'participant1@demo.com';
    PRINT '✅ Usuario participant1@demo.com actualizado';
END
ELSE
BEGIN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active)
    VALUES (NEWID(), 'participant1@demo.com', '123456', 'Participant', 'Carlos', 'López', 1);
    PRINT '✅ Usuario participant1@demo.com creado';
END
GO

-- Verificar usuarios creados
SELECT email, password_hash, role, first_name, last_name, is_active 
FROM users 
WHERE email LIKE '%@demo.com'
ORDER BY email;
GO

PRINT '';
PRINT '✅ Script completado exitosamente';
PRINT '📝 Usuarios con @demo.com configurados con contraseña: 123456';

