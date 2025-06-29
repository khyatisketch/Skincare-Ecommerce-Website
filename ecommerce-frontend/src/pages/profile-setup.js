'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function ProfileSetup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/update-profile`, {
        name, email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      router.push('/')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Profile update failed')
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Complete Your Profile</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Save and Continue
        </button>

        {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  )
}
