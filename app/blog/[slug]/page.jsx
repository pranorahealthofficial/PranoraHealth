import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import SaveArticleBtn from '@/components/SaveArticleBtn'

export default async function ArticlePage({ params }) {
  const supabase = createServerSupabaseClient()
  const { data: article } = await supabase.from('articles').select('*').eq('slug', params.slug).single()
  if (!article) notFound()

  const { data: related } = await supabase.from('articles').select('*').eq('category', article.category).neq('id', article.id).limit(3)

  const contentHtml = (article.content || '').split('\n\n').map(p => {
    if (p.startsWith('## ')) return `<h2 style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#1B4D2E;margin:28px 0 12px">${p.replace('## ','')}</h2>`
    return `<p style="font-size:16px;line-height:1.9;color:#444;margin-bottom:16px">${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g,'<br>')}</p>`
  }).join('')

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Link href="/blog" className="text-[#1B4D2E] font-semibold text-sm hover:underline">← Back to Articles</Link>

      <div className="h-52 rounded-2xl flex items-center justify-center text-8xl my-6" style={{ background: article.color }}>{article.icon}</div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <span className="badge-green">{article.category}</span>
        <span className="text-sm text-gray-400">⏱ {article.read_time}</span>
        <span className="text-sm text-gray-400">📅 {new Date(article.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
      </div>

      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1B4D2E] leading-tight mb-4">{article.title}</h1>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <span className="text-sm text-gray-500">By {article.author}</span>
        <SaveArticleBtn articleId={article.id} />
      </div>

      <p className="text-lg text-gray-600 italic leading-relaxed mb-6 border-l-4 border-[#C9A84C] pl-4">{article.excerpt}</p>

      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

      <div className="flex gap-2 flex-wrap mt-6">
        {(article.tags || []).map(t => <span key={t} className="badge-green">#{t}</span>)}
      </div>

      <div className="mt-10 bg-gradient-to-r from-[#1B4D2E] to-[#2a6b41] rounded-2xl p-7 text-white">
        <h3 className="font-serif text-2xl font-bold mb-2">Looking for Natural Products?</h3>
        <p className="text-white/70 text-sm mb-4">Explore our Ayurvedic wellness products related to what you just read.</p>
        <Link href="/products" className="btn-gold text-sm">Explore Products →</Link>
      </div>

      {related && related.length > 0 && (
        <div className="mt-10">
          <h3 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-5">Related Articles</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 transition-all">
                <div className="h-28 flex items-center justify-center text-4xl" style={{ background: r.color }}>{r.icon}</div>
                <div className="p-4">
                  <span className="badge-green text-xs mb-1 inline-block">{r.category}</span>
                  <p className="font-serif font-bold text-[#1B4D2E] text-sm line-clamp-2">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}