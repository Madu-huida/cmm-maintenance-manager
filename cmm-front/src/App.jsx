import { useState } from 'react';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  // Estados dos formulários
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [erroLogin, setErroLogin] = useState(''); // Estado para a mensagem de erro
  
  const [registroForm, setRegistroForm] = useState({ nomeEmpresa: '', cnpj: '', email: '', senha: '' });

  // Estados do Inventário
  const [maquinas, setMaquinas] = useState([
    { id: 1, nome: 'Compressor Industrial HP', categoria: 'Pneumática', precisaManutencao: true },
    { id: 2, nome: 'Torno Mecânico CNC V3', categoria: 'Usinagem', precisaManutencao: false },
    { id: 3, nome: 'Prensa Hidráulica 40T', categoria: 'Hidráulica', precisaManutencao: true }
  ]);
  const [novaMaquina, setNovaMaquina] = useState({ nome: '', categoria: '', precisaManutencao: true });

  // AÇÕES CONECTADAS AO BANCO DE DADOS (JAVA)
  const executarLogin = async (e) => {
    e.preventDefault();
    setErroLogin(''); // Limpa o erro antes de tentar novamente

    try {
      const res = await fetch('http://localhost:8080/api/empresas/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLogin, senha: senhaLogin })
      });

      if (res.ok) {
        // Login aprovado no banco de dados
        setTelaAtual('dashboard');
        setEmailLogin('');
        setSenhaLogin('');
      } else {
        // E-mail não existe ou senha incorreta (Erro 401)
        setErroLogin('Não há login com esse endereço de e-mail ou a senha está incorreta.');
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      setErroLogin('Erro ao conectar com o servidor. O Back-end está rodando?');
    }
  };

  const executarRegistro = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/empresas/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registroForm)
      });

      if (res.ok) {
        alert('Registro salvo no banco de dados! Retornando para o login.');
        setRegistroForm({ nomeEmpresa: '', cnpj: '', email: '', senha: '' });
        setTelaAtual('login');
      } else {
        alert('Erro: Este e-mail ou CNPJ já deve estar registrado no sistema.');
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  // Ações de Interface
  const adicionarMaquina = (e) => {
    e.preventDefault();
    if (!novaMaquina.nome || !novaMaquina.categoria) return;
    const novoItem = { id: Date.now(), ...novaMaquina };
    setMaquinas([...maquinas, novoItem]);
    setNovaMaquina({ nome: '', categoria: '', precisaManutencao: true });
  };

  const alternarStatusManutencao = (id) => {
    setMaquinas(maquinas.map(m => m.id === id ? { ...m, precisaManutencao: !m.precisaManutencao } : m));
  };

  // Estilos
  const estilos = {
    corpo: { backgroundColor: '#e2e2e2', color: '#000000', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' },
    centralizado: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e2e2', fontFamily: 'sans-serif' },
    caixaAcesso: { backgroundColor: '#d4d4d4', padding: '40px', borderRadius: '4px', border: '1px solid #999', width: '100%', maxWidth: '400px', textAlign: 'center' },
    header: { borderBottom: '2px solid #000', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#d4d4d4' },
    grid: { display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '30px' },
    card: { flex: 1, minWidth: '320px', backgroundColor: '#d4d4d4', padding: '20px', borderRadius: '4px', border: '1px solid #999' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #999', backgroundColor: '#fff', color: '#000' },
    select: { padding: '10px', borderRadius: '4px', border: '1px solid #999', backgroundColor: '#fff' },
    btn: { padding: '10px', backgroundColor: '#000000', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
    btnLink: { background: 'none', border: 'none', color: '#000', textDecoration: 'underline', cursor: 'pointer', marginTop: '15px', fontSize: '14px' },
    btnStatus: { padding: '5px 10px', backgroundColor: '#fff', border: '1px solid #000', borderRadius: '4px', cursor: 'pointer', marginTop: '5px', fontSize: '12px' },
    lista: { listStyle: 'none', padding: 0 },
    item: { borderBottom: '1px solid #999', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    alerta: { color: '#900', backgroundColor: '#fcc', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', border: '1px solid #c00' }
  };

  // RENDERIZAÇÃO DA TELA DE LOGIN
  if (telaAtual === 'login') {
    return (
      <div style={estilos.centralizado}>
        <div style={estilos.caixaAcesso}>
          <h1 style={{ margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '2px solid #000' }}>CMM Login</h1>
          
          {/* Caixa de mensagem de erro exibida apenas se houver falha */}
          {erroLogin && <div style={estilos.alerta}>{erroLogin}</div>}

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
          <button style={estilos.btnLink} onClick={() => { setTelaAtual('registro'); setErroLogin(''); }}>
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

  // RENDERIZAÇÃO DO DASHBOARD
  return (
    <div style={estilos.corpo}>
      <header style={estilos.header}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>CMM - Painel de Itens Ativos</h1>
        <button style={{ ...estilos.btn, backgroundColor: '#999', color: '#000' }} onClick={() => setTelaAtual('login')}>
          Sair
        </button>
      </header>

      <main style={estilos.grid}>
        
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

        <section style={estilos.card}>
          <h2 style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>Faltam Fazer</h2>
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

        <section style={estilos.card}>
          <h2 style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>Não Precisam</h2>
          <p style={{ fontSize: '13px', color: '#444' }}>Equipamentos operando normalmente:</p>
          {maquinas.filter(m => !m.precisaManutencao).length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#555' }}>Nenhum ativo operacional listado.</p>
          ) : (
            <ul style={estilos.lista}>
              {maquinas.filter(m => !m.precisaManutencao).map(maquina => (
                <li key={maquina.id} style={estilos.item}>
                  <div>
                    <strong>{maquina.nome}</strong> <br />
                    <span style={{ fontSize: '12px', color: '#333' }}>Setor/Cat: {maquina.categoria}</span>
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