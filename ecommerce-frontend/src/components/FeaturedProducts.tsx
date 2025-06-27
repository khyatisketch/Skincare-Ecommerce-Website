'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string[]
  stock: number
  createdAt: string
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

  // 🧠 Utility to determine label
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
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-4 tracking-tight">
          Best Sellers
        </h2>
        <p className="text-gray-500 mb-12 text-lg">
          Discover formulas our customers can't get enough of
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
  
              return (
                <div
                  key={product.id}
                  className="relative rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all"
                >
                  {badge && (
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  )}
  
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
    </section>
  )
  
}
