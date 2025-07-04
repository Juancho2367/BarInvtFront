# Sistema de Autenticación

## 🔐 Implementación

Se ha implementado un sistema de autenticación completo con las siguientes características:

### Características Principales

1. **Login Obligatorio**: Al acceder a la aplicación, se requiere iniciar sesión
2. **Rutas Protegidas**: Solo usuarios autenticados pueden acceder a las páginas
3. **Persistencia de Sesión**: La sesión se mantiene en localStorage
4. **Logout**: Funcionalidad para cerrar sesión
5. **Redirección Automática**: Redirige al login si no está autenticado

### Credenciales de Prueba

- **Usuario**: `admin`
- **Contraseña**: `admin123`

### Estructura de Archivos

```
src/
├── context/
│   └── AuthContext.tsx          # Contexto de autenticación
├── components/
│   ├── ProtectedRoute.tsx       # Componente de protección de rutas
│   └── UI/
│       └── Layout.tsx           # Layout actualizado con logout
└── pages/
    └── Login.tsx                # Página de login
```

### Componentes Implementados

#### AuthContext
- Maneja el estado de autenticación global
- Proporciona funciones de login/logout
- Persiste la sesión en localStorage
- Simula autenticación con credenciales hardcodeadas

#### ProtectedRoute
- Protege rutas que requieren autenticación
- Redirige al login si no está autenticado
- Muestra loading mientras verifica autenticación

#### Login
- Formulario de login con validación
- Manejo de errores
- Estados de loading
- Diseño responsive y moderno

#### Layout Actualizado
- Solo muestra las páginas habilitadas (Inventory y Reports)
- Información del usuario autenticado
- Botón de logout funcional

### Rutas Configuradas

#### Rutas Públicas
- `/login` - Página de login

#### Rutas Protegidas
- `/inventory` - Gestión de inventario
- `/reports` - Reportes y análisis

#### Redirecciones
- `/` → `/inventory`
- `/*` → `/inventory` (cualquier ruta no encontrada)

### Flujo de Autenticación

1. **Acceso Inicial**: Usuario accede a cualquier ruta
2. **Verificación**: ProtectedRoute verifica si está autenticado
3. **Redirección**: Si no está autenticado, redirige a `/login`
4. **Login**: Usuario ingresa credenciales
5. **Validación**: Se validan las credenciales
6. **Sesión**: Si son correctas, se crea la sesión
7. **Acceso**: Usuario es redirigido a la página solicitada

### Configuración para Producción

Para implementar en producción, modificar en `AuthContext.tsx`:

```typescript
const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

### Seguridad

- Las credenciales están hardcodeadas solo para desarrollo
- En producción, usar autenticación con backend
- Implementar JWT tokens para mayor seguridad
- Agregar refresh tokens para sesiones largas
- Implementar logout en el servidor

### Páginas Habilitadas

Actualmente solo están habilitadas:
- ✅ **Inventory** - Gestión de inventario
- ✅ **Reports** - Reportes y análisis

### Páginas Deshabilitadas (Temporalmente)

- ❌ Dashboard
- ❌ Sales
- ❌ Clients
- ❌ Calendar

Para habilitar las páginas deshabilitadas, modificar:
1. `App.tsx` - Agregar las rutas
2. `Layout.tsx` - Agregar a la navegación
3. Importar los componentes correspondientes 