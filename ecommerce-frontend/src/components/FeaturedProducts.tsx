'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string[]
  stock: number
  createdAt: string
  rating?: number
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/getAllProducts`)
        const productList: Product[] = res.data?.result?.data?.slice(0, 9) || []
        setProducts(productList)
      } catch (err) {
        toast.error('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const fallbackImage = '/placeholder.jpg'

  const getProductLabel = (product: Product) => {
    const createdAt = new Date(product.createdAt)
    const now = new Date()
    const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

    if (diffDays <= 7) return 'new'
    if (product.stock > 50) return 'best-seller'
    if (product.stock < 10) return 'low-stock'
    return null
  }

  const badgeMap: Record<string, { text: string; className: string }> = {
    'best-seller': {
      text: '✨ Best Seller',
      className: 'bg-yellow-200 text-yellow-800',
    },
    new: {
      text: '🆕 New Arrival',
      className: 'bg-pink-200 text-pink-800',
    },
    'low-stock': {
      text: '⏳ Almost Gone',
      className: 'bg-red-200 text-red-800',
    },
  }

  return (
    <motion.section
      className="py-20 px-6 md:px-12 bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-4 tracking-tight">
          Best Sellers
        </h2>
        <p className="text-gray-500 mb-12 text-lg">
          Discover formulas our customers can&lsquo;t get enough of
        </p>

        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl border bg-pink-50 p-5 shadow-sm h-[400px]"
                >
                  <div className="bg-gray-300 h-48 w-full rounded-lg mb-4" />
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-8 bg-gray-300 rounded-full w-24 mx-auto" />
                </div>
              ))
          ) : (
            products.map((product) => {
              const label = getProductLabel(product)
              const badge = label ? badgeMap[label] : null
              const rating = product.rating ?? 4 // fallback if no rating

              return (
                <div
                  key={product.id}
                  className="group relative rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Badge */}
                  {badge && (
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${badge.className}`}>
                      {badge.text}
                    </span>
                  )}

                  {/* Heart Icon */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white p-1 rounded-full shadow hover:bg-pink-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.25-1.828-4.25-4.083-4.25C14.417 4 13 5.417 12 6.5 11 5.417 9.583 4 7.083 4 4.828 4 3 6 3 8.25c0 4.667 6.75 9 9 9s9-4.333 9-9z"
                        />
                      </svg>
                    </button>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-[4/5] mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={product.imageUrl[0] || fallbackImage}
                        alt={product.name}
                        width={400}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="text-left">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.293c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.293a1 1 0 00-.364-1.118L2.37 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>

                    <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">₹{product.price}</p>

                    <Link
                      href={`/products/${product.id}`}
                      className="inline-block border border-black text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </motion.section>
  )
}
