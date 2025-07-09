'use client'

import { Heart, HeartOff } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function WishlistButton({ productId }: { productId: number }) {
  const { user } = useUser()
  const [isWished, setIsWished] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (user && token) {
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
          const wished = data.result.wishlist.some(item => item.product.id === productId)
          setIsWished(wished)
        })
        .catch(err => {
          console.error('Failed to fetch wishlist:', err)
          toast.error('Could not load wishlist')
        })
    }
  }, [user, productId])

  const toggleWishlist = async () => {
    const token = localStorage.getItem('token')
    if (!user || !token) return toast.error('Please log in to use wishlist.')

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
      const res = await fetch(url, options)
      if (!res.ok) throw new Error('Request failed')

      setIsWished(!isWished)
      toast.success(isWished ? 'Removed from wishlist' : 'Added to wishlist 💖')
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast.error('Something went wrong!')
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
