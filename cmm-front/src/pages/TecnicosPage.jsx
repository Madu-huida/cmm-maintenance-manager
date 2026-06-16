import { useState, useEffect } from 'react';
import Layout, { Card, Button, Input, Select, StatusBadge } from '../components/Layout';
import { api } from '../api/client';

const ESPECIALIDADES = ['MECANICA', 'ELETRICA', 'HIDRAULICA', 'HVAC', 'GERAL'];
const PERFIS = ['TECNICO', 'SOLICITANTE'];

export default function TecnicosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'TECNICO', especialidade: 'MECANICA' });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = () => {
    api.getUsuarios().then(setUsuarios).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const dados = { ...form };
      if (dados.perfil !== 'TECNICO') delete dados.especialidade;
      await api.criarUsuario(dados);
      setForm({ nome: '', email: '', senha: '', perfil: 'TECNICO', especialidade: 'MECANICA' });
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleEncerrar = async (id, nome) => {
    if (!confirm(`Encerrar a conta de ${nome}? O usuário não poderá mais fazer login.`)) return;
    try {
      await api.encerrarConta(id);
      carregar();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Gestão de Equipe</h1>
      <p className="page-subtitle">Cadastre técnicos e solicitantes ou encerre contas.</p>

      <div className="grid-2">
        <Card>
          <h2>Novo Usuário</h2>
          {erro && <div className="alert-error">{erro}</div>}
          <form onSubmit={handleSubmit}>
            <Input label="Nome" placeholder="Nome completo" value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            <Input label="E-mail" type="email" placeholder="email@empresa.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Senha" type="password" placeholder="Senha de acesso" value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
            <Select label="Perfil" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}>
              {PERFIS.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
            {form.perfil === 'TECNICO' && (
              <Select label="Especialidade" value={form.especialidade}
                onChange={(e) => setForm({ ...form, especialidade: e.target.value })}>
                {ESPECIALIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
              </Select>
            )}
            <Button type="submit" onDark={false}>Cadastrar Usuário</Button>
          </form>
        </Card>

        <Card>
          <h2>Usuários ({usuarios.length})</h2>
          {loading ? (
            <p className="empty-state">Carregando...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td><StatusBadge status={u.perfil} /></td>
                    <td>{u.ativo ? 'Ativo' : 'Encerrado'}</td>
                    <td>
                      {u.ativo && u.perfil !== 'GESTOR' && (
                        <div className="action-buttons">
                          <button className="btn-danger" onClick={() => handleEncerrar(u.id, u.nome)}>
                            Encerrar Conta
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </Layout>
  );
}
