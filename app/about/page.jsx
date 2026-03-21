import Link from 'next/link'

export default function AboutPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#1B4D2E] to-[#2a6b41] py-20 px-5 text-center">
        <h1 className="font-serif text-5xl font-bold text-white mb-3">About Pranora Health</h1>
        <p className="text-white/70 max-w-lg mx-auto">Helping people improve health through simple natural habits and Ayurvedic wisdom</p>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-14">
        <div className="text-center mb-14">
          <div className="text-6xl mb-5">🌿</div>
          <h2 className="font-serif text-3xl font-bold text-[#1B4D2E] mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">Pranora Health was born from a personal journey — years of struggling with modern health problems and finding lasting answers not in medications, but in the ancient Ayurvedic wisdom that our grandparents lived by.</p>
          <p className="text-gray-600 leading-relaxed">We noticed this knowledge was fading, replaced by complex diets and expensive supplements most Indians could not afford or sustain. So we built Pranora Health — a platform that makes Ayurvedic knowledge accessible, practical, and actionable for every Indian household.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#FDF8F0] rounded-2xl p-7 border border-[#e8ddd0]">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">To make authentic Ayurvedic health knowledge accessible to every Indian household, and offer natural, affordable wellness products that actually work.</p>
          </div>
          <div className="bg-[#FDF8F0] rounded-2xl p-7 border border-[#e8ddd0]">
            <div className="text-3xl mb-3">👁</div>
            <h3 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-2">Our Vision</h3>
            <p className="text-sm text-gray-600 leading-relaxed">A healthier India where people trust natural wisdom over quick fixes — where the kitchen is the first pharmacy and nature is the best doctor.</p>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] text-center mb-6">Our Values</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {[['🌱','100% Natural','No artificial additives, ever'],['🔬','Science-Backed','Traditional wisdom + modern research'],['💰','Affordable','Wellness should not be expensive'],['❤️','Community First','We grow with our community'],['🛡️','Quality Assured','Third-party tested ingredients'],['🇮🇳','Made in India','Supporting Indian agriculture']].map(([icon,t,d]) => (
            <div key={t} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-bold text-[#1B4D2E] text-sm mb-1">{t}</div>
              <div className="text-xs text-gray-500">{d}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#1B4D2E] to-[#2a6b41] rounded-2xl p-8 text-center text-white">
          <div className="text-5xl mb-4">🧑‍⚕️</div>
          <h3 className="font-serif text-2xl font-bold mb-2">Nishant Kewat</h3>
          <p className="text-white/70 text-sm mb-5">Founder, Pranora Health · @pranorahealth</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/blog" className="btn-gold text-sm">Read Health Guides</Link>
            <Link href="/products" className="btn-outline-white text-sm">Shop Products</Link>
          </div>
        </div>
      </div>
    </div>
  )
}