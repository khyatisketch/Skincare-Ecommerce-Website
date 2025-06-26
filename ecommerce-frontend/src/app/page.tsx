'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomeHero() {
  return (
    <section className="relative bg-pink-50 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Your Skin, But Better.
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-md">
            Clean, gentle skincare designed to hydrate, nourish, and glow with every drop.
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition"
          >
            Shop Now
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <Image
            src="/hero-skincare.png" // Replace this with your product image
            alt="Skincare Product"
            width={500}
            height={500}
            className="object-contain rounded-xl shadow-xl"
            priority
          />
        </motion.div>
      </div>
    </section>
  )
}
