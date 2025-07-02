import Link from 'next/link'

export default function CTAFooter() {
  return (
    <section className="bg-gradient-to-r from-pink-100 via-white to-pink-100 py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Join the glow-up journey ✨
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover clean skincare that delivers real results. Your skin deserves it.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
