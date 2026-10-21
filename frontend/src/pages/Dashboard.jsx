import { useCallback, useEffect, useState } from 'react'
import { CalendarDays, Sun, Trash2, TrendingUp } from 'lucide-react'
import api, { erroMsg, moeda } from '../api'
import { useToast } from '../components/Toast'

export default function Dashboard() {
  const [dados, setDados] = useState(null)
  const notify = useToast()

  const carregar = useCallback(() => {
    api.get('/dashboard').then(({ data }) => setDados(data)).catch((e) => notify(erroMsg(e), 'error'))
  }, [notify])

  useEffect(carregar, [carregar])

  const remover = async (item) => {
    if (!window.confirm(`Remover ${item.quantidade}x ${item.produto} da venda #${item.vendaId}? O estoque será devolvido.`)) return
    try {
      await api.delete(`/vendas/itens/${item.id}`)
      notify(`${item.produto} removido da venda #${item.vendaId}`)
      carregar()
    } catch (e) {
      notify(erroMsg(e), 'error')
    }
  }

  if (!dados) return <p className="text-ink-muted">Carregando...</p>

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <Kpi icone={Sun} rotulo="Faturamento do Dia" valor={moeda(dados.faturamentoDia)} detalhe={`${dados.vendasDia} venda(s)`} />
        <Kpi icone={CalendarDays} rotulo="Faturamento do Mês" valor={moeda(dados.faturamentoMes)} detalhe={`${dados.vendasMes} venda(s)`} />
        <Kpi icone={TrendingUp} rotulo="Lucro Bruto Estimado (Mês)" valor={moeda(dados.lucroBrutoMes)} detalhe="Receita líquida − custo dos produtos" destaque />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Ranking titulo="Fragrâncias Mais Vendidas" itens={dados.topFragrancias} />
        <Vendidos itens={dados.vendidos} onRemover={remover} />
      </div>
    </div>
  )
}

function Kpi({ icone: Icone, rotulo, valor, detalhe, destaque }) {
  return (
    <div className={`card p-6 ${destaque ? 'border-gold/50' : ''}`}>
      <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-muted">
        <Icone className="h-4 w-4 text-gold" /> {rotulo}
      </p>
      <p className={`mt-3 font-serif text-4xl font-semibold ${destaque ? 'text-gold' : ''}`}>{valor}</p>
      <p className="mt-1 text-sm text-ink-muted">{detalhe}</p>
    </div>
  )
}

function Ranking({ titulo, itens }) {
  const max = Math.max(1, ...itens.map((i) => i.quantidade))
  return (
    <div className="card p-6">
      <h2 className="mb-4 font-serif text-xl text-gold">{titulo} <span className="text-sm text-ink-muted">(mês)</span></h2>
      {itens.length === 0 ? (
        <p className="py-6 text-center text-ink-muted">Sem vendas no período.</p>
      ) : (
        <ol className="space-y-4">
          {itens.map((item, i) => (
            <li key={item.nome}>
              <div className="mb-1 flex justify-between text-sm">
                <span><span className="mr-2 text-gold">{i + 1}.</span>{item.nome}</span>
                <span className="text-ink-muted">{item.quantidade} un. · {moeda(item.faturamento)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-night">
                <div className="h-1.5 rounded-full bg-gold" style={{ width: `${(item.quantidade / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

const dataHora = (iso) => new Date(iso.replace(' ', 'T')).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

function Vendidos({ itens, onRemover }) {
  return (
    <div className="card p-6">
      <h2 className="mb-4 font-serif text-xl text-gold">Perfumes Vendidos <span className="text-sm text-ink-muted">(mês)</span></h2>
      {itens.length === 0 ? (
        <p className="py-6 text-center text-ink-muted">Sem vendas no período.</p>
      ) : (
        <ul className="max-h-96 divide-y divide-line overflow-y-auto">
          {itens.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div className="min-w-0">
                <p className="truncate">{item.quantidade}x {item.produto}</p>
                <p className="text-xs text-ink-muted">Venda #{item.vendaId} · {dataHora(item.dataVenda)} · {item.formaPagamento}</p>
              </div>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-ink-muted">{moeda(item.quantidade * item.precoUnitario)}</span>
                <button className="p-1 text-ink-muted hover:text-danger" onClick={() => onRemover(item)} aria-label={`Remover ${item.produto}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
