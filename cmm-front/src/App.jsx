import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AtivosPage from './pages/AtivosPage';
import TicketsPage from './pages/TicketsPage';
import TecnicosPage from './pages/TecnicosPage';
import './components/Layout.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename="/cmm-maintenance-manager">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/ativos" element={
              <ProtectedRoute roles={['GESTOR']}><AtivosPage /></ProtectedRoute>
            } />
            <Route path="/tickets" element={
              <ProtectedRoute><TicketsPage /></ProtectedRoute>
            } />
            <Route path="/ordens" element={<Navigate to="/tickets" replace />} />
            <Route path="/tecnicos" element={
              <ProtectedRoute roles={['GESTOR']}><TecnicosPage /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
