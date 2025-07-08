'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const { user } = useUser()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (user) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getWishlist`,{
        headers: {
            'Authorization': `Bearer ${token}` // or however you're storing it
          }})
        .then(res => res.json())
        .then(data => setWishlist(data.map(item => item.product)))
    }
  }, [user])

  if (!user) return <p className="p-10">Please login to view your wishlist.</p>

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist 💖</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
