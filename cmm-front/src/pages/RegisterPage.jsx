import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/Layout';
import { ThemeToggle } from '../context/ThemeContext';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const data = await api.registro(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.message || 'Erro ao registrar');
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
            <h1>Criar Conta</h1>
            <p>Registre-se como gestor para administrar sua empresa</p>
          </div>

          {erro && <div className="alert-error">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="admin@empresa.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              required
              minLength={6}
            />
            <Button type="submit" onDark={true} disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta de Gestor'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>Já tem conta? <Link to="/login">Fazer login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
