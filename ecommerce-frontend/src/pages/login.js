'use client';
import { useState } from 'react'
import axios from 'axios'
import "../app/globals.css";
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const router = useRouter()
    const { login } = useAuth()

  const [step] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  

  console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_API_URL);
  const requestOtp = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/request-otp`, { phone })
      setSessionId(res.data.result.sessionId)  // Save sessionId in state
      setMessage('OTP sent!')
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to send OTP')
    }
     finally {
      setLoading(false)
    }
  }

  // During OTP verification:
const verifyOtp = async () => {
  try {
    setLoading(true)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify-otp`, {
      phone,
      code: otp,
      sessionId  // Pass sessionId to backend
    })
    const { token, profileIncomplete } = res.data.result

    localStorage.setItem('token', token)
    login(res.data.result)

    setMessage('Logged in successfully!')

    if (profileIncomplete) {
      router.push('/profile-setup')
    } else {
      const redirectTo = router.query.redirect || '/'
      router.push(redirectTo)
    }
  } catch (err) {
    setMessage(err?.response?.data?.message || 'OTP verification failed')
  } finally {
    setLoading(false)
  }
}

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-lg shadow-lg rounded-3xl px-8 py-10 w-full max-w-md relative">
        
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-[#1a1a1a] text-white flex items-center justify-center text-3xl rounded-full shadow-md">
          👤
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8 mt-4">Login</h2>

        {step === 1 ? (
          <>
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  )
}
