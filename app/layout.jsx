import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'Pranora Health – Natural Wellness',
  description: 'Natural health inspired by Ayurveda & modern science. Practical wellness knowledge and natural products for a better life.',
  keywords: 'ayurveda, natural health, gut health, immunity, hair care, skin health, pranora health',
  metadataBase: new URL('https://pranora-health-quv2.vercel.app'),
  openGraph: {
    title: 'Pranora Health – Natural Wellness',
    description: 'Natural health inspired by Ayurveda & modern science. Practical wellness knowledge and natural products for a better life.',
    url: 'https://pranora-health-quv2.vercel.app',
    siteName: 'Pranora Health',
    type: 'website',
    locale: 'en',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: '#1B4D2E',
                  color: '#fff',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 600,
                  borderRadius: '99px',
                  padding: '12px 24px',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}