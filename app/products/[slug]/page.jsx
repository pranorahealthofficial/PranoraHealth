import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartBtn from '@/components/AddToCartBtn'

export default async function ProductPage({ params }) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase.from('products').select('*, product_reviews(*)').eq('slug', params.slug).single()
  if (!product) notFound()

  const discount = Math.round((1 - product.price / product.original_price) * 100)
  const stars = n => '★'.repeat(Math.floor(n)) + '☆'.repeat(5 - Math.floor(n))

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <Link href="/products" className="text-[#1B4D2E] font-semibold text-sm hover:underline">← Back to Products</Link>

      <div className="grid md:grid-cols-2 gap-12 mt-8 mb-12">
        <div>
          <div className="h-80 rounded-2xl flex items-center justify-center text-9xl" style={{ background: product.color }}>{product.icon}</div>
          <div className="mt-4 bg-[#e8f2eb] rounded-xl p-4 text-xs text-[#1B4D2E] font-medium leading-relaxed">
            ⚠️ Disclaimer: This product is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use.
          </div>
        </div>

        <div>
          <span className="badge-green mb-3 inline-block">{product.category}</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1B4D2E] leading-tight mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">{product.tagline}</p>

          <div className="flex items-center gap-2 mb-5">
            <span className="text-[#C9A84C] text-lg">{stars(product.rating)}</span>
            <span className="text-sm text-gray-500">{product.rating}/5 ({product.review_count} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-extrabold text-[#1B4D2E]">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="text-lg text-gray-400 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
            {discount > 0 && <span className="badge-gold">Save {discount}%</span>}
          </div>

          <AddToCartBtn product={product} />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-[#e8f2eb] rounded-xl p-3 text-center text-sm font-semibold text-[#1B4D2E]">📦 Free Delivery<br /><span className="font-normal text-xs">Orders above ₹499</span></div>
            <div className="bg-amber-50 rounded-xl p-3 text-center text-sm font-semibold text-amber-800">🔄 30-Day Returns<br /><span className="font-normal text-xs">Hassle-free policy</span></div>
          </div>

          <div className="mt-5">
            <div className="font-bold text-[#1B4D2E] mb-2">🌿 Key Ingredients</div>
            <div className="flex flex-wrap gap-2">
              {(product.ingredients || []).map(i => (
                <span key={i} className="bg-[#e8f2eb] text-[#1B4D2E] text-xs font-bold px-3 py-1 rounded-full">{i}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card">
          <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-4">✅ Benefits</h3>
          {(product.benefits || []).map(b => (
            <div key={b} className="flex gap-2 mb-2 text-sm text-gray-600">
              <span className="text-[#C9A84C]">•</span>{b}
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-4">🔬 How It Works</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.how_it_works}</p>
        </div>
        <div className="card">
          <h3 className="font-serif text-xl font-bold text-[#1B4D2E] mb-4">📋 How to Use</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.how_to_use}</p>
        </div>
      </div>

      <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-5">Customer Reviews</h2>
      {product.product_reviews?.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {product.product_reviews.map(r => (
            <div key={r.id} className="card">
              <div className="text-[#C9A84C] mb-1">{stars(r.rating)}</div>
              <p className="text-sm text-gray-600 italic mb-2">"{r.comment}"</p>
              <div className="text-xs text-gray-400">{r.user_name}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-8">No reviews yet. Be the first to review!</p>
      )}

      <div className="bg-[#e8f2eb] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-[#1B4D2E] text-lg">Order via WhatsApp</div>
          <div className="text-sm text-gray-500">Quick order or have questions? Chat with us directly!</div>
        </div>
        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi! I want to order: ${encodeURIComponent(product.name)}`}
          target="_blank" rel="noopener noreferrer"
          className="bg-green-500 text-white font-bold px-6 py-3 rounded-full hover:bg-green-600 transition-all text-sm whitespace-nowrap">
          💬 Order on WhatsApp
        </a>
      </div>
    </div>
  )
} 