"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminOrders() {
  const { token, loading } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isShippingOpen, setIsShippingOpen] = useState(true)

  useEffect(() => {
    if (!token || loading) return
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/order/allOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrders(res.data.result.orders || [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      }
    }
    fetchOrders()
  }, [token, loading])

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/order/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      )
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const statusColors = {
    Pending: 'bg-yellow-200 text-yellow-800',
    Processing: 'bg-purple-200 text-purple-800',
    Shipped: 'bg-blue-200 text-blue-800',
    Delivered: 'bg-green-200 text-green-800',
  }

  const [shippingAddressInput, setShippingAddressInput] = useState('')
const [trackingNumberInput, setTrackingNumberInput] = useState('')
const [editingOrderId, setEditingOrderId] = useState(null)

const openShippingEdit = (order) => {
  setShippingAddressInput(order.shippingAddress || '')
  setTrackingNumberInput(order.trackingNumber || '')
  setEditingOrderId(order.id)
}

const saveShippingInfo = async (orderId) => {
  try {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/order/${orderId}/shipping`,
      {
        shippingAddress: shippingAddressInput,
        trackingNumber: trackingNumberInput,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, shippingAddress: shippingAddressInput, trackingNumber: trackingNumberInput }
          : o
      )
    )

    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({
        ...prev,
        shippingAddress: shippingAddressInput,
        trackingNumber: trackingNumberInput,
      }))
    }

    setEditingOrderId(null)
  } catch (err) {
    console.error('Failed to save shipping info:', err)
  }
}


  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-pink-600 text-lg font-montserrat">
        Loading...
      </div>
    )

  if (!token)
    return (
      <div className="h-screen flex items-center justify-center text-red-600 text-lg font-montserrat">
        Please login as admin to manage orders.
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-montserrat">
      <h1 className="text-4xl font-bold mb-10 text-pink-600 text-center">Manage Orders</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order List */}
        <div className="bg-white rounded-3xl shadow-md overflow-y-auto max-h-[75vh]">
          {orders.length === 0 && (
            <p className="text-center text-gray-500 py-6">No orders found.</p>
          )}

          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`p-5 border-b cursor-pointer hover:bg-pink-50 transition flex items-center justify-between ${
                selectedOrder?.id === order.id ? 'bg-pink-100' : ''
              }`}
            >
              <div>
                <h4 className="font-semibold text-pink-800">#{order.id}</h4>
                <p className="text-sm text-gray-500">{order.user?.phone || 'N/A'}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  statusColors[order.status] || 'bg-gray-200 text-gray-800'
                }`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>

        {/* Order Detail Panel */}
        <div className="lg:col-span-2 bg-pink-50 rounded-3xl p-8 shadow-md min-h-[75vh]">
          {selectedOrder ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-pink-800 mb-1">
                  Order #{selectedOrder.id}
                </h2>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-semibold">Customer:</p>
                  <p>{selectedOrder.user?.phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Total:</p>
                  <p>Rs.{selectedOrder.total?.toFixed(2)}</p>
                </div>
              </div>

              <h4 className="font-semibold text-pink-600 mb-3">Items</h4>
<div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y">
  {selectedOrder.orderItems?.map((item) => (
    <div
      key={item.id}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4"
    >
      <img
        src={item.product?.imageUrl[0]}
        alt={item.product?.name}
        className="w-20 h-20 object-cover rounded-lg border"
      />

      <div className="flex-1">
        <p className="font-semibold text-pink-900">{item.product?.name || 'N/A'}</p>
      </div>

      <div className="flex sm:flex-col sm:items-end sm:justify-center text-sm gap-1 w-full sm:w-24 text-right">
        <span className="text-gray-500 sm:hidden">Qty:</span>
        <span className="font-medium">{item.quantity}</span>
      </div>

      <div className="flex sm:flex-col sm:items-end sm:justify-center text-sm gap-1 w-full sm:w-28 text-right">
        <span className="text-gray-500 sm:hidden">Price:</span>
        <span className="font-medium">Rs. {item.price.toFixed(2)}</span>
      </div>
    </div>
  ))}
</div>

              <div className="mt-6">
                <label
                  htmlFor="status"
                  className="block font-semibold text-pink-700 mb-2"
                >
                  Update Status:
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateStatus(selectedOrder.id, e.target.value)
                  }
                  className="border border-pink-300 rounded-xl px-4 py-2 font-medium text-pink-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>
              {/* Shipping Address and Tracking Number Section */}
              <div className="mt-10 bg-white p-6 rounded-2xl shadow-sm">
      <div
        onClick={() => setIsShippingOpen((open) => !open)}
        className="flex justify-between items-center cursor-pointer select-none"
      >
        <h4 className="text-lg font-bold text-pink-700">Shipping Information</h4>
        <button
          aria-label={isShippingOpen ? 'Collapse shipping info' : 'Expand shipping info'}
          className="text-pink-600 hover:text-pink-800 focus:outline-none"
          type="button"
        >
          {/* simple arrow icon */}
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isShippingOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isShippingOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden mt-4"
          >
            {editingOrderId === selectedOrder.id ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-pink-600 mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    rows={3}
                    value={shippingAddressInput}
                    onChange={(e) => setShippingAddressInput(e.target.value)}
                    className="w-full rounded-xl border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-4 py-2 text-sm text-pink-900 placeholder-gray-400"
                    placeholder="Enter full shipping address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-600 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    className="w-full rounded-xl border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none px-4 py-2 text-sm text-pink-900 placeholder-gray-400"
                    placeholder="e.g. TRK12345678"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => saveShippingInfo(selectedOrder.id)}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl px-6 py-2 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingOrderId(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl px-6 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <span className="font-semibold text-pink-700">Address:</span>{' '}
                  {selectedOrder.shippingAddress || 'Not set'}
                </p>
                <p>
                  <span className="font-semibold text-pink-700">Tracking Number:</span>{' '}
                  {selectedOrder.trackingNumber || 'Not set'}
                </p>
                <button
                  onClick={() => openShippingEdit(selectedOrder)}
                  className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl px-4 py-1 text-sm"
                >
                  Edit Shipping Info
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>


            </>
          ) : (
            <div className="text-gray-400 italic text-center mt-24">
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
