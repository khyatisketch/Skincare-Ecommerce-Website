'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import ProductCard from '../components/ProductCard'
import AccountLayout from '../components/AccountLayout'

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
    <AccountLayout activeTab="wishlist">
      <h1 style={{
        fontSize: '1.75rem',
        color: '#9333ea',
        marginBottom: '1.5rem',
        fontWeight: 700
      }}>Your Wishlist 💖</h1>

      {wishlist.length === 0 ? (
        <p style={{ color: '#888' }}>Your wishlist is empty.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
  borderRadius: '12px',
  padding: '12px'
}}>
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        </div>
      )}
    </AccountLayout>
  )
}
