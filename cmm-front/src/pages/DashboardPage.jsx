import { useState, useEffect } from 'react';
import Layout, { Card, StatusBadge } from '../components/Layout';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isGestor, isTecnico, isSolicitante } = useAuth();

  useEffect(() => {
    api.getDashboard()
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><p className="empty-state">Carregando dashboard...</p></Layout>;

  const stats = [
    { label: 'Total de Ativos', value: dashboard?.totalAtivos || 0, color: '#E7D878' },
    { label: 'Ativos Online', value: dashboard?.ativosOnline || 0, color: '#6BCB9A' },
    { label: 'Ativos Offline', value: dashboard?.ativosOffline || 0, color: '#E85D5D' },
    { label: 'Tickets Abertos', value: dashboard?.ordensAbertas || 0, color: '#7EB8DA' },
    { label: 'Em Atendimento', value: dashboard?.ordensEmAtendimento || 0, color: '#E7D878' },
    { label: 'Aguardando Peça', value: dashboard?.ordensAguardandoPeca || 0, color: '#F0A050' },
    { label: 'Concluídas', value: dashboard?.ordensConcluidas || 0, color: '#6BCB9A' },
    { label: 'Custo Total', value: `R$ ${(dashboard?.custoTotalHistorico || 0).toFixed(2)}`, color: '#E7D878' },
  ];

  return (
    <Layout>
      <h1 className="page-title">Olá, {user?.nome}</h1>
      <p className="page-subtitle">
        {isGestor && 'Painel de gestão — visão completa do inventário e custos operacionais.'}
        {isTecnico && 'Seus tickets de serviço e atendimentos pendentes.'}
        {isSolicitante && 'Acompanhe seus tickets e o status dos equipamentos.'}
      </p>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <Card key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid-2">
        <Card>
          <h2>Tickets Recentes</h2>
          {dashboard?.ordensRecentes?.length === 0 ? (
            <p className="empty-state">Nenhum ticket registrado.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Ativo</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Custo</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.ordensRecentes?.map((ordem) => (
                  <tr key={ordem.id}>
                    <td>{ordem.descricao}</td>
                    <td>{ordem.ativo}</td>
                    <td><StatusBadge status={ordem.tipo} /></td>
                    <td><StatusBadge status={ordem.status} /></td>
                    <td>{ordem.custoTotal ? `R$ ${ordem.custoTotal.toFixed(2)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          <h2>Inventário de Ativos</h2>
          {dashboard?.ativosPorStatus?.length === 0 ? (
            <p className="empty-state">Nenhum ativo cadastrado.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Localização</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.ativosPorStatus?.map((ativo, i) => (
                  <tr key={i}>
                    <td>{ativo.nome}</td>
                    <td>{ativo.categoria}</td>
                    <td>{ativo.localizacao}</td>
                    <td><StatusBadge status={ativo.status} /></td>
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
