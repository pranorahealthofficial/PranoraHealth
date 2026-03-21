import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import ArticleCard from '@/components/ArticleCard'
import NewsletterForm from '@/components/NewsletterForm'

export default async function HomePage() {
  const supabase = createServerSupabaseClient()
  const [{ data: products }, { data: articles }] = await Promise.all([
    supabase.from('products').select('*').eq('is_active', true).limit(5),
    supabase.from('articles').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
  ])

  const topics = [
    { icon: '🫁', name: 'Gut Health', bg: '#e8f5e9' },
    { icon: '🔥', name: 'Digestion', bg: '#fff8e1' },
    { icon: '🛡️', name: 'Immunity', bg: '#fce4ec' },
    { icon: '✨', name: 'Skin Health', bg: '#f3e5f5' },
    { icon: '💇', name: 'Hair Health', bg: '#e3f2fd' },
    { icon: '🧘', name: 'Daily Habits', bg: '#e8f5e9' },
  ]

  return (
    <div>
      <section className="bg-gradient-to-br from-[#1B4D2E] via-[#2a6b41] to-[#1B4D2E] min-h-[580px] flex items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C9A84C]/10 -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-14 items-center relative z-10">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/30 rounded-full px-4 py-1.5 mb-5">
              <span className="text-[#C9A84C] text-xs font-bold tracking-widest">🌿 AYURVEDA + MODERN SCIENCE</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              Natural Health.<br />
              <span className="text-[#C9A84C]">Simple Habits.</span><br />
              Better Life.
            </h1>
            <p className="text-white/75 text-base leading-relaxed mb-8 max-w-md">
              Pranora Health shares practical wellness knowledge inspired by Ayurveda and modern health science. Simple habits that truly work for your body.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/blog" className="btn-gold">Explore Health Guides</Link>
              <Link href="/products" className="btn-outline-white">Discover Products</Link>
            </div>
            <div className="flex gap-7 mt-8">
              {[['10K+', 'Happy Users'], ['50+', 'Health Guides'], ['5★', 'Rated Products']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-serif text-3xl font-bold text-[#C9A84C]">{n}</div>
                  <div className="text-xs text-white/55">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {[['🌿','Ayurveda Inspired','3000+ years of wisdom'],['🏃','Daily Practice','Simple actionable habits'],['🍃','100% Natural','No artificial additives'],['❤️','Proven Results','Science-backed approach']].map(([icon, t, s]) => (
              <div key={t} className="bg-white/10 rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-white font-bold text-sm mb-1">{t}</div>
                <div className="text-white/55 text-xs">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[['🌱','Ayurveda Inspired','Ancient wisdom modernised for your daily life.'],['💪','Practical Daily Health','Simple habits you can actually stick to.'],['🍃','Natural & Simple','Pure ingredients, honest products, real results.']].map(([icon, t, d]) => (
            <div key={t} className="text-center p-8 rounded-2xl bg-[#FDF8F0] border border-[#e8ddd0]">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-2">{t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-9">
            <h2 className="section-title">Explore Health Topics</h2>
            <p className="text-gray-500 mt-2">Practical knowledge for every aspect of your wellbeing</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {topics.map(t => (
              <Link key={t.name} href={`/blog?category=${encodeURIComponent(t.name)}`}
                className="rounded-2xl p-5 text-center hover:-translate-y-1 hover:shadow-lg transition-all border-2 border-transparent hover:border-[#1B4D2E]"
                style={{ background: t.bg }}>
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="font-bold text-[13px] text-[#1B4D2E]">{t.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-3xl font-bold text-[#1B4D2E]">Latest Health Articles</h2>
            <Link href="/blog" className="btn-outline text-sm py-2">View All →</Link>
          </div>
          {articles?.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {articles.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">No articles yet. Check back soon! 🌿</p>
          )}
        </div>
      </section>

      <section className="bg-[#1B4D2E] py-14 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white">Natural Wellness Products</h2>
              <p className="text-white/60 text-sm mt-1">Ayurvedic formulas crafted with care</p>
            </div>
            <Link href="/products" className="btn-gold text-sm">Shop All →</Link>
          </div>
          {products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {products.map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} className="bg-[#FDF8F0] rounded-2xl p-4 hover:-translate-y-1 transition-all">
                  <div className="h-24 rounded-xl mb-3 flex items-center justify-center text-5xl" style={{ background: p.color }}>{p.icon}</div>
                  <div className="font-bold text-[13px] text-[#1B4D2E] mb-1 line-clamp-2">{p.name}</div>
                  <span className="font-extrabold text-[#1B4D2E] text-sm">₹{p.price.toLocaleString('en-IN')}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-center py-8">Products loading...</p>
          )}
        </div>
      </section>

      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">🧑‍⚕️</div>
          <h2 className="section-title mb-4">Our Mission</h2>
          <p className="text-base leading-relaxed text-gray-600 max-w-2xl mx-auto mb-6 italic">
            "Pranora Health was born from a simple belief — <strong>good health should be accessible to everyone</strong>. We combine 3,000 years of Ayurvedic wisdom with modern wellness science to give you practical, natural solutions that actually work in your daily life."
          </p>
          <div className="inline-block bg-[#e8f2eb] rounded-xl px-6 py-3">
            <div className="font-bold text-[#1B4D2E]">Nishant Kewat</div>
            <div className="text-sm text-gray-500">Founder, Pranora Health · @pranorahealth</div>
          </div>
        </div>
      </section>

      <section className="bg-[#FDF8F0] border-t border-[#e8ddd0] py-14 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-3">📬</div>
          <h2 className="section-title text-2xl mb-2">Get Weekly Health Tips</h2>
          <p className="text-gray-500 mb-6">Join 10,000+ Indians receiving Ayurvedic wellness tips every week.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  )
}