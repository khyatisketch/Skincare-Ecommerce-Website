import { useCart } from '../context/CartContext'
import { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

export default function CheckoutPage() {
const router = useRouter()
  const { cart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [discountInfo, setDiscountInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0
      return sum + price * item.quantity
    }, 0)
  }, [cart])

  const applyCoupon = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/coupons/checkout/applyCoupon`, {
        code: couponCode,
        orderTotal: total
      })
      setDiscountInfo(res.data)
      localStorage.setItem('appliedCoupon', JSON.stringify(res.data))
      toast.success(`✅ Coupon "${res.data.couponCode}" applied!`)
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong')
      setDiscountInfo(null)
      toast.error(err?.response?.data?.error || 'Failed to apply coupon')
    } finally {
      setLoading(false)
    }
  }

  const removeCoupon = () => {
    setDiscountInfo(null)
    setCouponCode('')
    localStorage.removeItem('appliedCoupon')
    toast('🗑️ Coupon removed')
  }

  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon')
    if (savedCoupon) {
      const parsed = JSON.parse(savedCoupon)
      setDiscountInfo(parsed)
      setCouponCode(parsed.couponCode)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setShipping(prev => ({ ...prev, [name]: value }))
  }

  const isCouponExpired = useMemo(() => {
    if (!discountInfo?.expiresAt) return false
    return new Date(discountInfo.expiresAt) < new Date()
  }, [discountInfo])

  const handleCheckout = async () => {
    if (isCouponExpired) {
      toast.error('❌ Coupon has expired. Please remove it and try again.')
      return
    }
  
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('🔒 Please log in to proceed.')
      router.push('/login')
      return
    }
  
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payments/createCheckoutSession`, {
        cartItems: cart,
        shipping,
        discount: discountInfo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      window.location.href = res.data.result.url
    } catch (err) {
      console.error(err.response?.data || err.message)
      alert('Checkout failed. Please check your inputs and try again.')
    }
  }
  

  const discountedItems = useMemo(() => {
    if (!discountInfo || isCouponExpired) return cart
    const discountFactor = (total - discountInfo.finalAmount) / total

    return cart.map(item => {
      const itemTotal = item.price * item.quantity
      const itemDiscount = itemTotal * discountFactor
      const discountedPrice = (itemTotal - itemDiscount) / item.quantity

      return {
        ...item,
        discountedPrice: discountedPrice.toFixed(2)
      }
    })
  }, [cart, discountInfo, total, isCouponExpired])

  return (
    <div className="flex flex-wrap gap-8 p-8 max-w-5xl mx-auto font-sans text-gray-800">
      {/* Left: Shipping Form */}
      <div className="flex-1 min-w-[300px] bg-white p-8 rounded-xl shadow-md flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Shipping Information</h2>
        <input name="name" placeholder="Full Name" value={shipping.name} onChange={handleChange} required className="p-3 border border-gray-300 rounded-lg bg-gray-50" />
        <input name="email" placeholder="Email" value={shipping.email} onChange={handleChange} required type="email" className="p-3 border border-gray-300 rounded-lg bg-gray-50" />
        <input name="phone" placeholder="Phone Number" value={shipping.phone} onChange={handleChange} required className="p-3 border border-gray-300 rounded-lg bg-gray-50" />
        <textarea name="address" placeholder="Full Address" value={shipping.address} onChange={handleChange} required rows={3} className="p-3 border border-gray-300 rounded-lg bg-gray-50 resize-none" />
        <button
          onClick={handleCheckout}
          className={`mt-4 p-4 ${isCouponExpired ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'} text-white font-bold rounded-lg transition duration-300`}
          disabled={isCouponExpired}
        >
          Checkout with Stripe
        </button>
        {isCouponExpired && (
          <p className="text-red-500 text-sm mt-2">❌ Coupon expired. Please remove it to proceed.</p>
        )}
      </div>

      {/* Right: Cart Summary */}
      <div className="flex-1 min-w-[300px] bg-white p-8 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Bag ({cart.length} Items)</h3>
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
          {discountedItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-4">
              <img src={item.imageUrl[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.size}</div>
                <div className="text-sm">Qty: {item.quantity}</div>
              </div>
              <div className="text-right">
                {discountInfo && !isCouponExpired ? (
                  <>
                    <div className="line-through text-sm text-gray-400">₹{item.price}</div>
                    <div className="text-pink-600 font-bold">₹{item.discountedPrice}</div>
                  </>
                ) : (
                  <div className="font-bold">₹{item.price}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Form */}
        <div className="mt-4 space-y-2">
          <label htmlFor="coupon" className="block text-sm font-medium">Have a coupon?</label>
          <div className="flex gap-2">
            <input
              type="text"
              id="coupon"
              className="border p-2 w-full rounded-md"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={!!discountInfo}
            />
            {discountInfo ? (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md cursor-not-allowed"
                disabled
              >
                Applied ✓
              </button>
            ) : (
              <button
                className="p-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition duration-300"
                onClick={applyCoupon}
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Apply'}
              </button>
            )}
          </div>
          {discountInfo && (
            <>
              <button
                className="text-sm text-red-500 underline mt-1"
                onClick={removeCoupon}
              >
                Remove Coupon
              </button>
              <p className="text-xs text-gray-500">
                🕒 Expires on: <strong>{new Date(discountInfo.expiresAt).toLocaleString()}</strong>
              </p>
            </>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Price Summary */}
        <div className="mt-6 space-y-2 text-sm">
          <p>Subtotal: ₹{total}</p>
          {discountInfo && (
            <>
              <p className="text-green-600">Discount ({discountInfo.couponCode}): -₹{discountInfo.discount}</p>
              <p className="font-bold text-lg">Total: ₹{discountInfo.finalAmount}</p>
            </>
          )}
          {!discountInfo && (
            <p className="font-bold text-lg">Total: ₹{total}</p>
          )}
        </div>
      </div>
    </div>
  )
}
