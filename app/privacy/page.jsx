export default function PrivacyPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#1B4D2E] to-[#2a6b41] py-20 px-5 text-center">
        <h1 className="font-serif text-5xl font-bold text-white mb-3">Privacy Policy</h1>
        <p className="text-white/70 max-w-lg mx-auto">How Pranora Health collects, uses and protects your information</p>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-14">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
          <p className="font-bold text-amber-800 mb-1">DRAFT — not yet in force</p>
          <p className="text-sm text-amber-800 leading-relaxed">This page is a draft written from what the website actually does today. It has not been reviewed or approved by the owner yet. Items marked [TO CONFIRM] must be decided before this page goes live. This draft does not claim compliance with any law.</p>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">Effective date: [TO CONFIRM]. This policy describes the personal information collected by the Pranora Health website (pranora-health-quv2.vercel.app) and how it is used.</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">1. Who we are</h2>
        <p className="text-gray-600 leading-relaxed mb-8">Pranora Health is run by [TO CONFIRM: legal/business name, postal address and contact email]. For any privacy question or request, contact us at [TO CONFIRM: privacy contact email].</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">2. Information we collect</h2>
        <p className="text-gray-600 leading-relaxed mb-3">We collect only what the website&apos;s forms ask for:</p>
        <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-8 space-y-2">
          <li><strong>Account:</strong> your name, phone number and email address when you register or update your profile.</li>
          <li><strong>Orders:</strong> the delivery details you enter at checkout (name, address, pincode and phone), the items you order and their quantities, and the payment method you choose.</li>
          <li><strong>Newsletter:</strong> your email address when you subscribe.</li>
          <li><strong>Contact messages:</strong> your name, email address, subject and message when you write to us.</li>
          <li><strong>Saved items:</strong> articles you save and products you add to your wishlist, linked to your account.</li>
          <li><strong>Technical:</strong> a login session cookie that keeps you signed in, and your shopping cart saved in your own browser. The website does not use advertising or analytics trackers.</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">3. How we use your information</h2>
        <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-8 space-y-2">
          <li>To create and manage your account and let you sign in.</li>
          <li>To process, pack and deliver your orders and to contact you about them.</li>
          <li>To reply to your messages.</li>
          <li>To send the newsletter only if you subscribed. You can unsubscribe at any time by contacting us [TO CONFIRM: unsubscribe method].</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">4. Who else handles your information</h2>
        <p className="text-gray-600 leading-relaxed mb-3">Your information is stored and processed by the services that run this website:</p>
        <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-8 space-y-2">
          <li><strong>Supabase</strong> — database and login service (data hosted in Mumbai, India). Passwords are handled by Supabase&apos;s login service; they are not stored in readable form in the website&apos;s own tables.</li>
          <li><strong>Vercel</strong> — website hosting.</li>
          <li><strong>Cloudflare Turnstile</strong> — bot check on the login, newsletter and contact forms. Only the check token is sent to Cloudflare for verification; your name, email and message are not sent to Cloudflare.</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mb-8">We do not sell your personal information. [TO CONFIRM: confirm no other sharing, e.g. delivery partners, applies before going live.]</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">5. How long we keep it</h2>
        <p className="text-gray-600 leading-relaxed mb-8">[TO CONFIRM: how long accounts, orders, newsletter subscriptions and contact messages are kept, and when they are deleted.]</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">6. Your choices</h2>
        <p className="text-gray-600 leading-relaxed mb-8">You can ask us to see, correct or delete your account information, or to stop newsletter emails, by contacting us at [TO CONFIRM: privacy contact email]. Requests are handled by [TO CONFIRM: who handles requests and within how many days].</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">7. Children</h2>
        <p className="text-gray-600 leading-relaxed mb-8">[TO CONFIRM: minimum age for accounts and how children&apos;s information is handled.]</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">8. Changes to this policy</h2>
        <p className="text-gray-600 leading-relaxed">If this policy changes, the new version will be posted on this page with a new effective date. [TO CONFIRM: whether users are notified of changes, and how.]</p>
      </div>
    </div>
  )
}
