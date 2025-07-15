'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <AdminSettings />
    </AdminLayout>
  )
}

function AdminSettings() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profileImageUrl: '',
    phone: '',
    role: ''
  })

  const [profilePreview, setProfilePreview] = useState(null)
  const [newImageFile, setNewImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  // Fetch profile on load
  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          const user = data.result
          setProfile({
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            phone: user.phone,
            role: user.role
          })
          setProfilePreview(user.profileImageUrl || null)
        }
      })
  }, [])

  // Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewImageFile(file)
      setProfilePreview(URL.createObjectURL(file))
    }
  }

  // Save profile
  const handleSave = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('name', profile.name)
    formData.append('email', profile.email)
    if (newImageFile) {
      formData.append('profileImage', newImageFile)
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()

      if (data?.result?.user) {
        const updatedUser = data.result.user
        setProfile({
          name: updatedUser.name,
          email: updatedUser.email,
          profileImageUrl: updatedUser.profileImageUrl,
          phone: updatedUser.phone,
          role: updatedUser.role,
        })
        setProfilePreview(updatedUser.profileImageUrl || null)
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile.')
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert('Error saving profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full py-6 px-4 md:px-0">
      <h1 className="text-4xl font-semibold text-gray-800 mb-10">Admin Settings</h1>

      <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl space-y-6">
        {/* Profile Image Preview */}
        {profilePreview && (
          <div className="flex justify-center">
            <img
              src={profilePreview}
              alt="Profile"
              className="w-24 h-24 rounded-full border object-cover"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="you@example.com"
          />
        </div>

        {/* Optional: Read-only phone and role */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Phone (readonly)</label>
          <input
            value={profile.phone}
            readOnly
            className="w-full bg-gray-100 text-gray-500 border border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
          <input
            value={profile.role}
            readOnly
            className="w-full bg-gray-100 text-gray-500 border border-gray-200 rounded-xl px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl px-6 py-2 text-sm"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
