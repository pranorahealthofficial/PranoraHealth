'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

export default function AddToCartBtn({ product }) {
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
        <button onClick={() => setQty(q => Math.max(1, q - 1))}
          className="w-8 h-8 rounded-full bg-white shadow text-xl font-bold flex items-center justify-center hover:bg-[#1B4D2E] hover:text-white transition-all">−</button>
        <span className="w-8 text-center font-bold">{qty}</span>
        <button onClick={() => setQty(q => q + 1)}
          className="w-8 h-8 rounded-full bg-white shadow text-xl font-bold flex items-center justify-center hover:bg-[#1B4D2E] hover:text-white transition-all">+</button>
      </div>
      <button onClick={() => addToCart(product, qty)} className="btn-primary flex-1">
        Add to Cart 🛒
      </button>
    </div>
  )
}