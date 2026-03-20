'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pranora_cart')
    if (saved) { try { setCart(JSON.parse(saved)) } catch {} }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem('pranora_cart', JSON.stringify(cart))
  }, [cart, hydrated])

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
    toast.success(`${product.name} added to cart!`)
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(i => i.id !== productId))
  }

  function updateQty(productId, qty) {
    if (qty < 1) { removeFromCart(productId); return }
    setCart(prev => prev.map(i => i.id === productId ? { ...i, qty } : i))
  }

  function clearCart() { setCart([]) }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      cartTotal: cart.reduce((s, i) => s + i.price * i.qty, 0),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)