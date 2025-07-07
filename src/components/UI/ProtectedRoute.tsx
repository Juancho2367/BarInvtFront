import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
  requireReportsAccess?: boolean;
  requireInventoryAccess?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireRole,
  requireReportsAccess = false,
  requireInventoryAccess = false,
}) => {
  const { isAuthenticated, user, canAccessReports, canAccessInventory, isLoading } = useAuth();

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un rol específico
  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tu rol: {user?.role} | Rol requerido: {requireRole}
          </p>
        </div>
      </div>
    );
  }

  // Si requiere acceso a reportes
  if (requireReportsAccess && !canAccessReports()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">
            Solo los super administradores pueden acceder a los reportes.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tu rol: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  // Si requiere acceso al inventario
  if (requireInventoryAccess && !canAccessInventory()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">
            No tienes permisos para acceder al inventario.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tu rol: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 