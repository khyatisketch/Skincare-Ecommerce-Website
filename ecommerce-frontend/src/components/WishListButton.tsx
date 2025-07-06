import { Heart, HeartOff } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { useState, useEffect } from 'react'

export default function WishlistButton({ productId }: { productId: number }) {
  const { user } = useUser()
  const [isWished, setIsWished] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/getWishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then((data: {
          result: {
            wishlist: {
              productId: number
              product: { id: number }
            }[]
          }
        }) => {
          setIsWished(
            data.result.wishlist.some(item => item.product.id === productId)
          )
        })
        .catch(err => console.error('Failed to fetch wishlist:', err))
    }
  }, [user, productId])

  const toggleWishlist = async () => {
    if (!token) return alert('Login required')

    const url = isWished
      ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/${productId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist/addWishlist`

    const options: RequestInit = {
      method: isWished ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    if (!isWished) {
      options.body = JSON.stringify({ productId })
    }

    try {
      await fetch(url, options)
      setIsWished(!isWished)
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  return (
    <button onClick={toggleWishlist} aria-label="Toggle Wishlist">
      {isWished ? (
        <Heart className="text-red-500" fill="currentColor" size={22} />
      ) : (
        <HeartOff className="text-gray-500" size={22} />
      )}
    </button>
  )
}
