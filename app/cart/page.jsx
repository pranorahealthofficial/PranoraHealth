'use client'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const delivery = cartTotal >= 499 ? 0 : 60
  const total = cartTotal + delivery

  function handleCheckout() {
    if (!user) { toast.error('Please login to checkout'); router.push('/auth/login?redirect=/checkout'); return }
    router.push('/checkout')
  }

  if (cart.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="font-serif text-3xl font-bold text-[#1B4D2E] mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some natural wellness products to get started</p>
      <Link href="/products" className="btn-primary">Browse Products</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="font-serif text-4xl font-bold text-[#1B4D2E] mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-md">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: item.color }}>{item.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-[#1B4D2E]">{item.name}</div>
                <div className="text-sm text-gray-500">₹{item.price.toLocaleString('en-IN')} each</div>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-full bg-white shadow text-lg font-bold flex items-center justify-center">−</button>
                <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-full bg-white shadow text-lg font-bold flex items-center justify-center">+</button>
              </div>
              <div className="font-bold text-[#1B4D2E] min-w-[70px] text-right">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md h-fit sticky top-20">
          <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-4">Order Summary</h3>
          {cart.map(i => (
            <div key={i.id} className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{i.name} ×{i.qty}</span>
              <span>₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <hr className="border-dashed border-gray-200 my-3" />
          <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-sm mb-2">
            <span>Delivery</span>
            <span className={delivery === 0 ? 'text-green-600 font-bold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
          </div>
          {delivery > 0 && <p className="text-xs text-gray-400 mb-2">Add ₹{499 - cartTotal} more for free delivery</p>}
          <div className="flex justify-between font-extrabold text-[#1B4D2E] text-lg border-t-2 border-[#1B4D2E] pt-3 mt-2 mb-5">
            <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full mb-3">Proceed to Checkout →</button>
          <Link href="/products" className="btn-outline w-full text-center block text-sm py-2">Continue Shopping</Link>
          <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure Checkout · Free Returns</p>
        </div>
      </div>
    </div>
  )
}