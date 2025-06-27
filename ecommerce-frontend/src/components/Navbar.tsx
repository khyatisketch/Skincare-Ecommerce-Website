'use client'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShoppingCart, User, ChevronDown } from 'lucide-react'

export default function Navbar() {
//   const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  const categories = [
    { name: 'Cleansers', slug: 'cleansers' },
    { name: 'Serums', slug: 'serums' },
    { name: 'Moisturizers', slug: 'moisturizers' },
    { name: 'SPF', slug: 'spf' },
  ]

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          SkinGlow
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link href="/orders" className="text-gray-700 hover:text-black text-sm">Orders</Link>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center text-sm text-gray-700 hover:text-black"
            >
              Categories <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {showDropdown && (
              <div className="absolute bg-white border rounded shadow-md mt-2 w-40 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-black" />
            {/* Optionally add badge with item count */}
          </Link>

          {/* User/Login Icon */}
          <Link href="/login">
            <User className="h-5 w-5 text-gray-700 hover:text-black" />
          </Link>
        </div>
      </div>
    </nav>
  )
}
