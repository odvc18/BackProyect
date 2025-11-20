# 🎨 Frontend - EGOSCORE

## 📋 Descripción General

Frontend del sistema EGOSCORE desarrollado con **React 18 + TypeScript + Vite**. Este frontend se conecta con los 5 microservicios del backend para proporcionar una interfaz de usuario completa para la gestión de concursos académicos.

## 🏗️ Arquitectura del Frontend

### Stack Tecnológico
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Yup
- **Charts**: Recharts
- **Styling**: Material-UI + Emotion

### Estructura del Proyecto
```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── common/        # Componentes comunes
│   │   ├── forms/         # Formularios
│   │   └── layout/        # Componentes de layout
│   ├── pages/             # Páginas principales
│   │   ├── auth/          # Autenticación
│   │   ├── contests/      # Gestión de concursos
│   │   ├── submissions/   # Submissions
│   │   ├── evaluation/    # Evaluación
│   │   └── dashboard/     # Dashboard
│   ├── services/          # Servicios de API
│   │   ├── identity/      # ws-identity
│   │   ├── contest/       # ws-contest
│   │   ├── submission/    # ws-submission
│   │   ├── evaluation/    # ws-evaluation
│   │   └── ai-analysis/   # ws-ai_analysis
│   ├── store/             # Estado global (Redux)
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilidades
│   ├── types/             # Tipos TypeScript
│   ├── theme/             # Configuración de tema
│   └── constants/         # Constantes
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🔌 Conexiones con el Backend

### Microservicios y Puertos
| Microservicio | Puerto | Descripción |
|---------------|--------|-------------|
| ws-identity | 5001 | Autenticación y gestión de usuarios |
| ws-contest | 5002 | Gestión de concursos y categorías |
| ws-submission | 5003 | Recepción y gestión de submissions |
| ws-evaluation | 5004 | Evaluación y scoring |
| ws-ai_analysis | 5005 | Análisis automatizado con IA |

### Configuración de Proxy (Vite)
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api/identity': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/identity/, '')
      },
      '/api/contest': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/contest/, '')
      },
      '/api/submission': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/submission/, '')
      },
      '/api/evaluation': {
        target: 'http://localhost:5004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/evaluation/, '')
      },
      '/api/ai-analysis': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-analysis/, '')
      }
    }
  }
});
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Los microservicios del backend ejecutándose

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd EGOSCORE/frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📡 Servicios de API

### Identity Service (ws-identity)
```typescript
// Endpoints disponibles:
POST /api/identity/Create          # Crear usuario
POST /api/identity/Update          # Actualizar usuario
DELETE /api/identity/Delete        # Eliminar usuario
GET /api/identity/GetByEmail       # Obtener usuario por email
GET /api/identity/GetById          # Obtener usuario por ID
```

### Contest Service (ws-contest)
```typescript
// Endpoints disponibles:
POST /api/contest/Create           # Crear concurso
GET /api/contest/GetById           # Obtener concurso por ID
GET /api/contest/GetByActive       # Obtener concursos activos
POST /api/contest/Update           # Actualizar concurso
```

### Submission Service (ws-submission)
```typescript
// Endpoints disponibles:
POST /api/submission/Create        # Crear submission
GET /api/submission/GetById        # Obtener submission por ID
GET /api/submission/GetByContest   # Obtener submissions por concurso
POST /api/submission/Submit        # Enviar submission
```

### Evaluation Service (ws-evaluation)
```typescript
// Endpoints disponibles:
POST /api/evaluation/AssignJudge   # Asignar juez
GET /api/evaluation/GetAssignments # Obtener asignaciones
POST /api/evaluation/Score         # Calificar submission
GET /api/evaluation/GetScores      # Obtener puntuaciones
```

### AI Analysis Service (ws-ai_analysis)
```typescript
// Endpoints disponibles:
POST /api/ai-analysis/Analyze      # Analizar archivo
GET /api/ai-analysis/GetResults    # Obtener resultados
GET /api/ai-analysis/GetMetrics    # Obtener métricas
```

## 🔐 Autenticación y Autorización

### Flujo de Autenticación
1. Usuario ingresa credenciales
2. Frontend envía request a ws-identity
3. Backend valida y retorna JWT token
4. Token se almacena en localStorage
5. Token se incluye en headers de requests posteriores

### Roles de Usuario
- **Admin**: Acceso completo al sistema
- **Judge**: Puede evaluar submissions
- **Participant**: Puede crear submissions
- **Viewer**: Solo lectura

## 🎨 Componentes Principales

### Layout Components
- **MainLayout**: Layout principal con sidebar y header
- **AuthLayout**: Layout para páginas de autenticación
- **DashboardLayout**: Layout específico para dashboard

### Form Components
- **ContestForm**: Formulario de creación/edición de concursos
- **SubmissionForm**: Formulario de envío de submissions
- **UserForm**: Formulario de gestión de usuarios
- **EvaluationForm**: Formulario de evaluación

### Common Components
- **Header**: Barra superior con navegación
- **Sidebar**: Menú lateral de navegación
- **LoadingSpinner**: Indicador de carga
- **ErrorBoundary**: Manejo de errores
- **DataTable**: Tabla de datos reutilizable

## 📊 Estado Global (Redux)

### Slices Principales
- **authSlice**: Estado de autenticación
- **contestSlice**: Estado de concursos
- **submissionSlice**: Estado de submissions
- **evaluationSlice**: Estado de evaluaciones
- **uiSlice**: Estado de la interfaz

### RTK Query APIs
- **identityApi**: Queries y mutations para identity service
- **contestApi**: Queries y mutations para contest service
- **submissionApi**: Queries y mutations para submission service
- **evaluationApi**: Queries y mutations para evaluation service
- **aiAnalysisApi**: Queries y mutations para ai-analysis service

## 🧪 Testing

### Estrategia de Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Testing de flujos completos
- **E2E Tests**: Cypress (opcional)

### Comandos de Testing
```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🚀 Despliegue

### Build de Producción
```bash
# Crear build optimizado
npm run build

# El build se genera en la carpeta 'dist'
```

### Variables de Entorno
```env
# .env.production
VITE_API_BASE_URL=https://api.egoscore.com
VITE_APP_NAME=EGOSCORE
VITE_APP_VERSION=1.0.0
```

## 📝 Convenciones de Código

### Naming Conventions
- **Componentes**: PascalCase (ej: `ContestForm`)
- **Archivos**: PascalCase para componentes, camelCase para utilidades
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase con prefijo I (ej: `IContest`)

### Estructura de Archivos
- Un componente por archivo
- Archivos de tipos en carpeta `types/`
- Servicios en carpeta `services/`
- Hooks personalizados en carpeta `hooks/`

## 🔧 Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint src --ext ts,tsx --fix"
}
```

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de Material-UI](https://mui.com/)
- [Documentación de Redux Toolkit](https://redux-toolkit.js.org/)
- [Documentación de Vite](https://vitejs.dev/)

## 👥 Equipo de Desarrollo

- **Frontend Developer**: [Tu nombre]
- **UI/UX Designer**: [Diseñador]
- **Backend Team**: Equipo de microservicios

## 📄 Licencia

Proyecto académico - uso educativo.
© 2025 — Equipo de Arquitectura de Software.

