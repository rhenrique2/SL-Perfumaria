import { useState } from 'react'
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Pencil, Plus, Trash2 } from 'lucide-react'
import api, { erroMsg, moeda } from '../api'
import SearchBar from '../components/SearchBar'
import FamiliaSelect from '../components/FamiliaSelect'
import useProdutos from '../components/useProdutos'
import { useToast } from '../components/Toast'
import ProdutoForm from './estoque/ProdutoForm'
import EntradaModal from './estoque/EntradaModal'
import SaidaModal from './estoque/SaidaModal'

export default function Estoque() {
  const [q, setQ] = useState('')
  const [familia, setFamilia] = useState('')
  const [modal, setModal] = useState(null)
  const { produtos, recarregar } = useProdutos(q, familia)
  const notify = useToast()

  const fechar = (mensagem) => {
    setModal(null)
    if (mensagem) {
      notify(mensagem)
      recarregar()
    }
  }

  const excluir = async (p) => {
    if (!window.confirm(`Excluir ${p.nome}?`)) return
    try {
      await api.delete(`/produtos/${p.id}`)
      notify('Produto excluído')
      recarregar()
    } catch (e) {
      notify(erroMsg(e), 'error')
    }
  }

  const baixos = produtos.filter((p) => p.estoqueBaixo).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <SearchBar value={q} onChange={setQ} />
        <FamiliaSelect value={familia} onChange={setFamilia} todas className="md:w-60" />
        <button className="btn-gold" onClick={() => setModal({ tipo: 'form' })}>
          <Plus className="h-4 w-4" /> Novo Perfume
        </button>
      </div>

      {baixos > 0 && (
        <p className="flex items-center gap-2 rounded-lg border border-alert/40 bg-alert/10 px-4 py-2 text-sm text-alert">
          <AlertTriangle className="h-4 w-4" /> {baixos} {baixos === 1 ? 'item está' : 'itens estão'} no estoque mínimo ou abaixo.
        </p>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">Perfume</th>
              <th className="px-4 py-3">Família</th>
              <th className="px-4 py-3">Volume</th>
              <th className="px-4 py-3 text-right">Custo</th>
              <th className="px-4 py-3 text-right">Venda</th>
              <th className="px-4 py-3 text-right">Estoque</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} className={`border-b border-line last:border-0 ${p.estoqueBaixo ? 'bg-alert/10' : ''}`}>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.nome}</p>
                  <p className="text-xs text-ink-muted">{p.marca}{p.codigoBarras ? ` · ${p.codigoBarras}` : ''}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.familiaOlfativa}</td>
                <td className="px-4 py-3 text-ink-muted">{p.volumetria}</td>
                <td className="px-4 py-3 text-right text-ink-muted">{moeda(p.precoCusto)}</td>
                <td className="px-4 py-3 text-right text-gold">{moeda(p.precoVenda)}</td>
                <td className={`px-4 py-3 text-right font-semibold ${p.estoqueBaixo ? 'text-alert' : ''}`}>
                  {p.quantidadeEstoque}
                  <span className="ml-1 text-xs font-normal text-ink-muted">/ mín {p.estoqueMinimo}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <IconButton titulo="Entrada de lote" onClick={() => setModal({ tipo: 'entrada', produto: p })} className="hover:text-success">
                      <ArrowDownToLine className="h-4 w-4" />
                    </IconButton>
                    <IconButton titulo="Saída manual" onClick={() => setModal({ tipo: 'saida', produto: p })} className="hover:text-danger">
                      <ArrowUpFromLine className="h-4 w-4" />
                    </IconButton>
                    <IconButton titulo="Editar" onClick={() => setModal({ tipo: 'form', produto: p })} className="hover:text-gold">
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton titulo="Excluir" onClick={() => excluir(p)} className="hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
            {produtos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-ink-muted">Nenhum produto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal?.tipo === 'form' && <ProdutoForm produto={modal.produto} onClose={fechar} />}
      {modal?.tipo === 'entrada' && <EntradaModal produto={modal.produto} onClose={fechar} />}
      {modal?.tipo === 'saida' && <SaidaModal produto={modal.produto} onClose={fechar} />}
    </div>
  )
}

function IconButton({ titulo, onClick, className, children }) {
  return (
    <button title={titulo} aria-label={titulo} onClick={onClick} className={`rounded-md p-2 text-ink-muted transition-colors hover:bg-night ${className}`}>
      {children}
    </button>
  )
}
