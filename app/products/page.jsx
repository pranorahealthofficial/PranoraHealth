'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data } = await supabase.from('products').select('*').eq('is_active', true)
      setProducts(data || [])
      const cats = ['All', ...new Set((data || []).map(p => p.category))]
      setCategories(cats)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = category === 'All' ? products : products.filter(p => p.category === category)

  return (
    <div>
      <div className="bg-gradient-to-br from-[#1B4D2E] to-[#2a6b41] py-16 px-5 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Natural Wellness Products</h1>
        <p className="text-white/70">Ayurvedic formulas crafted with the finest natural ingredients</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border-2 ${category === c ? 'bg-[#1B4D2E] text-white border-[#1B4D2E]' : 'bg-white text-gray-600 border-[#e8ddd0] hover:border-[#1B4D2E]'}`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-72 skeleton rounded-2xl" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🌿</div>
            <p className="text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}