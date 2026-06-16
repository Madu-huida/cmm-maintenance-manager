import { useState, useEffect } from 'react';
import Layout, { Card, Button, Input, Select, StatusBadge } from '../components/Layout';
import { api } from '../api/client';

export default function AtivosPage() {
  const [ativos, setAtivos] = useState([]);
  const [form, setForm] = useState({ nome: '', categoria: '', numeroSerie: '', localizacao: '' });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = () => {
    api.getAtivos().then(setAtivos).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await api.criarAtivo({ ...form, status: 'ONLINE' });
      setForm({ nome: '', categoria: '', numeroSerie: '', localizacao: '' });
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja remover este ativo?')) return;
    try {
      await api.deletarAtivo(id);
      carregar();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Gestão de Ativos</h1>
      <p className="page-subtitle">Cadastre e gerencie o inventário de equipamentos da empresa.</p>

      <div className="grid-2">
        <Card>
          <h2>Novo Ativo</h2>
          {erro && <div className="alert-error">{erro}</div>}
          <form onSubmit={handleSubmit}>
            <Input label="Nome do Equipamento" placeholder="Ex: Chiller 01" value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            <Input label="Categoria" placeholder="Ex: HVAC, Elétrica" value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })} required />
            <Input label="Número de Série" placeholder="Ex: CHL-001" value={form.numeroSerie}
              onChange={(e) => setForm({ ...form, numeroSerie: e.target.value })} required />
            <Input label="Localização" placeholder="Ex: Térreo - Sala de Máquinas" value={form.localizacao}
              onChange={(e) => setForm({ ...form, localizacao: e.target.value })} required />
            <Button type="submit" onDark={false}>Cadastrar Ativo</Button>
          </form>
        </Card>

        <Card>
          <h2>Inventário ({ativos.length})</h2>
          {loading ? (
            <p className="empty-state">Carregando...</p>
          ) : ativos.length === 0 ? (
            <p className="empty-state">Nenhum ativo cadastrado.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Localização</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ativos.map((ativo) => (
                  <tr key={ativo.id}>
                    <td><strong>{ativo.nome}</strong><br /><small style={{ color: 'var(--text-muted)' }}>{ativo.numeroSerie}</small></td>
                    <td>{ativo.categoria}</td>
                    <td>{ativo.localizacao}</td>
                    <td><StatusBadge status={ativo.status} /></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-danger" onClick={() => handleDelete(ativo.id)}>Remover</button>
                      </div>
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
