'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState('cod')
  const [form, setForm] = useState({
    name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: '', city: '', state: '', pincode: ''
  })
  const delivery = cartTotal >= 499 ? 0 : 60
  const total = cartTotal + delivery

  function setField(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function placeOrder() {
    const { name, phone, address, city, state, pincode } = form
    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error('Please fill all address fields'); return
    }
    if (pincode.length !== 6) { toast.error('Enter valid 6-digit PIN code'); return }
    if (cart.length === 0) { toast.error('Your cart is empty'); return }

    setLoading(true)
    const { data: order, error } = await supabase.from('orders').insert({
      user_id: user.id, user_name: name, user_email: user.email,
      phone, address, city, state, pincode,
      payment_method: payment, order_status: 'confirmed',
      subtotal: cartTotal, delivery_charge: delivery, total
    }).select().single()

    if (error) { toast.error('Order failed. Please try again.'); setLoading(false); return }

    const items = cart.map(i => ({
      order_id: order.id, product_id: i.id,
      product_name: i.name, product_icon: i.icon,
      price: i.price, quantity: i.qty, subtotal: i.price * i.qty
    }))
    await supabase.from('order_items').insert(items)
    clearCart()
    setLoading(false)
    router.push(`/order-confirm?id=${order.id}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="font-serif text-4xl font-bold text-[#1B4D2E] mb-8">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-5">📍 Delivery Address</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Full Name*</label><input className="input-field" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Rahul Sharma" /></div>
              <div><label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Phone*</label><input className="input-field" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="9876543210" /></div>
            </div>
            <div className="mt-4"><label className="text-sm font-semibold text-[#1B4D2E] block mb-1">Address*</label><input className="input-field" value={form.address} onChange={e => setField('address', e.target.value)} placeholder="House No., Street, Area" /></div>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div><label className="text-sm font-semibold text-[#1B4D2E] block mb-1">City*</label><input className="input-field" value={form.city} onChange={e => setField('city', e.target.value)} placeholder="New Delhi" /></div>
              <div><label className="text-sm font-semibold text-[#1B4D2E] block mb-1">State*</label><input className="input-field" value={form.state} onChange={e => setField('state', e.target.value)} placeholder="Delhi" /></div>
              <div><label className="text-sm font-semibold text-[#1B4D2E] block mb-1">PIN Code*</label><input className="input-field" value={form.pincode} onChange={e => setField('pincode', e.target.value)} placeholder="110001" maxLength={6} /></div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-5">💳 Payment Method</h3>
            {[['cod','💵 Cash on Delivery','Pay when your order arrives'],['whatsapp','💬 WhatsApp Order','We will confirm via WhatsApp'],['upi','📱 UPI Payment','PhonePe, GPay, Paytm']].map(([v,l,s]) => (
              <label key={v} onClick={() => setPayment(v)}
                className={`flex items-center gap-3 p-4 rounded-xl mb-3 cursor-pointer border-2 transition-all ${payment === v ? 'border-[#1B4D2E] bg-[#e8f2eb]' : 'border-[#e8ddd0]'}`}>
                <input type="radio" name="payment" value={v} checked={payment === v} readOnly className="accent-[#1B4D2E]" />
                <div><div className="font-semibold text-sm">{l}</div><div className="text-xs text-gray-500">{s}</div></div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md h-fit sticky top-20">
          <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-4">Order Summary</h3>
          {cart.map(i => (
            <div key={i.id} className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: i.color }}>{i.icon}</div>
              <div className="flex-1 text-xs"><div className="font-semibold text-[#1B4D2E]">{i.name}</div><div className="text-gray-400">×{i.qty}</div></div>
              <span className="text-sm font-semibold">₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <hr className="border-dashed border-gray-200 my-3" />
          <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-sm mb-2">
            <span>Delivery</span>
            <span className={delivery === 0 ? 'text-green-600 font-bold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
          </div>
          <div className="flex justify-between font-extrabold text-[#1B4D2E] text-lg border-t-2 border-[#1B4D2E] pt-3 mt-2 mb-5">
            <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={placeOrder} disabled={loading} className="btn-primary w-full text-base py-3">
            {loading ? 'Placing Order...' : 'Place Order ✓'}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · 30-Day Returns</p>
        </div>
      </div>
    </div>
  )
}