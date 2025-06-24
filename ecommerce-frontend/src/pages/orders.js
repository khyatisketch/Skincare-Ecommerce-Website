import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { useRouter } from 'next/router'


export default function Orders() {
  const [orders, setOrders] = useState([])
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndFetchOrders = async () => {
      const token = localStorage.getItem('token')
  
      if (!token) {
        router.push(`/login?redirect=/orders`)
        return
      }
  
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/order/myOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrders(res.data.result.orders)
      } catch (err) {
        console.error(err)
        router.push(`/login?redirect=/orders`)
      }
    }
  
    checkAuthAndFetchOrders()
  }, [router])
  
  const handleReorder = (orderItems) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || []
  
      const updatedCart = [...existingCart]
  
      for (let item of orderItems) {
        const product = item.product
  
        if (!product) continue // skip if product info is missing
  
        const existingItemIndex = updatedCart.findIndex(
          (cartItem) => cartItem.id === product.id
        )
  
        console.log('Product being added:', {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: item.quantity
          })
        if (existingItemIndex !== -1) {
          updatedCart[existingItemIndex].quantity += item.quantity
        } else {
          updatedCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: item.quantity
          })
        }
      }
  
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      alert('Items added to cart!')
    } catch (err) {
      console.error('Reorder failed:', err)
      alert('Something went wrong while adding items to cart.')
    }
  }
  
  

  return (
    <div style={{ display: 'flex', fontFamily: "'Helvetica Neue', sans-serif", color: '#222' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        borderRight: '1px solid #eee',
        padding: '24px 16px',
        backgroundColor: '#fff'
      }}>
        <div style={{
          backgroundColor: '#ffe3ec',
          color: '#fa5a7d',
          padding: '12px 16px',
          borderRadius: 8,
          fontWeight: 600,
          marginBottom: 12,
          cursor: 'pointer'
        }}>
          🚚 Orders
        </div>
        <div style={{
          padding: '12px 16px',
          borderRadius: 8,
          color: '#555',
          cursor: 'pointer'
        }}>
          🤍 Wishlist
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '24px',
        backgroundColor: '#fafafa',
        minHeight: '100vh'
      }}>
        <h2 style={{ color: '#fa5a7d', fontSize: '1.75rem', marginBottom: '1rem' }}>My Orders</h2>

        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: 60, color: '#aaa' }}>
            You have not placed any orders yet.
          </p>
        ) : (
          orders.map(order => (
            <div key={order.id} style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 2px 8px rgba(250, 90, 125, 0.1)',
              marginBottom: 24
            }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  <strong>Order ID:</strong> {order.id}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: 4 }}>
                Delivered on {format(new Date(order.createdAt), 'dd MMM yyyy')}
                  {order.shippingAddress && (
  <p style={{ fontSize: '0.9rem', color: '#444', marginTop: 4 }}>
    <strong>Shipping Address:</strong> {order.shippingAddress}
  </p>
)}

{order.trackingNumber && (
  <p style={{ fontSize: '0.9rem', color: '#444', marginTop: 2 }}>
    <strong>Tracking Number:</strong> {order.trackingNumber}
  </p>
)}
                </div>
              </div>

              {(order.orderItems || []).map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderTop: '1px solid #f0f0f0',
                  padding: '16px 0'
                }}>
                  <img
                    src={item.product?.imageUrl || '/placeholder.png'}
                    alt={item.product?.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginRight: 16
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{item.product?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                      {item.quantity} × Rs.{item.price.toFixed(2)}
                    </div>
                  </div>
                  {item.product?.isGift && (
                    <span style={{
                      backgroundColor: '#fa5a7d',
                      color: '#fff',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      borderRadius: 4,
                      fontWeight: 600
                    }}>
                      GIFT
                    </span>
                  )}
                </div>
              ))}
             <button
  onClick={() => handleReorder(order.orderItems)}
  style={{
    marginTop: 16,
    padding: '10px 20px',
    backgroundColor: '#fa5a7d',    // your main pink color
    color: '#fff',
    border: '1.5px solid #fa5a7d',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    boxShadow: '0 3px 6px rgba(250, 90, 125, 0.15)',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = '#ff8aa2'
    e.currentTarget.style.boxShadow = '0 6px 12px rgba(250, 90, 125, 0.3)'
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = '#fa5a7d'
    e.currentTarget.style.boxShadow = '0 3px 6px rgba(250, 90, 125, 0.15)'
  }}
>
   <span>Buy Again</span>
</button>
<button
  onClick={async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/order/${order.id}/resendConfirmation`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Confirmation email resent!')
    } catch (err) {
      console.error('Resend failed:', err)
      alert('Failed to resend confirmation email.')
    }
  }}
  style={{
    marginTop: 12,
    marginLeft: 12,
    padding: '8px 16px',
    backgroundColor: '#fff',
    color: '#fa5a7d',
    border: '1.5px solid #fa5a7d',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 6px rgba(250, 90, 125, 0.1)',
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = '#ffe3ec'
    e.currentTarget.style.boxShadow = '0 6px 12px rgba(250, 90, 125, 0.2)'
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = '#fff'
    e.currentTarget.style.boxShadow = '0 3px 6px rgba(250, 90, 125, 0.1)'
  }}
>
  Resend Confirmation Email
</button>



            </div>
          ))
        )}
      </main>
    </div>
  )
}
