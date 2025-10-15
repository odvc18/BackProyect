# 🔧 Configuración de Desarrollo - Solución de Errores

## 🚨 **Errores Comunes y Soluciones**

### **1. Error de Dependencias Faltantes**
Si ves errores como "Module not found" o "Cannot resolve module":

```bash
# Instalar dependencias faltantes
npm install @hookform/resolvers

# O reinstalar todas las dependencias
rm -rf node_modules package-lock.json
npm install
```

### **2. Error de TypeScript**
Si ves errores de TypeScript:

```bash
# Verificar tipos
npm run type-check

# Si hay errores, usar configuración simple
cp tsconfig.simple.json tsconfig.json
```

### **3. Error de Vite**
Si Vite no inicia correctamente:

```bash
# Usar configuración simple
cp vite.config.simple.ts vite.config.ts

# O limpiar cache
rm -rf node_modules/.vite
npm run dev
```

### **4. Error de Redux/Store**
Si hay errores de Redux:

```bash
# Verificar que todos los archivos de store estén presentes
ls -la src/store/
ls -la src/store/slices/
ls -la src/store/api/
```

### **5. Error de Path Mapping**
Si hay errores de imports con @:

```bash
# Verificar que tsconfig.json tenga los paths correctos
# O usar imports relativos temporalmente
```

## 🛠️ **Comandos de Diagnóstico**

```bash
# Verificar instalación
npm list --depth=0

# Verificar tipos
npm run type-check

# Verificar linting
npm run lint

# Limpiar y reinstalar
npm run clean-install
```

## 📝 **Scripts Adicionales para package.json**

```json
{
  "scripts": {
    "clean-install": "rm -rf node_modules package-lock.json && npm install",
    "dev:simple": "vite --config vite.config.simple.ts",
    "type-check:simple": "tsc --noEmit --project tsconfig.simple.json"
  }
}
```

## 🔍 **Verificación de Archivos Críticos**

Asegúrate de que estos archivos existan:

- ✅ `src/main.tsx`
- ✅ `src/App.tsx`
- ✅ `src/store/index.ts`
- ✅ `src/store/hooks.ts`
- ✅ `src/store/slices/authSlice.ts`
- ✅ `src/store/api/identityApi.ts`
- ✅ `src/theme/index.ts`
- ✅ `src/types/index.ts`

## 🚀 **Pasos para Solucionar Errores**

1. **Verificar dependencias**:
   ```bash
   npm install
   ```

2. **Usar configuración simple**:
   ```bash
   cp vite.config.simple.ts vite.config.ts
   cp tsconfig.simple.json tsconfig.json
   ```

3. **Limpiar cache**:
   ```bash
   rm -rf node_modules/.vite
   rm -rf dist
   ```

4. **Reinstalar dependencias**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

5. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

## 📞 **Si los Errores Persisten**

1. **Verificar versión de Node.js** (debe ser 18+):
   ```bash
   node --version
   ```

2. **Verificar versión de npm**:
   ```bash
   npm --version
   ```

3. **Usar configuración mínima**:
   - Usar `vite.config.simple.ts`
   - Usar `tsconfig.simple.json`
   - Comentar imports problemáticos temporalmente

4. **Verificar logs detallados**:
   ```bash
   npm run dev -- --debug
   ```
