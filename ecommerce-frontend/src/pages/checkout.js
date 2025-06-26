import { useCart } from '../context/CartContext'
import { useState, useMemo } from 'react'
import axios from 'axios'

export default function CheckoutPage() {
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

  const applyCoupon = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coupons/checkout/applyCoupon`, {
        code: couponCode,
        orderTotal: total
      })
      setDiscountInfo(res.data)
      localStorage.setItem('appliedCoupon', JSON.stringify(res.data))
      toast.success(`Coupon ${res.data.couponCode} applied!`)
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong')
      setDiscountInfo(null)
      toast.error(err?.response?.data?.error || 'Failed to apply coupon')
    } finally {
      setLoading(false)
    }
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

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.post('https://skincare-ecommerce-website.onrender.com/payments/createCheckoutSession', {
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

  const { subtotal, total } = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + price * item.quantity;
    }, 0);
  
    return { subtotal, total: subtotal };
  }, [cart]);
  
  // const applyCoupon = async () => {
  //   try {
  //     const res = await axios.post('http://localhost:4007/coupons/checkout/applyCoupon', {
  //       code: couponCode,
  //       orderTotal: cartTotal,
  //     });
  //     setDiscountInfo(res.data)
  //   } catch (err) {
  //     alert(err.response.data.error)
  //   }
  // }
  

  return (
    <div className="flex flex-wrap gap-8 p-8 max-w-5xl mx-auto font-sans text-gray-800">
      {/* Left: Shipping Form */}
      <div className="flex-1 min-w-[300px] bg-white p-8 rounded-xl shadow-md flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Shipping Information</h2>
        <input name="name" placeholder="Full Name" value={shipping.name} onChange={handleChange} required className="p-3 border border-gray-300 rounded-lg bg-gray-50" />
        <input name="email" placeholder="Email" value={shipping.email} onChange={handleChange} required type="email" className="p-3 border border-gray-300 rounded-lg bg-gray-50" />
        <input name="phone" placeholder="Phone Number" value={shipping.phone} onChange={handleChange} required className="p-3 border border-gray-300 rounded-lg bg-gray-50" />
        <textarea name="address" placeholder="Full Address" value={shipping.address} onChange={handleChange} required rows={3} className="p-3 border border-gray-300 rounded-lg bg-gray-50 resize-none" />
        <button onClick={handleCheckout} className="mt-4 p-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition duration-300">Checkout with Stripe</button>
      </div>

      {/* Right: Cart Summary */}
      <div className="flex-1 min-w-[300px] bg-white p-8 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Bag ({cart.length} Items)</h3>
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
          {cart.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-4">
              <img src={item.imageUrl[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.size}</div>
                <div className="text-sm">Qty: {item.quantity}</div>
              </div>
              {/* Coupon Form */}
<div className="mt-4 space-y-2">
  <label htmlFor="coupon" className="block text-sm font-medium">Have a coupon?</label>
  <div className="flex gap-2">
    <input
      type="text"
      id="coupon"
      className="border p-2 w-full"
      placeholder="Enter coupon code"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
    />
    <button
      className="bg-black text-white px-4 py-2"
      onClick={applyCoupon}
      disabled={loading}
    >
      {loading ? 'Checking...' : 'Apply'}
    </button>
  </div>
  {error && <p className="text-red-500 text-sm">{error}</p>}
</div>

              <div className="text-right">
                {item.originalPrice && item.originalPrice !== item.price ? (
                  <>
                    <div className="line-through text-sm text-gray-400">₹{item.originalPrice}</div>
                    <div className="text-pink-600 font-bold">₹{item.price}</div>
                  </>
                ) : (
                  <div className="font-bold">₹{item.price}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Price Details */}
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
