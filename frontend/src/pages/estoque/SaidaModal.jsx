import { useState } from 'react'
import api, { erroMsg } from '../../api'
import Modal from '../../components/Modal'

const MOTIVOS = [
  { valor: 'AMOSTRA_TESTER', rotulo: 'Amostra / Tester' },
  { valor: 'AVARIA_PERDA', rotulo: 'Avaria / Perda' },
  { valor: 'USO_PESSOAL', rotulo: 'Uso Pessoal' },
  { valor: 'BRINDE', rotulo: 'Brinde' }
]

export default function SaidaModal({ produto, onClose }) {
  const [quantidade, setQuantidade] = useState(1)
  const [motivo, setMotivo] = useState(MOTIVOS[0].valor)
  const [erro, setErro] = useState('')

  const salvar = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/produtos/${produto.id}/saida`, { quantidade: Number(quantidade), motivo })
      onClose(`Saída de ${quantidade} un. registrada para ${produto.nome}`)
    } catch (err) {
      setErro(erroMsg(err))
    }
  }

  return (
    <Modal title="Saída Manual" onClose={() => onClose()}>
      <form onSubmit={salvar} className="space-y-4">
        <p className="text-ink-muted">{[produto.nome, produto.marca].filter(Boolean).join(' · ')} — disponível: <span className="text-ink">{produto.quantidadeEstoque}</span></p>
        <label className="block">
          <span className="label">Quantidade</span>
          <input className="input" type="number" min="1" max={produto.quantidadeEstoque} required autoFocus value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        </label>
        <fieldset>
          <legend className="label">Motivo</legend>
          <div className="grid grid-cols-2 gap-2">
            {MOTIVOS.map((m) => (
              <button
                type="button"
                key={m.valor}
                onClick={() => setMotivo(m.valor)}
                aria-pressed={motivo === m.valor}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${motivo === m.valor ? 'border-danger bg-danger/10 text-danger' : 'border-line text-ink-muted hover:text-ink'}`}
              >
                {m.rotulo}
              </button>
            ))}
          </div>
        </fieldset>
        {erro && <p className="text-sm text-danger" role="alert">{erro}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={() => onClose()}>Cancelar</button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 font-semibold text-night hover:opacity-90">Registrar Saída</button>
        </div>
      </form>
    </Modal>
  )
}
