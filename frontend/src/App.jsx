import { useState } from 'react'
import { BarChart3, CloudUpload, Gem, Loader2, Package, ShoppingCart } from 'lucide-react'
import api, { erroMsg } from './api'
import { ToastProvider, useToast } from './components/Toast'
import { CarrinhoProvider } from './components/Carrinho'
import Vitrine from './pages/Vitrine'
import Estoque from './pages/Estoque'
import PDV from './pages/PDV'
import Dashboard from './pages/Dashboard'

const paginas = [
  { id: 'vitrine', rotulo: 'Vitrine', icone: Gem, Componente: Vitrine },
  { id: 'estoque', rotulo: 'Estoque', icone: Package, Componente: Estoque },
  { id: 'pdv', rotulo: 'PDV', icone: ShoppingCart, Componente: PDV },
  { id: 'dashboard', rotulo: 'Dashboard', icone: BarChart3, Componente: Dashboard }
]

function BackupButton() {
  const [rodando, setRodando] = useState(false)
  const notify = useToast()

  const executar = async () => {
    setRodando(true)
    try {
      const { data } = await api.post('/backup')
      notify(`Backup concluído: ${data.arquivo.split(/[\\/]/).pop()}`)
    } catch (e) {
      notify(erroMsg(e), 'error')
    } finally {
      setRodando(false)
    }
  }

  return (
    <button className="btn-gold" onClick={executar} disabled={rodando}>
      {rodando ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
      Backup Agora
    </button>
  )
}

function Shell() {
  const [atual, setAtual] = useState('vitrine')
  const { Componente, rotulo } = paginas.find((p) => p.id === atual)

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-line bg-surface">
        <div className="border-b border-line px-6 py-6">
          <p className="font-serif text-3xl font-bold tracking-wide text-gold">SL</p>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Perfumaria</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {paginas.map(({ id, rotulo: r, icone: Icone }) => (
            <button
              key={id}
              onClick={() => setAtual(id)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors ${
                atual === id ? 'bg-gold/10 text-gold' : 'text-ink-muted hover:bg-night hover:text-ink'
              }`}
              aria-current={atual === id ? 'page' : undefined}
            >
              <Icone className="h-5 w-5" />
              {r}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line px-8 py-4">
          <h1 className="font-serif text-3xl font-semibold text-gold">{rotulo}</h1>
          <BackupButton />
        </header>
        <main className="flex-1 p-8">
          <Componente />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <CarrinhoProvider>
        <Shell />
      </CarrinhoProvider>
    </ToastProvider>
  )
}
