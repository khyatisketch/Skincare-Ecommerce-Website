'use client'
import { useUser } from '@/context/UserContext'
import Image from 'next/image'
// import Link from 'next/link'

export default function ProfilePage() {
  const { user } = useUser()

  if (!user) return <div className="p-6 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center gap-4">
          <Image
            src={user.profileImageUrl || '/default-avatar.png'}
            alt="Profile picture"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">
              Email: <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-sm text-gray-600">
              Mobile: <span className="font-medium">{user.phone || 'N/A'}</span>
            </p>
            {/* <p className="text-sm text-gray-600">
              Date of Birth: <span className="font-medium">{user.dob || 'N/A'}</span>
            </p> */}
            <p className="text-sm text-green-500 font-medium">Verified</p>
          </div>
        </div>

      </div>
    </div>
  )
}
