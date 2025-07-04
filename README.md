# Sistema de Inventario - Frontend

Sistema de gestión de inventario para bar desarrollado con React, TypeScript, Vite y Tailwind CSS.

## 🔐 Autenticación

**¡IMPORTANTE!** La aplicación ahora requiere autenticación obligatoria.

### Credenciales de Acceso
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### Características de Seguridad
- ✅ Login obligatorio al acceder
- ✅ Rutas protegidas
- ✅ Persistencia de sesión
- ✅ Logout funcional
- ✅ Redirección automática

## 📱 Páginas Habilitadas

Actualmente solo están disponibles:
- ✅ **Inventory** - Gestión de inventario
- ✅ **Reports** - Reportes y análisis

### Páginas Temporalmente Deshabilitadas
- ❌ Dashboard
- ❌ Sales  
- ❌ Clients
- ❌ Calendar

## 🚀 Deploy en Vercel

### Configuración Automática

1. **Conectar con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Selecciona la carpeta `front` como directorio raíz

2. **Variables de Entorno (Opcional):**
   ```env
   VITE_API_URL=https://tu-backend.vercel.app/api
   VITE_APP_NAME=Sistema de Inventario
   ```

3. **Deploy Automático:**
   - Vercel detectará automáticamente que es un proyecto Vite
   - Usará el script `build` del package.json
   - Compilará desde el código fuente en `src/`

### Configuración Manual

Si necesitas configurar manualmente:

1. **Framework Preset:** Vite
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Install Command:** `npm install`

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview

# Verificar configuración de deploy
npm run deploy-check
```

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── UI/        # Componentes de interfaz
│   └── ProtectedRoute.tsx # Protección de rutas
├── context/       # Contextos de React
│   └── AuthContext.tsx    # Contexto de autenticación
├── pages/         # Páginas de la aplicación
│   ├── Login.tsx  # Página de login
│   ├── Inventory.tsx # Gestión de inventario
│   └── Reports.tsx # Reportes
├── hooks/         # Custom hooks
├── services/      # Servicios API
├── types/         # Tipos TypeScript
└── utils/         # Utilidades
```

## 🎨 Tecnologías

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Enrutamiento
- **Chart.js** - Gráficos
- **Zustand** - Gestión de estado

## 🔧 Configuración de Vercel

El proyecto está configurado para funcionar correctamente en Vercel con:

- **vercel.json** - Configuración de build y rutas
- **.vercelignore** - Archivos excluidos del deploy
- **React Router** - Configurado para SPA
- **Assets** - Optimizados para CDN

## 📱 Características

- ✅ Sistema de autenticación completo
- ✅ Gestión de inventario
- ✅ Reportes y análisis
- ✅ Diseño responsive
- ✅ Tema personalizable
- ✅ Rutas protegidas
- ✅ Persistencia de sesión

## 🔐 Documentación de Autenticación

Para más detalles sobre el sistema de autenticación, consulta [AUTHENTICATION.md](./AUTHENTICATION.md)

## 🚀 Deploy Status

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/inventario-bar&project-name=inventario-bar-frontend)
