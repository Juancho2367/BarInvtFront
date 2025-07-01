import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/UI/Layout';
import Notification from './components/UI/Notification';
import Loading from './components/UI/Loading';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const Sales = React.lazy(() => import('./pages/Sales'));
const Clients = React.lazy(() => import('./pages/Clients'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Reports = React.lazy(() => import('./pages/Reports'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <React.Suspense fallback={<Loading fullScreen />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </React.Suspense>
          <Notification />
        </Layout>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
