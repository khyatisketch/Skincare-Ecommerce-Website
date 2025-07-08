// components/AccountLayout.js
import Link from 'next/link'

export default function AccountLayout({ children, activeTab }) {
  return (
    <div style={{ display: 'flex', fontFamily: "'Helvetica Neue', sans-serif", color: '#222' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        borderRight: '1px solid #eee',
        padding: '24px 16px',
        backgroundColor: '#fff'
      }}>
        <Link href="/orders">
          <div style={{
            backgroundColor: activeTab === 'orders' ? '#ffe3ec' : 'transparent',
            color: activeTab === 'orders' ? '#fa5a7d' : '#555',
            padding: '12px 16px',
            borderRadius: 8,
            fontWeight: 600,
            marginBottom: 12,
            cursor: 'pointer'
          }}>
            🚚 Orders
          </div>
        </Link>

        <Link href="/wishlist">
          <div style={{
            backgroundColor: activeTab === 'wishlist' ? '#f3e8ff' : 'transparent',
            color: activeTab === 'wishlist' ? '#9333ea' : '#555',
            padding: '12px 16px',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            💜 Wishlist
          </div>
        </Link>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '24px',
        backgroundColor: '#fafafa',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  )
}
