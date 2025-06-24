import axios from 'axios'
import { useEffect, useState } from 'react'

function OrderItem({ order }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleResend = async () => {
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.BACKEND_API_URL}/order/${order.id}/resend-confirmation`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Confirmation email resent!')
    } catch (err) {
      console.error('Resend confirmation failed:', err);
      setMessage('Failed to resend email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p>Order #{order.id} — Total: ${order.total}</p>
      <button onClick={handleResend} disabled={loading}>
        {loading ? 'Sending...' : 'Resend Confirmation Email'}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}

// ✅ Default export of a valid page component
export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(`${process.env.BACKEND_API_URL}/order/myOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrders(res.data.result.orders)
      } catch (err) {
        console.error('Failed to fetch orders', err)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div>
      <h1>Your Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => <OrderItem key={order.id} order={order} />)
      )}
    </div>
  )
}
