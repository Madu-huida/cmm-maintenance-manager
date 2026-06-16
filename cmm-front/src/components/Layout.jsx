import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../context/ThemeContext';
import './Layout.css';

export default function Layout({ children }) {
  const { user, logout, isGestor } = useAuth();

  return (
    <div className="layout">
      <nav className="navbar">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">⚙</span>
          CMM
        </Link>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/tickets">Tickets</Link>
          {isGestor && <Link to="/ativos">Ativos</Link>}
          {isGestor && <Link to="/tecnicos">Equipe</Link>}
        </div>
        <div className="navbar-user">
          <ThemeToggle />
          <span className="user-badge">{user?.perfil}</span>
          <span className="user-name">{user?.nome}</span>
          <button className="btn-outline" onClick={logout}>Sair</button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}

export function Button({ children, variant = 'primary', onDark = true, ...props }) {
  const className = variant === 'primary'
    ? `btn-primary ${onDark ? 'on-dark' : 'on-medium'}`
    : variant === 'outline' ? 'btn-outline' : 'btn-ghost';
  return <button className={className} {...props}>{children}</button>;
}

export function Card({ children, className = '', style }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

export function Input({ label, ...props }) {
  return (
    <label className="form-field">
      {label && <span className="form-label">{label}</span>}
      <input className="form-input" {...props} />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="form-field">
      {label && <span className="form-label">{label}</span>}
      <select className="form-select" {...props}>{children}</select>
    </label>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <label className="form-field">
      {label && <span className="form-label">{label}</span>}
      <textarea className="form-textarea" {...props} />
    </label>
  );
}

export function StatusBadge({ status }) {
  const labels = {
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    EM_MANUTENCAO: 'Em Manutenção',
    AGUARDANDO_PECA: 'Aguardando Peça',
    ABERTA: 'Aberta',
    EM_ATENDIMENTO: 'Em Atendimento',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
    PREVENTIVA: 'Preventiva',
    CORRETIVA: 'Corretiva',
    GESTOR: 'Gestor',
    TECNICO: 'Técnico',
    SOLICITANTE: 'Solicitante',
  };
  return <span className={`status-badge status-${status}`}>{labels[status] || status}</span>;
}
