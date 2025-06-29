'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function ProfileSetup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage('Please login first.')
        return
      }

      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      if (imageFile) {
        formData.append('profileImage', imageFile) // send like 'imageUrl' in product page
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      router.push('/')
    } catch (err) {
      console.error(err)
      setMessage(err.response?.data?.message || 'Profile update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fef7f8] flex justify-center items-start px-4 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl border border-pink-200">
        <h2 className="text-2xl font-semibold text-[#e60073] mb-6 border-b border-pink-200 pb-2">
          Complete Your Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              placeholder="E.g. Khyati"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="E.g. khyati@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        {/* Profile Image Upload */}
        <div className="mt-6">
          <label className="block text-sm text-gray-700 mb-1">Upload Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profileImageUpload"
          />
          <label
            htmlFor="profileImageUpload"
            className="inline-block mt-1 px-5 py-2 bg-[#e60073] text-white rounded-md cursor-pointer hover:bg-pink-700 transition"
          >
            Select Image
          </label>

          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-full border"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-8 bg-[#e60073] hover:bg-pink-700 text-white px-6 py-3 rounded-md transition"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </div>
    </div>
  )
}
