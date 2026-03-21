'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function OrderConfirmPage() {
  const [order, setOrder] = useState(null)
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      supabase.from('orders').select('*, order_items(*)').eq('id', id).single()
        .then(({ data }) => setOrder(data))
    }
  }, [searchParams])

  return (
    <div className="max-w-lg mx-auto px-5 py-20 text-center">
      <div className="text-7xl mb-4">🎉</div>
      <h1 className="font-serif text-4xl font-bold text-[#1B4D2E] mb-3">Order Placed!</h1>
      <p className="text-gray-500 mb-8">Thank you for choosing Pranora Health. Your order will be delivered within 5-7 business days.</p>

      {order && (
        <div className="bg-[#e8f2eb] rounded-2xl p-6 mb-8 text-left">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-[#1B4D2E]">Order #{order.id.slice(-8).toUpperCase()}</span>
            <span className="badge-green">Confirmed ✓</span>
          </div>
          {order.order_items?.map(i => (
            <div key={i.id} className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{i.product_icon} {i.product_name} ×{i.quantity}</span>
              <span>₹{i.subtotal.toLocaleString('en-IN')}</span>
            </div>
          ))}
          <hr className="border-dashed border-green-300 my-3" />
          <div className="flex justify-between font-bold text-[#1B4D2E]">
            <span>Total Paid</span>
            <span>₹{order.total.toLocaleString('en-IN')}</span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            📍 {order.address}, {order.city}, {order.state} - {order.pincode}
          </div>
          <div className="text-xs text-gray-500">
            💳 Payment: {order.payment_method.toUpperCase()}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/dashboard" className="btn-primary">Track My Orders</Link>
        <Link href="/products" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  )
}