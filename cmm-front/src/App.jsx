import { useState, useEffect } from 'react'

function App() {
  const [ativos, setAtivos] = useState([])

  // Busca os dados no Back-end assim que a tela carrega
  useEffect(() => {
    fetch('http://localhost:8080/api/ativos')
      .then(response => response.json())
      .then(data => setAtivos(data))
      .catch(error => console.error("Erro ao buscar a API:", error))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>CMM - Dashboard de Ativos</h1>
      <p>Lista de equipamentos cadastrados no sistema.</p>

      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Nome</th>
            <th style={{ padding: '10px' }}>Categoria</th>
            <th style={{ padding: '10px' }}>Localização</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {ativos.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>
                Nenhum ativo cadastrado ainda. (Banco de dados vazio)
              </td>
            </tr>
          ) : (
            ativos.map((ativo) => (
              <tr key={ativo.id}>
                <td style={{ padding: '10px' }}>{ativo.id}</td>
                <td style={{ padding: '10px' }}>{ativo.nome}</td>
                <td style={{ padding: '10px' }}>{ativo.categoria}</td>
                <td style={{ padding: '10px' }}>{ativo.localizacao}</td>
                <td style={{ padding: '10px', color: ativo.status === 'ONLINE' ? 'green' : 'red' }}>
                  <strong>{ativo.status}</strong>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App