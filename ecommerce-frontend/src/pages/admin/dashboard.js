'use client'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/adminDashboard/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log('Dashboard API response:', data);
                setStats(data.result); // ✅ Fix is here
            });
    }, []);


    if (!stats) return <p className="p-10">Loading dashboard...</p>

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold mb-8">📊 Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Orders" value={stats.totalOrders} />
                <StatCard
                    label="Revenue"
                    value={`₹${stats.totalRevenue?.toLocaleString?.() || 0}`}
                />
                <StatCard label="In Stock Products" value={stats.inStockCount} />
                <StatCard label="Low Stock Alerts" value={stats.lowStockCount} highlight />
            </div>
        </div>
    )
}

function StatCard({ label, value, highlight = false }) {
    return (
        <div
            className={`p-6 rounded-xl shadow-md text-center ${highlight ? 'bg-red-50 border border-red-300' : 'bg-white'
                }`}
        >
            <p className="text-gray-500 text-sm mb-2">{label}</p>
            <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
        </div>
    )
}
