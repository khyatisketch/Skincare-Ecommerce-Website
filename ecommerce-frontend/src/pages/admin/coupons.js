'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/coupons`)
      setCoupons(res.data)
    } catch (err) {
      toast.error('Failed to fetch coupons', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/coupons`, form)
      toast.success('Coupon created!')
      setForm({
        code: '',
        type: 'percentage',
        value: '',
        minOrderValue: '',
        usageLimit: '',
        expiresAt: '',
      })
      fetchCoupons()
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/coupons/${id}`)
      toast.success('Deleted!')
      fetchCoupons()
    } catch (err) {
      toast.error('Delete failed', err)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manage Coupons</h2>

      <form onSubmit={handleSubmit} className="grid gap-3 mb-6 grid-cols-2">
        <input
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2"
        >
          <option value="percentage">Percentage (%)</option>
          <option value="flat">Flat (₹)</option>
        </select>
        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="number"
          placeholder="Min Order Value"
          value={form.minOrderValue}
          onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Usage Limit"
          value={form.usageLimit}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          className="border p-2"
          required
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded">
          Create Coupon
        </button>
      </form>

      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{c.code}</p>
              <p>
                {c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`} — min: ₹{c.minOrderValue || 0}
              </p>
              <p className="text-sm text-gray-600">
                Used {c.usedCount} / {c.usageLimit || '∞'} — Expires: {new Date(c.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
