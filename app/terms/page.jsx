export default function TermsPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#1B4D2E] to-[#2a6b41] py-20 px-5 text-center">
        <h1 className="font-serif text-5xl font-bold text-white mb-3">Terms of Service</h1>
        <p className="text-white/70 max-w-lg mx-auto">The rules for using the Pranora Health website</p>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-14">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
          <p className="font-bold text-amber-800 mb-1">DRAFT — not yet in force</p>
          <p className="text-sm text-amber-800 leading-relaxed">This page is a draft written from how the website works today. It has not been reviewed or approved by the owner yet. Items marked [TO CONFIRM] must be decided before this page goes live. Legal review is recommended before publication.</p>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">Effective date: [TO CONFIRM]. By using the Pranora Health website (pranora-health-quv2.vercel.app) you agree to these terms. The website is run by [TO CONFIRM: legal/business name and contact details].</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">1. What this website is</h2>
        <p className="text-gray-600 leading-relaxed mb-8">Pranora Health publishes articles about Ayurveda and natural wellness, and sells natural wellness products through this website.</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">2. Health information — please read</h2>
        <p className="text-gray-600 leading-relaxed mb-8">Articles and product descriptions share general, traditional wellness information. They are not medical advice, diagnosis or treatment, and they do not replace advice from a qualified doctor. If you are pregnant, breastfeeding, taking medicine, or living with a health condition, talk to a doctor before using any herb or product described here. If a product causes discomfort, stop using it and seek medical advice.</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">3. Accounts</h2>
        <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-8 space-y-2">
          <li>Give accurate details when you register and keep them up to date.</li>
          <li>Keep your password private. You are responsible for activity on your account.</li>
          <li>We may block or close accounts used for spam, false orders or abuse of the website.</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">4. Orders and pricing</h2>
        <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-8 space-y-2">
          <li>Prices shown on the website are in Indian Rupees. Prices are checked on our server when you place an order.</li>
          <li>Delivery is free for orders of ₹499 or more; otherwise a ₹60 delivery charge applies. [TO CONFIRM: confirm this delivery rule before going live.]</li>
          <li>New orders start with the status &quot;pending&quot; until we confirm them.</li>
          <li>There is no online payment on this website. Payment is made on delivery or as arranged with us [TO CONFIRM: confirm the payment methods offered]. We never ask for card or bank details on this website.</li>
        </ul>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">5. Delivery and returns</h2>
        <p className="text-gray-600 leading-relaxed mb-8">[TO CONFIRM: delivery areas, expected delivery time, and the returns/refund policy.]</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">6. Acceptable use</h2>
        <p className="text-gray-600 leading-relaxed mb-8">Do not misuse the website: no spam, no false orders, no attempts to access other people&apos;s accounts or orders, and no copying of the website&apos;s content for resale without permission.</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">7. Our content</h2>
        <p className="text-gray-600 leading-relaxed mb-8">Articles, images, product descriptions and the Pranora Health name and logo belong to Pranora Health. You may read and share links to them, but you may not copy or reuse them commercially without written permission.</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">8. Liability</h2>
        <p className="text-gray-600 leading-relaxed mb-8">[TO CONFIRM: liability limits to be reviewed professionally before publication. This section is intentionally left open in the draft.]</p>

        <h2 className="font-serif text-2xl font-bold text-[#1B4D2E] mb-3">9. Changes and governing law</h2>
        <p className="text-gray-600 leading-relaxed">These terms may change; the current version will always be on this page. [TO CONFIRM: governing law and courts.] Questions about these terms: [TO CONFIRM: contact email].</p>
      </div>
    </div>
  )
}
