import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [nome, setNome] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [nota, setNota] = useState('')
  const [registros, setRegistros] = useState([])
const [idEditando, setIdEditando] = useState(null)
  async function carregarRegistros() {
    const { data, error } = await supabase
      .from('desempenhos')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Erro ao carregar:', error)
      return
    }

    setRegistros(data)
  }

  useEffect(() => {
    carregarRegistros()
  }, [])

  async function cadastrar() {
    const situacao = Number(nota) >= 6 ? 'Aprovado' : 'Recuperação'

    const { error } = await supabase
      .from('desempenhos')
      .insert([
        {
          estudante: nome,
          conteudo: conteudo,
          nota: Number(nota),
          situacao: situacao
        }
      ])

    if (error) {
      alert('Erro ao cadastrar o registro.')
      console.error(error)
      return
    }

    alert('Registro cadastrado com sucesso!')
    await carregarRegistros()

    setNome('')
    setConteudo('')
    setNota('')
  }

  function editarRegistro(registro) {
    setNome(registro.estudante)
    setConteudo(registro.conteudo)
    setNota(registro.nota)
    setIdEditando(registro.id)
  }
    async function atualizarRegistro() {
  const situacao = Number(nota) >= 6 ? 'Aprovado' : 'Recuperação'

  const { error } = await supabase
    .from('desempenhos')
    .update({
      estudante: nome,
      conteudo: conteudo,
      nota: Number(nota),
      situacao: situacao
    })
    .eq('id', idEditando)

  if (error) {
    alert('Erro ao atualizar o registro.')
    console.error(error)
    return
  }

  alert('Registro atualizado com sucesso!')

  setIdEditando(null)
  setNome('')
  setConteudo('')
  setNota('')

  await carregarRegistros()
}
async function excluirRegistro(id) {
  const confirmar = window.confirm('Deseja realmente excluir este registro?')

  if (!confirmar) return

  const { error } = await supabase
    .from('desempenhos')
    .delete()
    .eq('id', id)

  if (error) {
    alert('Erro ao excluir o registro.')
    console.error(error)
    return
  }

  alert('Registro excluído com sucesso!')
  await carregarRegistros()
}

  return (
    <div className="container">
      <h1>MathClass</h1>
      <p>Registro de desempenho dos estudantes</p>

      <h2>Cadastrar desempenho</h2>

      <input
        type="text"
        placeholder="Nome do estudante"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <select
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
      >
        <option value="">Selecione o conteúdo</option>
        <option value="Função Exponencial">Função Exponencial</option>
        <option value="Logaritmos">Logaritmos</option>
        <option value="Trigonometria">Trigonometria</option>
        <option value="Estatística">Estatística</option>
      </select>

      <input
        type="number"
        placeholder="Nota"
        value={nota}
        onChange={(e) => setNota(e.target.value)}
      />

      <button onClick={idEditando ? atualizarRegistro : cadastrar}>
  {idEditando ? 'Salvar alteração' : 'Cadastrar'}
</button>

      <h2>Desempenho dos estudantes</h2>

      <table>
        <thead>
          <tr>
            <th>Estudante</th>
            <th>Conteúdo</th>
            <th>Nota</th>
            <th>Situação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.estudante}</td>
              <td>{registro.conteudo}</td>
              <td>{registro.nota}</td>
              <td>{registro.situacao}</td>
              <td>
                <button onClick={() => editarRegistro(registro)}>
                  Editar
                </button>
                <button onClick={() => excluirRegistro(registro.id)}>
                 Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App