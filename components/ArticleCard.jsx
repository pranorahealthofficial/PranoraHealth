import Link from 'next/link'

export default function ArticleCard({ article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-200 block group">
      <div className="h-36 flex items-center justify-center text-5xl" style={{ background: article.color }}>{article.icon}</div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="badge-green">{article.category}</span>
          <span className="text-[11px] text-gray-400">⏱ {article.read_time}</span>
        </div>
        <h3 className="font-serif text-lg font-bold text-[#1B4D2E] leading-snug mb-2 line-clamp-2 group-hover:text-[#2a6b41]">{article.title}</h3>
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
        <div className="mt-3 text-[12px] text-gray-400">
          {new Date(article.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
    </Link>
  )
}