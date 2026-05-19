import { useState, useEffect } from 'react';

function App() {
  const [ativos, setAtivos] = useState([]);
  const [ordens, setOrdens] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const resAtivos = await fetch('http://localhost:8080/api/ativos');
      if (resAtivos.ok) {
        const dataAtivos = await resAtivos.json();
        setAtivos(dataAtivos);
      }

      const resOrdens = await fetch('http://localhost:8080/api/ordens');
      if (resOrdens.ok) {
        const dataOrdens = await resOrdens.json();
        setOrdens(dataOrdens);
      }
    } catch (error) {
      console.error("Erro de conexão com a API:", error);
    }
  };

  const tema = {
    container: { backgroundColor: '#5a5a5aff', color: '#000000', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' },
    cabecalho: { borderBottom: '2px solid #000', marginBottom: '20px', paddingBottom: '10px' },
    grid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    cartao: { flex: 1, minWidth: '300px', backgroundColor: '#5a5a5aff', padding: '20px', borderRadius: '4px', border: '1px solid #4f4f4fff' },
    lista: { listStyle: 'none', padding: 0 },
    item: { borderBottom: '1px solid #999', padding: '15px 0' }
  };

  return (
    <div style={tema.container}>
      <header style={tema.cabecalho}>
        <h1>CMM - Gestão de Manutenção</h1>
      </header>

      <main style={tema.grid}>
        {/* Painel de Ativos */}
        <section style={tema.cartao}>
          <h2>Inventário de Ativos</h2>
          {ativos.length === 0 ? <p>Nenhum ativo cadastrado no sistema.</p> : (
            <ul style={tema.lista}>
              {ativos.map(ativo => (
                <li key={ativo.id} style={tema.item}>
                  <strong>{ativo.nome}</strong> - {ativo.categoria} <br />
                  Local: {ativo.localizacao} | Status: {ativo.status}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Painel de Ordens */}
        <section style={tema.cartao}>
          <h2>Ordens de Manutenção</h2>
          {ordens.length === 0 ? <p>Nenhuma ordem aberta no momento.</p> : (
            <ul style={tema.lista}>
              {ordens.map(ordem => (
                <li key={ordem.id} style={tema.item}>
                  <strong>Ordem #{ordem.id}</strong> <br />
                  Descrição: {ordem.descricao} <br />
                  Equipamento: {ordem.ativo?.nome} <br />
                  Status atual: {ordem.status}
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