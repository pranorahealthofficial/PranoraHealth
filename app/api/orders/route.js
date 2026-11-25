import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const PAYMENT_METHODS = ['cod', 'whatsapp', 'upi']

export async function POST(request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Please log in to place an order.' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { items, name, phone, address, city, state, pincode, payment_method } = body ?? {}

  if (!PAYMENT_METHODS.includes(payment_method)) {
    return NextResponse.json({ error: 'Invalid payment method.' }, { status: 400 })
  }
  if (!name || !phone || !address || !city || !state || !pincode) {
    return NextResponse.json({ error: 'Please fill all address fields.' }, { status: 400 })
  }
  if (!/^\d{6}$/.test(String(pincode))) {
    return NextResponse.json({ error: 'Enter valid 6-digit PIN code.' }, { status: 400 })
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
  }
  for (const item of items) {
    if (!item?.product_id || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return NextResponse.json({ error: 'Invalid cart item.' }, { status: 400 })
    }
  }

  const productIds = items.map(i => i.product_id)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, icon, price, is_active')
    .in('id', productIds)

  if (productsError) {
    return NextResponse.json({ error: 'Order failed. Please try again.' }, { status: 500 })
  }

  const byId = new Map((products || []).map(p => [p.id, p]))
  let subtotal = 0
  const orderItems = []
  for (const item of items) {
    const product = byId.get(item.product_id)
    if (!product || !product.is_active) {
      return NextResponse.json({ error: 'A product in your cart is no longer available.' }, { status: 400 })
    }
    const itemSubtotal = product.price * item.quantity
    subtotal += itemSubtotal
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      product_icon: product.icon,
      price: product.price,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    })
  }

  const delivery = subtotal >= 499 ? 0 : 60
  const total = subtotal + delivery

  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id: user.id,
    user_name: name,
    user_email: user.email,
    phone,
    address,
    city,
    state,
    pincode,
    payment_method,
    order_status: 'pending',
    subtotal,
    delivery_charge: delivery,
    total,
  }).select().single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order failed. Please try again.' }, { status: 500 })
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    orderItems.map(i => ({ ...i, order_id: order.id }))
  )

  if (itemsError) {
    return NextResponse.json({ error: 'Order could not be completed. Please contact us — your order is saved as pending for review.' }, { status: 500 })
  }

  return NextResponse.json({ id: order.id })
}
