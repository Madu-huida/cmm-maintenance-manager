import { useState } from 'react';

function App() {
  // Controle de navegação: 'login', 'registro' ou 'dashboard'
  const [telaAtual, setTelaAtual] = useState('login');

  // Estados dos formulários de acesso
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [registroForm, setRegistroForm] = useState({ nomeEmpresa: '', cnpj: '', email: '', senha: '' });

  // Estados do Inventário de Máquinas (Itens Ativos)
  const [maquinas, setMaquinas] = useState([
    { id: 1, nome: 'Compressor Industrial HP', categoria: 'Pneumática', precisaManutencao: true },
    { id: 2, nome: 'Torno Mecânico CNC V3', categoria: 'Usinagem', precisaManutencao: false },
    { id: 3, nome: 'Prensa Hidráulica 40T', categoria: 'Hidráulica', precisaManutencao: true }
  ]);
  const [novaMaquina, setNovaMaquina] = useState({ nome: '', categoria: '', precisaManutencao: true });

  // Ações de Navegação e Fluxo
  const executarLogin = (e) => {
    e.preventDefault();
    if (emailLogin && setSenhaLogin) {
      setTelaAtual('dashboard');
    }
  };

  const executarRegistro = (e) => {
    e.preventDefault();
    alert('Registro realizado com sucesso! Retornando para a tela de login.');
    setRegistroForm({ nomeEmpresa: '', cnpj: '', email: '', senha: '' });
    setTelaAtual('login'); // Retorna automaticamente para o login
  };

  const adicionarMaquina = (e) => {
    e.preventDefault();
    if (!novaMaquina.nome || !novaMaquina.categoria) return;

    const novoItem = {
      id: Date.now(),
      nome: novaMaquina.nome,
      categoria: novaMaquina.categoria,
      precisaManutencao: novaMaquina.precisaManutencao
    };

    setMaquinas([...maquinas, novoItem]);
    setNovaMaquina({ nome: '', categoria: '', precisaManutencao: true }); // Limpa o form
  };

  const alternarStatusManutencao = (id) => {
    setMaquinas(maquinas.map(m => m.id === id ? { ...m, precisaManutencao: !m.precisaManutencao } : m));
  };

  // Objetos de estilo com paleta minimalista (Preto e Cinza)
  const estilos = {
    //main
    corpo: { backgroundColor: '#00364F', color: '#00364F', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' },
    centralizado: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2f0f9ff', fontFamily: 'sans-serif' },
    //caixa de login e registro
    caixaAcesso: { backgroundColor: '#c3dfecff', padding: '40px', borderRadius: '4px', border: '1px solid #999', width: '100%', maxWidth: '400px', textAlign: 'center' },
    header: { borderBottom: '2px solid #aad2efff', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#c3dfecff' },
    grid: { display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '30px' },
    card: { flex: 1, minWidth: '320px', backgroundColor: '#c3dfecff', padding: '20px', borderRadius: '4px', border: '1px solid #999' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #999', backgroundColor: '#fff', color: '#000000ff' },
    select: { padding: '10px', borderRadius: '4px', border: '1px solid #999', backgroundColor: '#fff' },
    btn: { padding: '10px', backgroundColor: '#204159ff', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
    btnLink: { background: 'none', border: 'none', color: '#204159ff', textDecoration: 'underline', cursor: 'pointer', marginTop: '15px', fontSize: '14px' },
    btnStatus: { padding: '5px 10px', backgroundColor: '#204159ff', border: '1px solid #00364F', borderRadius: '4px', cursor: 'pointer', marginTop: '5px', fontSize: '12px' },
    lista: { listStyle: 'none', padding: 0 },
    item: { borderBottom: '1px solid #999', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
  };

  // RENDERIZAÇÃO DA TELA DE LOGIN
  if (telaAtual === 'login') {
    return (
      <div style={estilos.centralizado}>
        <div style={estilos.caixaAcesso}>
          <h1 style={{ margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '2px solid #ffffffff' }}>CMM Login</h1>
          <form onSubmit={executarLogin} style={estilos.formGroup}>
            <input 
              style={estilos.input} 
              type="email" 
              placeholder="E-mail corporativo" 
              value={emailLogin} 
              onChange={(e) => setEmailLogin(e.target.value)} 
              required 
            />
            <input 
              style={estilos.input} 
              type="password" 
              placeholder="Senha" 
              value={senhaLogin} 
              onChange={(e) => setSenhaLogin(e.target.value)} 
              required 
            />
            <button type="submit" style={estilos.btn}>Entrar no Sistema</button>
          </form>
          <button style={estilos.btnLink} onClick={() => setTelaAtual('registro')}>
            Não tem uma conta? Registre-se aqui
          </button>
        </div>
      </div>
    );
  }

  // RENDERIZAÇÃO DA TELA DE REGISTRO
  if (telaAtual === 'registro') {
    return (
      <div style={estilos.centralizado}>
        <div style={estilos.caixaAcesso}>
          <h1 style={{ margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '2px solid #000' }}>Criar Conta</h1>
          <form onSubmit={executarRegistro} style={estilos.formGroup}>
            <input 
              style={estilos.input} 
              type="text" 
              placeholder="Nome da Empresa" 
              value={registroForm.nomeEmpresa}
              onChange={(e) => setRegistroForm({...registroForm, nomeEmpresa: e.target.value})}
              required 
            />
            <input 
              style={estilos.input} 
              type="text" 
              placeholder="CNPJ" 
              value={registroForm.cnpj}
              onChange={(e) => setRegistroForm({...registroForm, cnpj: e.target.value})}
              required 
            />
            <input 
              style={estilos.input} 
              type="email" 
              placeholder="E-mail do Administrador" 
              value={registroForm.email}
              onChange={(e) => setRegistroForm({...registroForm, email: e.target.value})}
              required 
            />
            <input 
              style={estilos.input} 
              type="password" 
              placeholder="Senha de Acesso" 
              value={registroForm.senha}
              onChange={(e) => setRegistroForm({...registroForm, senha: e.target.value})}
              required 
            />
            <button type="submit" style={estilos.btn}>Salvar Registro</button>
          </form>
          <button style={estilos.btnLink} onClick={() => setTelaAtual('login')}>
            Já tem um registro? Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  // RENDERIZAÇÃO DO DASHBOARD (ITENS ATIVOS E MANUTENÇÃO)
  return (
    <div style={estilos.corpo}>
      <header style={estilos.header}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>CMM - Painel de Itens Ativos</h1>
        <button style={{ ...estilos.btn, backgroundColor: '#00364F', color: '#ffffffff' }} onClick={() => setTelaAtual('login')}>
          Sair
        </button>
      </header>

      <main style={estilos.grid}>
        
        {/* Formulário para Adicionar Máquina */}
        <section style={estilos.card}>
          <h2>Adicionar Nova Máquina</h2>
          <form onSubmit={adicionarMaquina} style={estilos.formGroup}>
            <input 
              style={estilos.input}
              type="text" 
              placeholder="Nome do Equipamento (Ex: Torno CNC)" 
              value={novaMaquina.nome}
              onChange={(e) => setNovaMaquina({...novaMaquina, nome: e.target.value})}
              required
            />
            <input 
              style={estilos.input}
              type="text" 
              placeholder="Categoria (Ex: Elétrica, Hidráulica)" 
              value={novaMaquina.categoria}
              onChange={(e) => setNovaMaquina({...novaMaquina, categoria: e.target.value})}
              required
            />
            <label style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>
              Necessita de Manutenção Imediata?
              <select 
                style={{ ...estilos.select, width: '100%', marginTop: '5px' }}
                value={novaMaquina.precisaManutencao}
                onChange={(e) => setNovaMaquina({...novaMaquina, precisaManutencao: e.target.value === 'true'})}
              >
                <option value="true">Sim (Precisa)</option>
                <option value="false">Não (Operacional)</option>
              </select>
            </label>
            <button type="submit" style={estilos.btn}>Cadastrar no Inventário</button>
          </form>
        </section>

        {/* Coluna: Faltam Fazer (Necessitam de Manutenção) */}
        <section style={estilos.card}>
          <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>Faltam Fazer</h2>
          <p style={{ fontSize: '13px', color: '#444' }}>Máquinas aguardando intervenção técnica:</p>
          {maquinas.filter(m => m.precisaManutencao).length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#555' }}>Nenhuma máquina necessitando de reparos.</p>
          ) : (
            <ul style={estilos.lista}>
              {maquinas.filter(m => m.precisaManutencao).map(maquina => (
                <li key={maquina.id} style={estilos.item}>
                  <div>
                    <strong>{maquina.nome}</strong> <br />
                    <span style={{ fontSize: '12px', color: '#333' }}>Setor/Cat: {maquina.categoria}</span>
                  </div>
                  <button style={estilos.btnStatus} onClick={() => alternarStatusManutencao(maquina.id)}>
                    Marcar como Feito
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Coluna: Não Precisam de Manutenção */}
        <section style={estilos.card}>
          <h2 style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>Não Precisam</h2>
          <p style={{ fontSize: '13px', color: '#444' }}>Equipamentos operando normalmente:</p>
          {maquinas.filter(m => !m.precisaManutencao).length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#00364F' }}>Nenhum ativo operacional listado.</p>
          ) : (
            <ul style={estilos.lista}>
              {maquinas.filter(m => !m.precisaManutencao).map(maquina => (
                <li key={maquina.id} style={estilos.item}>
                  <div>
                    <strong>{maquina.nome}</strong> <br />
                    <span style={{ fontSize: '12px', color: '#ffffffff' }}>Setor/Cat: {maquina.categoria}</span>
                  </div>
                  <button style={estilos.btnStatus} onClick={() => alternarStatusManutencao(maquina.id)}>
                    Colocar em Manutenção
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  );
}

export default App;