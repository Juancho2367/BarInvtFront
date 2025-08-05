import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/UI/ProtectedRoute';
import Layout from './components/UI/Layout';
import Notification from './components/UI/Notification';
import Loading from './components/UI/Loading';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Lazy load pages
const Login = React.lazy(() => import('./pages/Login'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const Reports = React.lazy(() => import('./pages/Reports'));
const BarcodeConfig = React.lazy(() => import('./pages/BarcodeConfig'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <React.Suspense fallback={<Loading fullScreen />}>
            <Routes>
              {/* Login route - no protegida */}
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas */}
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute requireInventoryAccess={true}>
                    <Layout>
                      <Inventory />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute requireReportsAccess={true}>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Ruta especial para configuración de códigos de barras */}
              <Route
                path="/configuracionbarras"
                element={
                  <ProtectedRoute requireInventoryAccess={true}>
                    <Layout>
                      <BarcodeConfig />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Redirigir la ruta raíz a inventory */}
              <Route
                path="/"
                element={<Navigate to="/inventory" replace />}
              />
              
              {/* Redirigir cualquier otra ruta a inventory */}
              <Route
                path="*"
                element={<Navigate to="/inventory" replace />}
              />
            </Routes>
          </React.Suspense>
          <Notification />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
