import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder, inputRef, onKeyDown, autoFocus }) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        className="input pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder || 'Buscar por nome, marca, código de barras ou notas...'}
        aria-label="Buscar"
      />
    </div>
  )
}
