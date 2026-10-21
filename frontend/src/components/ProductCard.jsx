import { AlertTriangle, Droplets, ShoppingCart } from 'lucide-react'
import { moeda } from '../api'
import { useCarrinho } from './Carrinho'
import { useToast } from './Toast'

export default function ProductCard({ produto }) {
  const baixo = produto.estoqueBaixo
  const { adicionar } = useCarrinho()
  const notify = useToast()

  const colocarNoCarrinho = () => {
    if (adicionar(produto)) notify(`${produto.nome} adicionado ao carrinho`)
  }

  return (
    <article className={`card flex flex-col p-5 transition-colors hover:border-gold/60 ${baixo ? 'border-alert/70' : ''}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {produto.marca && <p className="text-xs uppercase tracking-widest text-ink-muted">{produto.marca}</p>}
          <h3 className="font-serif text-2xl font-semibold leading-tight">{produto.nome}</h3>
        </div>
        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs text-gold">{produto.familiaOlfativa}</span>
      </div>

      <div className="mt-auto flex items-end justify-between">
        <div>
          <p className="flex items-center gap-1 text-xs text-ink-muted">
            <Droplets className="h-3.5 w-3.5" /> {produto.volumetria}
          </p>
          <p className="text-xl font-semibold text-gold">{moeda(produto.precoVenda)}</p>
        </div>
        <p className={`flex items-center gap-1 text-sm ${baixo ? 'font-semibold text-alert' : 'text-ink-muted'}`}>
          {baixo && <AlertTriangle className="h-4 w-4" />}
          {produto.quantidadeEstoque} em estoque
        </p>
      </div>

      <button className="btn-gold mt-4 w-full" onClick={colocarNoCarrinho} disabled={produto.quantidadeEstoque === 0}>
        <ShoppingCart className="h-4 w-4" />
        Adicionar ao carrinho
      </button>
    </article>
  )
}
