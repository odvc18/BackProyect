# 👥 Usuarios de Prueba - Sistema de Concursos

Este documento contiene las credenciales de acceso para los usuarios de prueba del sistema y una descripción detallada de las capacidades y permisos de cada rol.

---

## 🔐 Credenciales de Acceso

### Opción 1: Usuarios con @demo.com (Recomendado)

#### 1. Administrador
- **Email:** `admin@demo.com`
- **Contraseña:** `123456`
- **Rol:** `Admin`
- **Nombre:** Admin Sistema
- **Descripción:** Usuario con acceso completo al sistema

#### 2. Juez
- **Email:** `judge@demo.com`
- **Contraseña:** `123456`
- **Rol:** `Judge`
- **Nombre:** María García
- **Descripción:** Usuario encargado de evaluar las submissions de los participantes

#### 3. Participante
- **Email:** `participant@demo.com`
- **Contraseña:** `123456`
- **Rol:** `Participant`
- **Nombre:** Carlos López
- **Descripción:** Usuario que puede participar en concursos y enviar submissions

---

## ⚠️ Nota Importante sobre Contraseñas

**IMPORTANTE:** En el entorno de desarrollo, el sistema está configurado para comparar contraseñas en texto plano directamente. Esto significa que las contraseñas se almacenan en la base de datos sin hashear.

**Para configurar los usuarios de prueba:**

1. **Crear usuarios con @demo.com (Recomendado):**
   ```sql
   -- Ejecutar: scripts/create-demo-users.sql
   ```

2. **O actualizar contraseñas de usuarios existentes con @concursos.com:**
   ```sql
   -- Ejecutar: scripts/update-test-passwords.sql
   ```

3. **O actualizar manualmente en la base de datos:**
   ```sql
   USE identity_db;
   -- Para usuarios @demo.com
   UPDATE users 
   SET password_hash = '123456'
   WHERE email IN ('admin@demo.com', 'judge1@demo.com', 'participant1@demo.com');
   
   -- Para usuarios @concursos.com
   UPDATE users 
   SET password_hash = '123456'
   WHERE email IN ('admin@concursos.com', 'judge1@concursos.com', 'participant1@concursos.com');
   ```

**⚠️ ADVERTENCIA DE SEGURIDAD:**
- Estas contraseñas son solo para desarrollo y pruebas
- **NUNCA** uses contraseñas en texto plano en producción
- En producción, implementa hashing seguro (BCrypt, Argon2, etc.)

---

## 📋 Descripción de Roles y Permisos

### 🔴 Administrador (Admin)

**Acceso Completo al Sistema**

El administrador tiene acceso a todas las funcionalidades del sistema:

#### Módulos Accesibles:
- ✅ **Dashboard** - Vista general del sistema con estadísticas y métricas
- ✅ **Concursos** - Gestión completa de concursos:
  - Crear nuevos concursos
  - Editar concursos existentes
  - Publicar o cerrar concursos
  - Definir categorías y reglas
  - Gestionar fechas y límites
- ✅ **Submissions** - Visualización y gestión de todas las submissions:
  - Ver todas las submissions del sistema
  - Revisar archivos enviados
  - Cambiar estados de submissions
- ✅ **Evaluación** - Acceso completo al módulo de evaluación:
  - Asignar jueces a submissions
  - Ver todas las evaluaciones
  - Gestionar rúbricas y criterios de evaluación
  - Revisar y modificar calificaciones
- ✅ **Análisis IA** - Acceso al módulo de análisis con inteligencia artificial:
  - Ver resultados de análisis automáticos
  - Revisar métricas y estadísticas de IA
  - Gestionar configuraciones de análisis
- ✅ **Usuarios** - Gestión completa de usuarios:
  - Crear nuevos usuarios
  - Editar información de usuarios
  - Activar/desactivar usuarios
  - Asignar roles
  - Ver historial de usuarios

#### Capacidades Específicas:
- Crear y gestionar concursos desde cero
- Asignar jueces a concursos y submissions
- Ver reportes y estadísticas completas del sistema
- Configurar parámetros del sistema
- Gestionar todos los usuarios y sus permisos

---

### 🟡 Juez (Judge)

**Evaluación y Revisión de Submissions**

El juez se encarga de evaluar las submissions de los participantes:

#### Módulos Accesibles:
- ✅ **Dashboard** - Vista general con asignaciones pendientes y estadísticas
- ✅ **Concursos** - Visualización de concursos:
  - Ver información de concursos activos
  - Consultar reglas y categorías
  - Ver detalles de concursos asignados
- ✅ **Submissions** - Acceso a submissions asignadas:
  - Ver submissions asignadas para evaluación
  - Descargar y revisar archivos de submissions
  - Ver historial de submissions evaluadas
- ✅ **Evaluación** - Módulo principal de trabajo:
  - Ver submissions asignadas para evaluación
  - Calificar submissions según rúbricas
  - Agregar comentarios y observaciones
  - Completar evaluaciones
  - Ver historial de evaluaciones realizadas
- ✅ **Análisis IA** - Acceso a análisis automáticos:
  - Ver resultados de análisis de IA para submissions asignadas
  - Revisar sugerencias y métricas de IA
  - Usar análisis como referencia para evaluación

#### Capacidades Específicas:
- Evaluar submissions asignadas por el administrador
- Calificar según criterios definidos en las rúbricas
- Ver análisis previos generados por IA
- Completar y enviar evaluaciones
- Ver estadísticas de sus evaluaciones

#### Limitaciones:
- ❌ No puede crear o modificar concursos
- ❌ No puede gestionar usuarios
- ❌ Solo ve submissions asignadas a él
- ❌ No puede modificar configuraciones del sistema

---

### 🟢 Participante (Participant)

**Participación en Concursos**

El participante puede inscribirse en concursos y enviar sus propuestas:

#### Módulos Accesibles:
- ✅ **Dashboard** - Vista personal con:
  - Concursos disponibles
  - Estado de sus submissions
  - Notificaciones y recordatorios
- ✅ **Concursos** - Exploración de concursos:
  - Ver concursos publicados y activos
  - Consultar reglas y categorías
  - Ver información detallada de concursos
  - Inscribirse en concursos
- ✅ **Submissions** - Gestión de sus propuestas:
  - Crear nuevas submissions
  - Subir archivos para sus submissions
  - Ver estado de sus submissions
  - Editar submissions en estado "Draft"
  - Ver historial de sus envíos

#### Capacidades Específicas:
- Inscribirse en concursos disponibles
- Crear y enviar submissions para concursos activos
- Subir archivos según los tipos permitidos por categoría
- Ver el estado de sus submissions (Draft, Submitted, UnderReview, Accepted, Rejected)
- Editar submissions antes de enviarlas
- Ver feedback y resultados de evaluaciones (cuando estén disponibles)

#### Limitaciones:
- ❌ No puede evaluar submissions
- ❌ No puede ver submissions de otros participantes
- ❌ No puede crear o modificar concursos
- ❌ No puede gestionar usuarios
- ❌ No tiene acceso a análisis de IA
- ❌ Solo puede ver sus propias submissions

---

### 🔵 Viewer (Solo Lectura)

**Visualización Limitada**

El rol Viewer tiene acceso de solo lectura a información básica:

#### Módulos Accesibles:
- ✅ **Dashboard** - Vista general con información pública
- ✅ **Concursos** - Solo visualización:
  - Ver concursos publicados
  - Consultar información de concursos
  - Ver categorías y reglas

#### Capacidades Específicas:
- Ver información pública de concursos
- Consultar reglas y bases de concursos
- Ver información general del sistema

#### Limitaciones:
- ❌ No puede crear submissions
- ❌ No puede evaluar
- ❌ No puede gestionar ningún recurso
- ❌ Acceso limitado a solo lectura

**Nota:** No hay usuario de prueba creado para el rol Viewer en la base de datos inicial.

---

## 🔄 Flujo de Trabajo Típico

### Para Administradores:
1. Crear un nuevo concurso con categorías
2. Publicar el concurso
3. Asignar jueces a las categorías
4. Monitorear submissions recibidas
5. Revisar evaluaciones completadas
6. Generar resultados finales

### Para Jueces:
1. Ver submissions asignadas en el Dashboard
2. Revisar archivos de submissions
3. Consultar análisis de IA (si disponible)
4. Calificar según rúbricas
5. Completar evaluación con comentarios

### Para Participantes:
1. Explorar concursos disponibles
2. Inscribirse en un concurso
3. Crear una submission
4. Subir archivos requeridos
5. Enviar la submission
6. Ver estado y resultados

---

## 📡 Endpoints de Autenticación

### Login
```
POST /api/identity/login
Content-Type: application/json

{
  "email": "admin@concursos.com",
  "password": "tu_contraseña"
}
```

### Respuesta Exitosa:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "guid",
    "email": "admin@concursos.com",
    "role": "Admin",
    "firstName": "Admin",
    "lastName": "Sistema"
  },
  "expiresIn": 7200
}
```

### Verificar Token
```
GET /api/identity/verify
Authorization: Bearer {token}
```

---

## 🗄️ Base de Datos

Los usuarios de prueba se encuentran en la base de datos `identity_db`, tabla `users`.

Para consultar los usuarios:
```sql
USE identity_db;
SELECT id, email, role, first_name, last_name, is_active 
FROM users;
```

---

## 🔧 Configuración Adicional

### Crear Nuevo Usuario de Prueba
Puedes crear nuevos usuarios usando el endpoint:
```
POST /api/identity/Create
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "role": "Participant",
  "firstName": "Nombre",
  "lastName": "Apellido"
}
```

---

**Última actualización:** Generado automáticamente desde el código del proyecto
**Proyecto:** Sistema de Gestión de Concursos - Arquitectura de Microservicios

