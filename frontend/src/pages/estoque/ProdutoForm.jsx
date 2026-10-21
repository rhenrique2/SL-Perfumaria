import { useState } from 'react'
import api, { erroMsg } from '../../api'
import Modal from '../../components/Modal'
import FamiliaSelect from '../../components/FamiliaSelect'

const vazio = {
  nome: '', volumetria: '', familiaOlfativa: '',
  precoCusto: '', precoVenda: '', quantidadeEstoque: 0, estoqueMinimo: 3
}

export default function ProdutoForm({ produto, onClose }) {
  const [form, setForm] = useState(() => (produto ? { ...vazio, ...produto } : vazio))
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  const salvar = async (e) => {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    const payload = {
      ...form,
      precoCusto: Number(form.precoCusto),
      precoVenda: Number(form.precoVenda),
      quantidadeEstoque: Number(form.quantidadeEstoque),
      estoqueMinimo: Number(form.estoqueMinimo)
    }
    try {
      if (produto) await api.put(`/produtos/${produto.id}`, payload)
      else await api.post('/produtos', payload)
      onClose(produto ? 'Perfume atualizado' : 'Perfume cadastrado')
    } catch (err) {
      setErro(erroMsg(err))
      setSalvando(false)
    }
  }

  return (
    <Modal title={produto ? 'Editar Perfume' : 'Novo Perfume'} onClose={() => onClose()} wide>
      <form onSubmit={salvar} className="grid gap-4 md:grid-cols-2">
        <Campo rotulo="Nome"><input className="input" required value={form.nome} onChange={set('nome')} /></Campo>
        <Campo rotulo="Volumetria"><input className="input" required placeholder="100ml" value={form.volumetria} onChange={set('volumetria')} /></Campo>
        <Campo rotulo="Família Olfativa">
          <FamiliaSelect value={form.familiaOlfativa} onChange={(v) => setForm((f) => ({ ...f, familiaOlfativa: v }))} />
        </Campo>
        <Campo rotulo="Preço de Custo (R$)"><input className="input" type="number" step="0.01" min="0" required value={form.precoCusto} onChange={set('precoCusto')} /></Campo>
        <Campo rotulo="Preço de Venda (R$)"><input className="input" type="number" step="0.01" min="0" required value={form.precoVenda} onChange={set('precoVenda')} /></Campo>
        <Campo rotulo={produto ? 'Estoque (use Entrada/Saída)' : 'Estoque Inicial'}>
          <input className="input" type="number" min="0" required disabled={!!produto} value={form.quantidadeEstoque} onChange={set('quantidadeEstoque')} />
        </Campo>
        <Campo rotulo="Estoque Mínimo"><input className="input" type="number" min="0" required value={form.estoqueMinimo} onChange={set('estoqueMinimo')} /></Campo>
        {erro && <p className="text-sm text-danger md:col-span-2" role="alert">{erro}</p>}
        <div className="flex justify-end gap-2 md:col-span-2">
          <button type="button" className="btn-ghost" onClick={() => onClose()}>Cancelar</button>
          <button className="btn-gold" disabled={salvando || !form.familiaOlfativa}>Salvar</button>
        </div>
      </form>
    </Modal>
  )
}

function Campo({ rotulo, largo, children }) {
  return (
    <label className={largo ? 'md:col-span-2' : ''}>
      <span className="label">{rotulo}</span>
      {children}
    </label>
  )
}
