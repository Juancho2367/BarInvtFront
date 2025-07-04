# Sistema de Inventario - Frontend

Sistema de gestión de inventario para bar desarrollado con React, TypeScript, Vite y Tailwind CSS.

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
```

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── UI/        # Componentes de interfaz
│   ├── Inventory/ # Componentes específicos de inventario
│   ├── Sales/     # Componentes específicos de ventas
│   └── ...
├── pages/         # Páginas de la aplicación
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

- ✅ Dashboard con estadísticas
- ✅ Gestión de inventario
- ✅ Sistema de ventas
- ✅ Gestión de clientes
- ✅ Calendario de eventos
- ✅ Reportes y análisis
- ✅ Diseño responsive
- ✅ Tema personalizable

## 🚀 Deploy Status

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/inventario-bar&project-name=inventario-bar-frontend)
