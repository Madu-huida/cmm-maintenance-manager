import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/Layout';
import { ThemeToggle } from '../context/ThemeContext';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const data = await api.login(email, senha);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-top-bar">
        <ThemeToggle />
      </div>
      <div className="auth-container">
        <Link to="/" className="auth-back">← Voltar ao início</Link>
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-icon">⚙</span>
            <h1>Entrar no CMM</h1>
            <p>Acesse sua conta para gerenciar manutenções</p>
          </div>

          {erro && <div className="alert-error">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <Button type="submit" onDark={true} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>Não tem conta? <Link to="/registro">Criar conta de gestor</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
