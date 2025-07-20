'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {  User, LogOut, ChevronDown } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import axios from 'axios'

export default function Navbar() {
  const router = useRouter()
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const { user, setUser } = useUser()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories/getAllCategories`)
        setCategories(res.data.result.data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }

    fetchCategories()
  }, [])

  const logout = async () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  return (
    <>
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-800">
            SkinGlow
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/orders" className="text-gray-700 hover:text-black text-sm">
              Orders
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center text-sm text-gray-700 hover:text-black"
              >
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {showCategoryDropdown && (
                <div className="absolute bg-white border rounded shadow-md mt-2 w-40 z-50">
                  {categories.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-500">No categories found.</p>
                  ) : (
                    categories.map((cat) => {
                      const slug = cat.name.toLowerCase().replace(/\s+/g, '-')
                      return (
                        <Link
                          key={cat.id}
                          href={`/products?category=${slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowCategoryDropdown(false)}
                        >
                          {cat.name}
                        </Link>
                      )
                    })
                  )}
                </div>
              )}
            </div>

            {/* 🛒 Cart Button
            <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-black" />
          </Link> */}

            {/* 👤 User Profile / Login */}
            {!user ? (
              <Link href="/login">
                <User className="h-5 w-5 text-gray-700 hover:text-black" />
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center text-sm text-gray-700 hover:text-black"
                >
                  {user.name ? (
                    <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-52 z-50">
                  <ul className="py-1 text-sm text-gray-700">
  <li>
    <Link
      href="/profile-page"
      className="flex items-center px-4 py-3 hover:bg-gray-100 transition"
    >
      <User className="w-4 h-4 mr-2" />
      Profile
    </Link>
  </li>


  {user.role === 'ADMIN' && (
    <li>
      <Link
        href="/admin/dashboard"
        className="flex items-center px-4 py-3 hover:bg-gray-100 transition"
      >
        <User className="w-4 h-4 mr-2" />
        Dashboard
      </Link>
    </li>
  )}

  <li>
    <button
      onClick={logout}
      className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-gray-100 transition"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </button>
  </li>
</ul>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

    </>
  )
}
