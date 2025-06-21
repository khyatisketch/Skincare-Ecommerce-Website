// pages/success.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function Success() {
  const router = useRouter()
  const { session_id } = router.query

  useEffect(() => {
    if (session_id) {
      toast.success('🎉 Your order is confirmed!')

      // Redirect after a short delay
      const timeout = setTimeout(() => {
        router.push('/orders') // or '/orders' if you have an orders page
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [session_id, router])

  return null // no UI needed
}
