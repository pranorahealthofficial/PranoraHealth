import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1B4D2E] text-[#e8f2eb] mt-16">
      <div className="max-w-6xl mx-auto px-5 pt-12 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-[#C9A84C] rounded-lg flex items-center justify-center text-base">🌿</div>
              <span className="font-serif text-xl font-bold text-white">Pranora Health</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-[220px]">Natural wellness inspired by Ayurveda & modern health science.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="https://youtube.com/@pranorahealthofficial" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-[#C9A84C] bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-all">YouTube</a>
              <span className="text-[11px] font-bold text-[#C9A84C] bg-white/10 px-3 py-1 rounded-full">Instagram</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#C9A84C] tracking-widest mb-3">QUICK LINKS</div>
            {[['/', 'Home'],['/blog', 'Health Hub'],['/products', 'Products'],['/community', 'Community'],['/about', 'About'],['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} className="block text-sm text-white/60 py-1 hover:text-[#C9A84C] transition-colors">{label}</Link>
            ))}
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#C9A84C] tracking-widest mb-3">HEALTH TOPICS</div>
            {['Gut Health','Digestion','Immunity','Skin Health','Hair Health','Daily Habits'].map(t => (
              <Link key={t} href={`/blog?category=${encodeURIComponent(t)}`} className="block text-sm text-white/60 py-1 hover:text-[#C9A84C] transition-colors">{t}</Link>
            ))}
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#C9A84C] tracking-widest mb-3">CONTACT</div>
            <div className="space-y-2 text-sm text-white/60">
              <a href="mailto:pranorahealthofficial@gmail.com" className="flex items-center gap-2 hover:text-[#C9A84C]">📧 pranorahealthofficial@gmail.com</a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#C9A84C]">💬 WhatsApp Order</a>
              <a href="https://youtube.com/@pranorahealthofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#C9A84C]">📺 @pranorahealthofficial</a>
            </div>
            <div className="mt-3 text-[11px] text-white/40">📍 India · #pranorahealth · #prenorahealth</div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/40">
          <span>© 2025 Pranora Health. All rights reserved.</span>
          <span>Made with 🌿 for healthier lives</span>
          <span>⚠️ Not intended to diagnose or treat disease.</span>
        </div>
      </div>
    </footer>
  )
}