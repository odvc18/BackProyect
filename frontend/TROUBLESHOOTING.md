# 🚨 Solución de Problemas - Frontend EGOSCORE

## 🔍 **Diagnóstico de Errores Comunes**

### **1. Error: "Module not found" o "Cannot resolve module"**

**Causa**: Dependencias faltantes o problemas de path mapping.

**Solución**:
```bash
# Instalar dependencias faltantes
npm install @hookform/resolvers

# O reinstalar todas las dependencias
npm run clean-install
```

### **2. Error: "Cannot find module '@store/index'"**

**Causa**: Path mapping no configurado correctamente.

**Solución**:
```bash
# Usar configuración simple de TypeScript
cp tsconfig.simple.json tsconfig.json

# O usar imports relativos temporalmente
```

### **3. Error: "Vite failed to resolve import"**

**Causa**: Configuración de Vite problemática.

**Solución**:
```bash
# Usar configuración simple de Vite
cp vite.config.simple.ts vite.config.ts

# Limpiar cache
npm run clean
```

### **4. Error: "Redux store not found"**

**Causa**: Store no configurado correctamente.

**Solución**:
```bash
# Verificar que todos los archivos de store existan
ls -la src/store/
ls -la src/store/slices/
ls -la src/store/api/
```

### **5. Error: "TypeScript compilation failed"**

**Causa**: Configuración de TypeScript muy estricta.

**Solución**:
```bash
# Usar configuración simple
cp tsconfig.simple.json tsconfig.json

# O verificar tipos
npm run type-check:simple
```

## 🛠️ **Comandos de Solución Rápida**

### **Solución 1: Configuración Simple**
```bash
# Usar configuraciones simplificadas
cp vite.config.simple.ts vite.config.ts
cp tsconfig.simple.json tsconfig.json

# Limpiar y reinstalar
npm run clean-install

# Ejecutar con configuración simple
npm run dev:simple
```

### **Solución 2: Limpieza Completa**
```bash
# Limpiar todo
rm -rf node_modules package-lock.json dist .vite

# Reinstalar
npm install

# Ejecutar
npm run dev
```

### **Solución 3: Verificación de Archivos**
```bash
# Verificar archivos críticos
ls -la src/main.tsx
ls -la src/App.tsx
ls -la src/store/index.ts
ls -la src/theme/index.ts

# Si faltan, recrearlos
```

## 📋 **Checklist de Verificación**

- [ ] Node.js versión 18+
- [ ] npm instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivos de configuración presentes
- [ ] Archivos de store presentes
- [ ] Archivos de tema presentes
- [ ] Archivos de tipos presentes

## 🔧 **Configuraciones Alternativas**

### **Vite Config Simple**
```typescript
// vite.config.simple.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/identity': 'http://localhost:5001',
      '/api/contest': 'http://localhost:5002',
      '/api/submission': 'http://localhost:5003',
      '/api/evaluation': 'http://localhost:5004',
      '/api/ai-analysis': 'http://localhost:5005',
    },
  },
})
```

### **TypeScript Config Simple**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false
  },
  "include": ["src"]
}
```

## 🚀 **Pasos de Recuperación**

1. **Backup de archivos importantes**:
   ```bash
   cp -r src/components src/components.backup
   cp -r src/pages src/pages.backup
   ```

2. **Usar configuración simple**:
   ```bash
   cp vite.config.simple.ts vite.config.ts
   cp tsconfig.simple.json tsconfig.json
   ```

3. **Limpiar e instalar**:
   ```bash
   npm run clean-install
   ```

4. **Ejecutar con configuración simple**:
   ```bash
   npm run dev:simple
   ```

5. **Si funciona, restaurar configuración completa**:
   ```bash
   git checkout vite.config.ts tsconfig.json
   npm run dev
   ```

## 📞 **Si Nada Funciona**

1. **Verificar versión de Node.js**:
   ```bash
   node --version  # Debe ser 18+
   ```

2. **Verificar versión de npm**:
   ```bash
   npm --version
   ```

3. **Usar configuración mínima**:
   - Comentar imports problemáticos
   - Usar componentes simples
   - Verificar archivo por archivo

4. **Crear proyecto nuevo**:
   ```bash
   npx create-vite@latest frontend-new --template react-ts
   cd frontend-new
   npm install
   # Copiar archivos src/ del proyecto original
   ```

## 📝 **Logs de Error Comunes**

### **Error de Path Mapping**
```
Error: Cannot resolve module '@store/index'
```
**Solución**: Usar `tsconfig.simple.json`

### **Error de Dependencias**
```
Error: Module not found: Can't resolve '@hookform/resolvers'
```
**Solución**: `npm install @hookform/resolvers`

### **Error de Vite**
```
Error: Failed to resolve import
```
**Solución**: Usar `vite.config.simple.ts`

### **Error de Redux**
```
Error: Store not found
```
**Solución**: Verificar archivos de store

---

**💡 Tip**: Siempre usa `npm run dev:simple` si hay problemas con la configuración principal.










