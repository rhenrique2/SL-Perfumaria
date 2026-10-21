import { useCallback, useEffect, useState } from 'react'
import api, { erroMsg } from '../api'
import { useToast } from './Toast'

export default function useProdutos(q, familia) {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const notify = useToast()

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const { data } = await api.get('/produtos', { params: { q: q || undefined, familia: familia || undefined } })
      setProdutos(data)
    } catch (e) {
      notify(erroMsg(e), 'error')
    } finally {
      setCarregando(false)
    }
  }, [q, familia, notify])

  useEffect(() => {
    const t = setTimeout(carregar, 250)
    return () => clearTimeout(t)
  }, [carregar])

  return { produtos, carregando, recarregar: carregar }
}
