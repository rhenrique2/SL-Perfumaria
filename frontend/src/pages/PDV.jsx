import { useRef, useState } from 'react'
import { Banknote, CreditCard, Minus, Plus, QrCode, Trash2, Wallet } from 'lucide-react'
import api, { erroMsg, moeda } from '../api'
import SearchBar from '../components/SearchBar'
import useProdutos from '../components/useProdutos'
import { useToast } from '../components/Toast'
import { useCarrinho } from '../components/Carrinho'

const PAGAMENTOS = [
  { valor: 'PIX', rotulo: 'Pix', icone: QrCode },
  { valor: 'CREDITO', rotulo: 'Crédito', icone: CreditCard },
  { valor: 'DEBITO', rotulo: 'Débito', icone: Wallet },
  { valor: 'DINHEIRO', rotulo: 'Dinheiro', icone: Banknote }
]

export default function PDV() {
  const [q, setQ] = useState('')
  const { carrinho, adicionar: adicionarAoCarrinho, alterar, limpar } = useCarrinho()
  const [desconto, setDesconto] = useState('')
  const [pagamento, setPagamento] = useState('PIX')
  const [finalizando, setFinalizando] = useState(false)
  const busca = useRef(null)
  const notify = useToast()
  const { produtos, recarregar } = useProdutos(q, '')

  const adicionar = (produto) => {
    if (!adicionarAoCarrinho(produto)) return
    setQ('')
    busca.current?.focus()
  }

  const onEnter = async (e) => {
    if (e.key !== 'Enter' || !q.trim()) return
    try {
      const { data } = await api.get(`/produtos/barcode/${encodeURIComponent(q.trim())}`)
      adicionar(data)
    } catch {
      if (produtos.length === 1) adicionar(produtos[0])
    }
  }

  const subtotal = carrinho.reduce((s, i) => s + i.quantidade * i.produto.precoVenda, 0)
  const valorDesconto = Math.min(Number(desconto) || 0, subtotal)
  const total = subtotal - valorDesconto

  const finalizar = async () => {
    setFinalizando(true)
    try {
      const { data } = await api.post('/vendas', {
        itens: carrinho.map((i) => ({ produtoId: i.produto.id, quantidade: i.quantidade })),
        desconto: valorDesconto,
        formaPagamento: pagamento
      })
      notify(`Venda #${data.id} finalizada — ${moeda(data.valorTotal)}`)
      limpar()
      setDesconto('')
      setQ('')
      recarregar()
      busca.current?.focus()
    } catch (e) {
      notify(erroMsg(e), 'error')
    } finally {
      setFinalizando(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <section className="space-y-4">
        <SearchBar value={q} onChange={setQ} inputRef={busca} onKeyDown={onEnter} autoFocus placeholder="Escaneie o código de barras ou busque o perfume e pressione Enter..." />
        {q && (
          <ul className="card divide-y divide-line">
            {produtos.slice(0, 8).map((p) => (
              <li key={p.id}>
                <button onClick={() => adicionar(p)} disabled={p.quantidadeEstoque === 0} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-night disabled:opacity-40">
                  <span>
                    <span className="font-medium">{p.nome}</span>
                    <span className="ml-2 text-sm text-ink-muted">{[p.marca, p.volumetria].filter(Boolean).join(' · ')}</span>
                  </span>
                  <span className="flex items-center gap-4 text-sm">
                    <span className={p.estoqueBaixo ? 'text-alert' : 'text-ink-muted'}>{p.quantidadeEstoque} un.</span>
                    <span className="font-semibold text-gold">{moeda(p.precoVenda)}</span>
                  </span>
                </button>
              </li>
            ))}
            {produtos.length === 0 && <li className="px-4 py-3 text-ink-muted">Nenhum produto encontrado.</li>}
          </ul>
        )}

        <div className="card">
          <h2 className="border-b border-line px-5 py-3 font-serif text-xl text-gold">Carrinho</h2>
          {carrinho.length === 0 ? (
            <p className="px-5 py-12 text-center text-ink-muted">Nenhum item adicionado.</p>
          ) : (
            <ul className="divide-y divide-line">
              {carrinho.map(({ produto, quantidade }) => (
                <li key={produto.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{produto.nome}</p>
                    <p className="text-sm text-ink-muted">{[produto.marca, moeda(produto.precoVenda)].filter(Boolean).join(' · ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-md border border-line p-1 hover:border-gold" onClick={() => alterar(produto.id, -1)} aria-label="Diminuir"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center">{quantidade}</span>
                    <button className="rounded-md border border-line p-1 hover:border-gold" onClick={() => alterar(produto.id, 1)} aria-label="Aumentar"><Plus className="h-4 w-4" /></button>
                    <span className="w-28 text-right font-semibold">{moeda(quantidade * produto.precoVenda)}</span>
                    <button className="p-1 text-ink-muted hover:text-danger" onClick={() => alterar(produto.id, -quantidade)} aria-label="Remover"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <aside className="card h-fit space-y-5 p-6">
        <div className="space-y-2 text-sm">
          <Linha rotulo="Subtotal" valor={moeda(subtotal)} />
          <label className="flex items-center justify-between gap-4">
            <span className="text-ink-muted">Desconto (R$)</span>
            <input className="input w-32 text-right" type="number" min="0" step="0.01" value={desconto} onChange={(e) => setDesconto(e.target.value)} />
          </label>
        </div>
        <div className="flex items-end justify-between border-t border-line pt-4">
          <span className="text-ink-muted">Total</span>
          <span className="font-serif text-4xl font-semibold text-gold">{moeda(total)}</span>
        </div>
        <fieldset>
          <legend className="label">Forma de Pagamento</legend>
          <div className="grid grid-cols-2 gap-2">
            {PAGAMENTOS.map(({ valor, rotulo, icone: Icone }) => (
              <button
                key={valor}
                onClick={() => setPagamento(valor)}
                aria-pressed={pagamento === valor}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 transition-colors ${pagamento === valor ? 'border-gold bg-gold/10 text-gold' : 'border-line text-ink-muted hover:text-ink'}`}
              >
                <Icone className="h-4 w-4" /> {rotulo}
              </button>
            ))}
          </div>
        </fieldset>
        <button className="btn-gold w-full py-3 text-lg" disabled={carrinho.length === 0 || finalizando} onClick={finalizar}>
          Finalizar Venda
        </button>
      </aside>
    </div>
  )
}

function Linha({ rotulo, valor }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{rotulo}</span>
      <span>{valor}</span>
    </div>
  )
}
