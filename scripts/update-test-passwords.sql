-- =============================================
-- ACTUALIZAR CONTRASEÑAS DE USUARIOS DE PRUEBA
-- =============================================
-- Este script actualiza las contraseñas de los usuarios de prueba
-- a texto plano para desarrollo (el backend compara directamente)
-- 
-- IMPORTANTE: Solo usar en desarrollo. En producción usar hashes seguros.

USE identity_db;
GO

-- Actualizar contraseñas a texto plano para desarrollo
-- Actualiza usuarios con @concursos.com
UPDATE users 
SET password_hash = '123456'
WHERE email IN (
    'admin@concursos.com',
    'judge1@concursos.com',
    'participant1@concursos.com'
);
GO

-- Actualizar usuarios con @demo.com (si existen)
UPDATE users 
SET password_hash = '123456'
WHERE email IN (
    'admin@demo.com',
    'judge1@demo.com',
    'participant1@demo.com'
);
GO

-- Verificar que se actualizaron correctamente
SELECT email, password_hash, role, first_name, last_name 
FROM users 
WHERE email IN (
    'admin@concursos.com',
    'judge1@concursos.com',
    'participant1@concursos.com',
    'admin@demo.com',
    'judge1@demo.com',
    'participant1@demo.com'
)
ORDER BY email;
GO

PRINT '✅ Contraseñas actualizadas exitosamente';
PRINT '📝 Todas las contraseñas de prueba están configuradas como: 123456';

