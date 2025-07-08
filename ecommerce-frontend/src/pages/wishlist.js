'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import ProductCard from '../components/ProductCard'
import AccountLayout from '../components/AccountLayout'

export default function WishlistPage() {
  const { user } = useUser()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (user) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getWishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.result?.wishlist) {
            const wishlistProducts = data.result.wishlist.map(item => item.product)
            setWishlist(wishlistProducts)
          } else {
            setWishlist([])
          }
        })
        .catch(err => {
          console.error('❌ Failed to fetch wishlist:', err)
          setError('Something went wrong while loading your wishlist.')
        })
        .finally(() => setLoading(false))
    }
  }, [user])

  if (!user) {
    return <p className="p-10">Please login to view your wishlist.</p>
  }

  return (
    <AccountLayout activeTab="wishlist">
      <h1 style={{
        fontSize: '1.75rem',
        color: '#9333ea',
        marginBottom: '1.5rem',
        fontWeight: 700
      }}>
        Your Wishlist 💖
      </h1>

      {loading && <p style={{ color: '#888' }}>Loading your wishlist...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && wishlist.length === 0 && (
        <p style={{ color: '#888' }}>Your wishlist is empty.</p>
      )}

      {!loading && !error && wishlist.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
          background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
          padding: '20px',
          borderRadius: '12px'
        }}>
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </AccountLayout>
  )
}
