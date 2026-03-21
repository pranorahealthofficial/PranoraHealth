import NewsletterForm from '@/components/NewsletterForm'

export default function CommunityPage() {
  const tips = [
    { icon:'☀️', tip:'Drink 2 glasses of warm water before anything else every morning to kickstart digestion.' },
    { icon:'🧘', tip:'Practice 10 minutes of pranayama daily to boost lung health and reduce stress naturally.' },
    { icon:'🫚', tip:'Add a teaspoon of ghee to your meals — it contains butyrate that heals the gut lining.' },
    { icon:'🌙', tip:'Drink turmeric milk (golden milk) before bed for better sleep and anti-inflammatory benefits.' },
    { icon:'🚶', tip:'A 10-minute walk after meals significantly improves blood sugar regulation and digestion.' },
    { icon:'🌿', tip:'Chew 5-6 fresh tulsi leaves every morning — powerful immunity booster and natural adaptogen.' },
  ]

  const videos = [
    { title:'5 Morning Habits for Perfect Gut Health', views:'12K views' },
    { title:'Triphala Benefits Explained Simply', views:'8.5K views' },
    { title:'Ayurvedic Hair Oil – Easy Home Recipe', views:'15K views' },
  ]

  return (
    <div>
      <div className="bg-gradient-to-br from-[#1B4D2E] to-[#2a6b41] py-20 px-5 text-center">
        <h1 className="font-serif text-5xl font-bold text-white mb-3">Join Our Community</h1>
        <p className="text-white/70">Connect with thousands of health-conscious Indians on their wellness journey</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-14">
        <h2 className="font-serif text-3xl font-bold text-[#1B4D2E] text-center mb-8">Latest YouTube Videos</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {videos.map(v => (
            <div key={v.title} className="bg-white rounded-2xl overflow-hidden shadow-md">
              <div className="aspect-video bg-gradient-to-br from-[#1B4D2E] to-[#2a6b41] flex items-center justify-center cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl text-white">▶</div>
              </div>
              <div className="p-4">
                <div className="font-bold text-[#1B4D2E] text-sm mb-1">{v.title}</div>
                <div className="text-xs text-gray-400">{v.views} · Pranora Health</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href="https://youtube.com/@pranorahealthofficial" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-all text-sm">
            ▶ Subscribe on YouTube
          </a>
        </div>
      </div>

      <div className="bg-[#FDF8F0] border-t border-[#e8ddd0] py-14 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#1B4D2E] text-center mb-8">Daily Ayurvedic Tips</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tips.map(t => (
              <div key={t.tip} className="bg-white rounded-2xl p-5 flex gap-3 items-start shadow-sm">
                <span className="text-2xl flex-shrink-0">{t.icon}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-14 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-3">📬</div>
          <h2 className="font-serif text-3xl font-bold text-[#1B4D2E] mb-2">Get Weekly Health Tips</h2>
          <p className="text-gray-500 mb-6">Join 10,000+ Indians receiving practical Ayurvedic wellness tips every week.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="bg-[#1B4D2E] py-14 px-5 text-center">
        <h3 className="font-serif text-2xl font-bold text-white mb-6">Follow Us Everywhere</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          {[['📺','YouTube','@pranorahealthofficial'],['📸','Instagram','@pranorahealth'],['👍','Facebook','Pranora Health']].map(([icon,name,handle]) => (
            <div key={name} className="bg-white/10 rounded-2xl p-5 min-w-[140px]">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-[#C9A84C] font-bold">{name}</div>
              <div className="text-white/60 text-sm">{handle}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}