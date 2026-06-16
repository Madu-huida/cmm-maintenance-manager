const API_BASE = import.meta.env.DEV ? '/api' : 'http://localhost:8080/api';

function getToken() {
  return localStorage.getItem('cmm_token');
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    if (!text) {
      throw new Error(`Erro ${response.status}`);
    }
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      throw new Error(`Erro ${response.status}`);
    }
    const msg = error.erro || error.error || error.message
      || Object.values(error).filter(v => typeof v === 'string').join(', ');
    throw new Error(msg || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  login: (email, senha) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),

  registro: (dados) =>
    request('/auth/registro', { method: 'POST', body: JSON.stringify({ ...dados, perfil: 'GESTOR' }) }),

  getDashboard: () => request('/dashboard'),

  getAtivos: () => request('/ativos'),
  criarAtivo: (ativo) => request('/ativos', { method: 'POST', body: JSON.stringify(ativo) }),
  atualizarAtivo: (id, ativo) => request(`/ativos/${id}`, { method: 'PUT', body: JSON.stringify(ativo) }),
  deletarAtivo: (id) => request(`/ativos/${id}`, { method: 'DELETE' }),

  getOrdens: () => request('/ordens'),
  criarOrdem: (ordem) => request('/ordens', { method: 'POST', body: JSON.stringify(ordem) }),
  iniciarOrdem: (id) => request(`/ordens/${id}/iniciar`, { method: 'PUT' }),
  aguardarPeca: (id) => request(`/ordens/${id}/aguardar-peca`, { method: 'PUT' }),
  retomarOrdem: (id) => request(`/ordens/${id}/retomar`, { method: 'PUT' }),
  fecharOrdem: (id, dados) => request(`/ordens/${id}/fechar`, { method: 'PUT', body: JSON.stringify(dados) }),
  cancelarOrdem: (id) => request(`/ordens/${id}/cancelar`, { method: 'PUT' }),
  responderTicket: (id, dados) => request(`/ordens/${id}/responder`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluirTicket: (id) => request(`/ordens/${id}`, { method: 'DELETE' }),

  getUsuarios: () => request('/usuarios'),
  getTecnicos: () => request('/usuarios/tecnicos'),
  criarUsuario: (usuario) => request('/usuarios', { method: 'POST', body: JSON.stringify(usuario) }),
  encerrarConta: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),
};
