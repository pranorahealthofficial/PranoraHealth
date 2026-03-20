'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Health Hub' },
  { href: '/products', label: 'Products' },
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin } = useAuth()
  const { cartCount } = useCart()

  return (
    <nav className="bg-[#FDF8F0] border-b border-[#e8ddd0] sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#1B4D2E] rounded-xl flex items-center justify-center text-lg flex-shrink-0">🌿</div>
          <div>
            <div className="font-serif text-xl font-bold text-[#1B4D2E] leading-none">Pranora Health</div>
            <div className="text-[10px] text-[#C9A84C] font-bold tracking-widest">NATURAL WELLNESS</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === l.href ? 'bg-[#e8f2eb] text-[#1B4D2E] font-bold' : 'text-gray-600 hover:bg-[#e8f2eb] hover:text-[#1B4D2E]'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative p-2 text-2xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#C9A84C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link href={isAdmin ? '/admin' : '/dashboard'} className="btn-primary text-sm py-2 px-4">
              {isAdmin ? '⚙️ Admin' : '👤 Dashboard'}
            </Link>
          ) : (
            <Link href="/auth/login" className="btn-primary text-sm py-2 px-4">Login</Link>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-xl">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#FDF8F0] border-t border-[#e8ddd0] px-4 pb-4">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block py-3 text-[15px] font-medium text-gray-700 border-b border-[#f0e8d8] last:border-0">
              {l.label}
            </Link>
          ))}
          {!user && (
            <div className="mt-3 flex gap-2">
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 text-center py-2">Login</Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="btn-outline text-sm flex-1 text-center py-2">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}