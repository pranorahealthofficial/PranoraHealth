import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5 py-16">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="font-serif text-4xl font-bold text-[#1B4D2E] mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">Sorry, the page you are looking for does not exist or has moved.</p>
        <Link href="/" className="btn-gold">Back to Home</Link>
      </div>
    </div>
  )
}
