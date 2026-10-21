import { FAMILIAS } from '../api'

export default function FamiliaSelect({ value, onChange, todas = false, className = '' }) {
  return (
    <select className={`input ${className}`} value={value} onChange={(e) => onChange(e.target.value)} aria-label="Família olfativa">
      {todas ? <option value="">Todas as famílias</option> : <option value="" disabled>Selecione...</option>}
      {FAMILIAS.map((f) => (
        <option key={f} value={f}>{f}</option>
      ))}
    </select>
  )
}
