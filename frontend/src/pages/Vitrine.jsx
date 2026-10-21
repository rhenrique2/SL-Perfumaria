import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import FamiliaSelect from '../components/FamiliaSelect'
import ProductCard from '../components/ProductCard'
import useProdutos from '../components/useProdutos'

export default function Vitrine() {
  const [q, setQ] = useState('')
  const [familia, setFamilia] = useState('')
  const { produtos, carregando } = useProdutos(q, familia)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <SearchBar value={q} onChange={setQ} autoFocus />
        <FamiliaSelect value={familia} onChange={setFamilia} todas className="md:w-60" />
      </div>
      {!carregando && produtos.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">Nenhuma fragrância encontrada.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {produtos.map((p) => <ProductCard key={p.id} produto={p} />)}
        </div>
      )}
    </div>
  )
}
