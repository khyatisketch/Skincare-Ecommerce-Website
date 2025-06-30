'use client'
import { useUser } from '@/context/UserContext'
import Image from 'next/image'

export default function ProfilePage() {
  const { user } = useUser()

  if (!user) return <div className="p-6 text-center text-gray-500">Loading...</div>

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 relative">
          <Image
            src={user.profileImageUrl || '/default-avatar.png'}
            alt="Profile picture"
            layout="fill"
            className="rounded-full object-cover border-4 border-pink-100 shadow-sm"
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium text-gray-700">Email:</span> {user.email}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium text-gray-700">Mobile:</span> {user.phone || 'N/A'}
          </p>
          <p className="text-sm text-green-600 font-medium mt-2">✓ Verified</p>
        </div>
      </div>
    </div>
  )
}
