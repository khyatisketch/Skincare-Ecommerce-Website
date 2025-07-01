'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FeaturedProducts from '../components/FeaturedProducts'
import WhyChooseUs from '@/components/WhyChooseUs'
import InstagramGallery from '../components/InstagramGallery'

export default function HomeHero() {
  return (
    <>
    <section className="relative bg-[#fef7f8] min-h-[90vh] flex items-center font-sans">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 py-12">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-[#2f2f2f] leading-tight font-serif">
            Your Skin, But Better.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-md leading-relaxed">
            Clean, gentle skincare designed to hydrate, nourish, and glow with every drop.
          </p>
          <Link
            href="/products"
            className="inline-block mt-8 bg-black text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-md"
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
          <div className="rounded-3xl shadow-xl overflow-hidden bg-[#fef7f8] p-4">
            <Image
              src="/hero_skincare.jpg"
              alt="Skincare Product"
              width={480}
              height={480}
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
        <FeaturedProducts />
      <WhyChooseUs/>
      <InstagramGallery/>
        </>
  )
}
