'use client'
import Link from 'next/link'
import WishlistButton from './WishListButton'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, rating }) {
  const { addToCart, setIsCartOpen } = useCart()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 20,
        boxShadow: '0 14px 32px rgba(246, 165, 192, 0.15)',
        backgroundColor: '#fff',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
      }}
    >
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', flex: 1 }}>
        <div
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.querySelector('.overlay').style.opacity = 0.15
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.querySelector('.overlay').style.opacity = 0
          }}
        >
          <div style={{ position: 'relative', height: 280, backgroundColor: '#fff0f5' }}>
            <img
              src={Array.isArray(product.imageUrl) ? product.imageUrl[0] : '/placeholder.png'}
              alt={product.name}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
            <div
              className="overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#f6a5c0',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                borderRadius: 20,
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 2,
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                padding: 6,
              }}
            >
              <WishlistButton productId={product.id} />
            </div>
          </div>

          <div style={{ padding: '20px 25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontWeight: 700, fontSize: 20 }}>{product.name}</h3>
            <p style={{ fontSize: 14, color: '#555', flexGrow: 1 }}>
              {product.description?.length > 90 ? product.description.substring(0, 90) + '...' : product.description}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 18, color: '#f48fb1' }}>Rs.{product.price.toFixed(2)}</span>
              <span style={{ fontSize: 13, color: '#aaa', fontWeight: 600 }}>
                {product.category?.name}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {rating && (
        <div style={{ color: '#f5a623', fontWeight: 500, fontSize: '15px', paddingBottom: '20px' }}>
          ⭐️ {rating.averageRating.toFixed(1)}{' '}
          <span style={{ color: '#888', marginLeft: '4px', fontWeight: 400 }}>
            ({rating.reviewCount} reviews)
          </span>
        </div>
      )}

      <button
        disabled={product.stock === 0}
        onClick={() => {
          if (product.stock > 0) {
            addToCart(product)
            setIsCartOpen(true)
          }
        }}
        style={{
          width: '90%',
          margin: '0 auto 20px',
          display: 'block',
          backgroundColor: '#f6a5c0',
          color: 'white',
          border: 'none',
          borderRadius: 14,
          padding: '12px 20px',
          fontSize: 16,
          fontWeight: 600,
          cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
          boxShadow: '0 6px 16px rgba(246, 165, 192, 0.35)',
          opacity: product.stock === 0 ? 0.5 : 1,
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}
