import '../app/globals.css'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
// import CartDrawer from './cart'
import CartDrawer from '../components/CartDrawer' // ✅ Corrected
import { Toaster } from 'react-hot-toast'
import { UserProvider } from '../context/UserContext'


export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
    <AuthProvider>
      <CartProvider>
      <Toaster position="top-center"
        toastOptions={{
          success: {
            style: {
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              borderRadius: '1rem',
              padding: '16px 20px',
              fontSize: '16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ecfdf5',
            },
          },
        }} />
        <Component {...pageProps} />
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
    </UserProvider>
  )
}
