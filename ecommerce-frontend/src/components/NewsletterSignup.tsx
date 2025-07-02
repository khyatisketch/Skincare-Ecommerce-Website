'use client'
import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // For now, just fake the submission
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="py-20 bg-pink-50 px-6 md:px-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Get 10% Off Your First Order 💌</h2>
        <p className="text-gray-600 mb-6">Subscribe to our newsletter for skincare tips, early access, and exclusive offers.</p>

        {submitted ? (
          <p className="text-green-600 font-semibold">Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-3 rounded-full border border-gray-300 w-full sm:w-auto sm:flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
