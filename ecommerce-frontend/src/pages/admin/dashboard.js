'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/adminDashboard/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setStats(data.result))
  }, [])

  if (!stats) return <p className="p-10">Loading dashboard...</p>

  return (
    <div className="w-full py-6 px-4 md:px-0">
    <h1 className="text-4xl font-semibold text-gray-800 mb-10">Admin Overview</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Orders" value={stats.totalOrders} colorFrom="from-pink-100" colorTo="to-pink-50" icon="📦" />
      <StatCard label="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString?.() || 0}`} colorFrom="from-yellow-100" colorTo="to-yellow-50" icon="💰" />
      <StatCard label="In Stock Products" value={stats.inStockCount} colorFrom="from-green-100" colorTo="to-green-50" icon="🧴" />
      <StatCard label="Low Stock Alerts" value={stats.lowStockCount} colorFrom="from-red-100" colorTo="to-red-50" icon="⚠️" />
    </div>
  </div> 
  )
}

function StatCard({ label, value, colorFrom, colorTo, icon }) {
  return (
    <div className={`bg-gradient-to-br ${colorFrom} ${colorTo} p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition`}>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{value}</span>
      </div>
    </div>
  )
}
