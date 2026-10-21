import { useState } from 'react'
import api, { erroMsg } from '../../api'
import Modal from '../../components/Modal'

export default function EntradaModal({ produto, onClose }) {
  const [quantidade, setQuantidade] = useState(1)
  const [precoCusto, setPrecoCusto] = useState(produto.precoCusto)
  const [precoVenda, setPrecoVenda] = useState(produto.precoVenda)
  const [erro, setErro] = useState('')

  const salvar = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/produtos/${produto.id}/entrada`, {
        quantidade: Number(quantidade),
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda)
      })
      onClose(`Entrada de ${quantidade} un. registrada para ${produto.nome}`)
    } catch (err) {
      setErro(erroMsg(err))
    }
  }

  return (
    <Modal title="Entrada de Lote" onClose={() => onClose()}>
      <form onSubmit={salvar} className="space-y-4">
        <p className="text-ink-muted">{[produto.nome, produto.marca].filter(Boolean).join(' · ')} — atual: <span className="text-ink">{produto.quantidadeEstoque}</span></p>
        <label className="block">
          <span className="label">Quantidade</span>
          <input className="input" type="number" min="1" required autoFocus value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="label">Novo Custo (R$)</span>
            <input className="input" type="number" step="0.01" min="0" required value={precoCusto} onChange={(e) => setPrecoCusto(e.target.value)} />
          </label>
          <label>
            <span className="label">Nova Venda (R$)</span>
            <input className="input" type="number" step="0.01" min="0" required value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} />
          </label>
        </div>
        {erro && <p className="text-sm text-danger" role="alert">{erro}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={() => onClose()}>Cancelar</button>
          <button className="btn-gold">Registrar Entrada</button>
        </div>
      </form>
    </Modal>
  )
}
