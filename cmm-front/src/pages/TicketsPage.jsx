import { useState, useEffect } from 'react';
import Layout, { Card, Button, Input, Select, Textarea, StatusBadge } from '../components/Layout';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_OPCOES = [
  { value: 'EM_ATENDIMENTO', label: 'Em Andamento' },
  { value: 'AGUARDANDO_PECA', label: 'Aguardando Peça' },
  { value: 'CONCLUIDA', label: 'Concluído' },
];

function opcoesStatus(statusAtual) {
  switch (statusAtual) {
    case 'ABERTA':
      return STATUS_OPCOES.filter((s) => s.value === 'EM_ATENDIMENTO');
    case 'EM_ATENDIMENTO':
      return STATUS_OPCOES.filter((s) => ['AGUARDANDO_PECA', 'CONCLUIDA'].includes(s.value));
    case 'AGUARDANDO_PECA':
      return STATUS_OPCOES.filter((s) => ['EM_ATENDIMENTO', 'CONCLUIDA'].includes(s.value));
    default:
      return STATUS_OPCOES;
  }
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [form, setForm] = useState({ descricao: '', tipo: 'CORRETIVA', ativoId: '' });
  const [responderModal, setResponderModal] = useState(null);
  const [responderForm, setResponderForm] = useState({ status: 'EM_ATENDIMENTO', laudoTecnico: '', valorGasto: '' });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const { isGestor, isTecnico, isSolicitante } = useAuth();

  const carregar = async () => {
    try {
      const [ticketsData, ativosData] = await Promise.all([api.getOrdens(), api.getAtivos()]);
      setTickets(ticketsData);
      setAtivos(ativosData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const abrirResponder = (ticket) => {
    const opcoes = opcoesStatus(ticket.status);
    setResponderModal(ticket);
    setResponderForm({
      status: opcoes[0]?.value || 'EM_ATENDIMENTO',
      laudoTecnico: ticket.laudoTecnico || '',
      valorGasto: ticket.custoTotal ? String(ticket.custoTotal) : '',
    });
  };

  const handleAbrir = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await api.criarOrdem({ ...form, ativoId: Number(form.ativoId) });
      setForm({ descricao: '', tipo: 'CORRETIVA', ativoId: '' });
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleVouResolver = async (id) => {
    try {
      await api.iniciarOrdem(id);
      carregar();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResponder = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        status: responderForm.status,
        laudoTecnico: responderForm.laudoTecnico,
      };
      if (responderForm.status === 'CONCLUIDA') {
        dados.valorGasto = Number(responderForm.valorGasto);
      }
      await api.responderTicket(responderModal.id, dados);
      setResponderModal(null);
      setResponderForm({ status: 'EM_ATENDIMENTO', laudoTecnico: '', valorGasto: '' });
      carregar();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm('Deseja excluir este ticket permanentemente?')) return;
    try {
      await api.excluirTicket(id);
      carregar();
    } catch (err) {
      alert(err.message);
    }
  };

  const podeGerenciar = isGestor || isTecnico;
  const podeAbrir = isGestor || isSolicitante;
  const ticketAtivo = (t) => t.status !== 'CONCLUIDA' && t.status !== 'CANCELADA';

  return (
    <Layout>
      <h1 className="page-title">Tickets de Manutenção</h1>
      <p className="page-subtitle">Gerencie o ciclo de vida dos tickets de serviço.</p>

      {podeAbrir && (
        <Card style={{ marginBottom: '2rem' }}>
          <h2>Abrir Novo Ticket</h2>
          {erro && <div className="alert-error">{erro}</div>}
          <form onSubmit={handleAbrir} className="grid-2" style={{ alignItems: 'end' }}>
            <Input label="Descrição do problema/serviço" placeholder="Descreva a falha ou manutenção"
              value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
            <Select label="Tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="CORRETIVA">Corretiva</option>
              <option value="PREVENTIVA">Preventiva</option>
            </Select>
            <Select label="Ativo" value={form.ativoId} onChange={(e) => setForm({ ...form, ativoId: e.target.value })} required>
              <option value="">Selecione o ativo</option>
              {ativos.map((a) => (
                <option key={a.id} value={a.id}>{a.nome} — {a.localizacao}</option>
              ))}
            </Select>
            <Button type="submit" onDark={false}>Abrir Ticket</Button>
          </form>
        </Card>
      )}

      <Card>
        <h2>Lista de Tickets ({tickets.length})</h2>
        {loading ? (
          <p className="empty-state">Carregando...</p>
        ) : tickets.length === 0 ? (
          <p className="empty-state">Nenhum ticket registrado.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Ativo</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Técnico</th>
                <th>Custo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>#{ticket.id}</td>
                  <td>{ticket.descricao}</td>
                  <td>{ticket.ativo?.nome}</td>
                  <td><StatusBadge status={ticket.tipo} /></td>
                  <td><StatusBadge status={ticket.status} /></td>
                  <td>{ticket.tecnico?.nome || '—'}</td>
                  <td>{ticket.custoTotal ? `R$ ${ticket.custoTotal.toFixed(2)}` : '—'}</td>
                  <td>
                    <div className="action-buttons">
                      {ticket.status === 'ABERTA' && isTecnico && (
                        <button className="btn-resolve" onClick={() => handleVouResolver(ticket.id)}>
                          Vou Resolver
                        </button>
                      )}
                      {ticketAtivo(ticket) && podeGerenciar && (
                        <button onClick={() => abrirResponder(ticket)}>Responder</button>
                      )}
                      {isGestor && (
                        <button className="btn-danger" onClick={() => handleExcluir(ticket.id)}>Excluir</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {responderModal && (
        <div className="modal-overlay" onClick={() => setResponderModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Responder Ticket #{responderModal.id}</h2>
            <form onSubmit={handleResponder}>
              <Select label="Status" value={responderForm.status}
                onChange={(e) => setResponderForm({ ...responderForm, status: e.target.value })}>
                {opcoesStatus(responderModal.status).map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
              <Textarea label="Laudo / Descrição do serviço" placeholder="Descreva o que foi feito ou o andamento..."
                value={responderForm.laudoTecnico} onChange={(e) => setResponderForm({ ...responderForm, laudoTecnico: e.target.value })}
                required={responderForm.status === 'CONCLUIDA'} />
              {responderForm.status === 'CONCLUIDA' && (
                <Input label="Valor Gasto (R$)" type="number" step="0.01" min="0" placeholder="0.00"
                  value={responderForm.valorGasto} onChange={(e) => setResponderForm({ ...responderForm, valorGasto: e.target.value })} required />
              )}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit" onDark={false}>Salvar Resposta</Button>
                <button type="button" className="btn-outline" onClick={() => setResponderModal(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
