import { createContext, useCallback, useContext, useState } from 'react'
import { useToast } from './Toast'

const CarrinhoContext = createContext(null)

export const useCarrinho = () => useContext(CarrinhoContext)

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([])
  const notify = useToast()

  const adicionar = useCallback((produto) => {
    const noCarrinho = carrinho.find((i) => i.produto.id === produto.id)?.quantidade || 0
    if (noCarrinho >= produto.quantidadeEstoque) {
      notify(`Estoque insuficiente para ${produto.nome}`, 'error')
      return false
    }
    setCarrinho((c) =>
      noCarrinho ? c.map((i) => (i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i)) : [...c, { produto, quantidade: 1 }]
    )
    return true
  }, [carrinho, notify])

  const alterar = useCallback((id, delta) =>
    setCarrinho((c) =>
      c.map((i) => (i.produto.id === id ? { ...i, quantidade: Math.min(i.produto.quantidadeEstoque, i.quantidade + delta) } : i)).filter((i) => i.quantidade > 0)
    ), [])

  const limpar = useCallback(() => setCarrinho([]), [])

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionar, alterar, limpar }}>
      {children}
    </CarrinhoContext.Provider>
  )
}
