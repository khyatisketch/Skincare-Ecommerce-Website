"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { FaStar } from 'react-icons/fa'

export default function AdminReviews() {
  const { token, loading } = useAuth()
  const [reviews, setReviews] = useState([])

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${process.env.BACKEND_API_URL}/products/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReviews(res.data.result.reviews || [])
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    }
  }

  useEffect(() => {
    if (!token || loading) return
    fetchReviews()
  }, [token, loading])

  const approveReview = async (id) => {
    try {
      await axios.patch(
        `${process.env.BACKEND_API_URL}/products/admin/reviews/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
      )
    } catch (err) {
      console.error('Approval failed:', err)
    }
  }

  const deleteReview = async (id) => {
    try {
      await axios.delete(`${process.env.BACKEND_API_URL}/products/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-pink-600 text-lg font-semibold">
        Loading...
      </div>
    )

  if (!token)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-lg font-semibold">
        Please login as admin to moderate reviews.
      </div>
    )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
      <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-12 tracking-wide">Moderate Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-400">No reviews to show.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition duration-200 p-5 flex items-start gap-5"
            >
              <img
                src={review.product?.imageUrl || '/placeholder.png'}
                alt="Product"
                className="w-24 h-24 rounded-xl object-cover border"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-bold text-pink-700 text-lg">{review.rating}</span>
                </div>
                <p className="text-gray-800 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-500">
                  By <span className="font-medium">{review.user?.phone}</span> on{' '}
                  <span className="italic">{review.product?.name}</span>
                </p>
              </div>

              <div className="ml-auto text-right">
                {review.status === 'pending' ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => approveReview(review.id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-5 py-1.5 rounded-full shadow"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-red-600 text-sm px-5 py-1.5 rounded-full shadow"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="inline-block bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    Approved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
