'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const discount = Math.round((1 - product.price / product.original_price) * 100)
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating))

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-44 flex items-center justify-center text-6xl" style={{ background: product.color }}>
          {product.icon}
          {discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">-{discount}%</span>}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <span className="badge-green mb-2 inline-block">{product.category}</span>
          <h3 className="font-serif text-lg font-bold text-[#1B4D2E] leading-snug mb-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.tagline}</p>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[#C9A84C] text-sm">{stars}</span>
            <span className="text-xs text-gray-500">{product.rating} ({product.review_count})</span>
          </div>
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-extrabold text-[#1B4D2E]">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="text-xs text-gray-400 line-through ml-2">₹{product.original_price.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={() => addToCart(product)} className="btn-primary text-xs py-2 px-4">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}