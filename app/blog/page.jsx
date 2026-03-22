'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ArticleCard from '@/components/ArticleCard'

const CATEGORIES = ['All', 'Gut Health', 'Ayurveda', 'Immunity', 'Skin and Hair Care', 'Daily Health Habits', 'Natural Remedies']

export default function BlogPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
  }, [searchParams])

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      let query = supabase.from('articles').select('*').eq('is_published', true).order('created_at', { ascending: false })
      if (category !== 'All') query = query.eq('category', category)
      if (search) query = query.ilike('title', `%${search}%`)
      const { data } = await query
      setArticles(data || [])
      setLoading(false)
    }
    fetchArticles()
  }, [category, search])

  return (
    <div>
      <div className="bg-gradient-to-br from-[#1B4D2E] to-[#2a6b41] py-16 px-5 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Health Knowledge Hub</h1>
        <p className="text-white/70 mb-6">Practical Ayurvedic wisdom for everyday health</p>
        <div className="max-w-md mx-auto">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search health topics..." className="input-field" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${category === c ? 'bg-[#1B4D2E] text-white border-[#1B4D2E]' : 'bg-white text-gray-600 border-[#e8ddd0] hover:border-[#1B4D2E]'}`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 skeleton rounded-2xl" />)}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🌿</div>
            <p className="text-lg">No articles found</p>
          </div>
        )}
      </div>
    </div>
  )
}