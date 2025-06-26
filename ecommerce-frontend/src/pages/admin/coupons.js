'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminCouponsPage() {
  const { token, loading } = useAuth()
  const [coupons, setCoupons] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)

  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderValue: '',
    usageLimit: '',
    expiresAt: '',
  })

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/coupons/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('Coupons API response:', res.data)
  
      // Access the array inside result.coupons
      setCoupons(res.data.result.coupons || [])
    } catch (err) {
      console.error('Failed to fetch coupons:', err)
    }
  }

  useEffect(() => {
    if (!loading && token) fetchCoupons()
  }, [loading, token])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingCoupon
        ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/coupons/admin/coupons/${editingCoupon.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/coupons/admin/coupons`

      const method = editingCoupon ? 'put' : 'post'

      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success(editingCoupon ? 'Coupon updated' : 'Coupon created')
      setForm({ code: '', type: 'percentage', value: '', minOrderValue: '', usageLimit: '', expiresAt: '' })
      setEditingCoupon(null)
      fetchCoupons()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save coupon')
    }
  }

  const handleEdit = (c) => {
    setEditingCoupon(c)
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrderValue: c.minOrderValue,
      usageLimit: c.usageLimit,
      expiresAt: c.expiresAt?.slice(0, 10) || '',
    })
    setIsOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/coupons/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Deleted coupon')
      fetchCoupons()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-center mt-20 text-pink-600">Loading...</div>
  if (!token) return <div className="text-center mt-20 text-red-600">Please login as admin to manage coupons.</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-montserrat">
      <h1 className="text-4xl font-bold text-center text-pink-600 mb-6">Manage Coupons</h1>

      <button
        className="mb-4 text-pink-600 font-semibold hover:underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '− Hide Create Coupon Form' : '+ Create New Coupon'}
      </button>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-pink-200 rounded-3xl shadow-xl p-8 space-y-6 mb-12"
        >
          <h2 className="text-2xl font-bold text-pink-600">Coupon Form</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              name="code"
              placeholder="Coupon Code"
              value={form.code}
              onChange={handleChange}
              className="p-3 rounded-xl border border-gray-300 focus:ring-pink-500"
              required
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="p-3 rounded-xl border border-gray-300 focus:ring-pink-500"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed ₹</option>
            </select>
            <input
              name="value"
              placeholder="Discount Value"
              value={form.value}
              onChange={handleChange}
              type="number"
              className="p-3 rounded-xl border border-gray-300 focus:ring-pink-500"
              required
            />
            <input
              name="minOrderValue"
              placeholder="Minimum Order Value"
              value={form.minOrderValue}
              onChange={handleChange}
              type="number"
              className="p-3 rounded-xl border border-gray-300 focus:ring-pink-500"
            />
            <input
              name="usageLimit"
              placeholder="Usage Limit"
              value={form.usageLimit}
              onChange={handleChange}
              type="number"
              className="p-3 rounded-xl border border-gray-300 focus:ring-pink-500"
            />
            <input
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              type="date"
              className="p-3 rounded-xl border border-gray-300 focus:ring-pink-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-xl"
            >
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="bg-pink-50 p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-pink-700">{c.code}</h3>
            <p className="text-sm text-gray-700 mt-1">
              {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`} off
            </p>
            <p className="text-sm text-gray-500">
              Min Order: ₹{c.minOrderValue || 0}, Uses Left: {c.usageLimit}
            </p>
            <p className="text-sm text-gray-500">
              Expires: {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'N/A'}
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleEdit(c)}
                className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="flex items-center gap-1 text-red-600 hover:underline text-sm"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
