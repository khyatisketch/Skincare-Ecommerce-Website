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
  images: string[]
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/getAllProducts`)
        setProducts(res.data?.result?.products?.slice(0, 3) || [])
      } catch (err) {
        toast.error('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const fallbackImage = '/placeholder.jpg' // Make sure this image exists in /public

  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-4">Best Sellers</h2>
        <p className="text-gray-500 mb-12 text-lg">Shop our most loved skincare formulas</p>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {loading ? (
            Array(3).fill(0).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-2xl border bg-pink-50 p-5 shadow-md h-[400px]"
              >
                <div className="bg-gray-300 h-56 w-full rounded-lg mb-4" />
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-8 bg-gray-300 rounded-full w-24 mx-auto" />
              </div>
            ))
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="relative rounded-2xl border bg-pink-50 p-5 shadow-md hover:shadow-xl transition-all"
              >
                {/* Best Seller Badge */}
                <span className="absolute top-3 left-3 bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  ✨ Best Seller
                </span>

                <Image
                  src={product.images?.[0] || fallbackImage}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="rounded-lg object-cover mb-4 h-56 w-full"
                />

                <h3 className="text-xl font-medium text-gray-800 mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-4">₹{product.price}</p>
                <Link
                  href={`/products/${product.id}`}
                  className="inline-block bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
                >
                  Shop Now
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
