import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useCart } from '../context/CartContext'
import { useSearchParams } from 'next/navigation'


export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [addedProductId, setAddedProductId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  // const [productReviews, setProductReviews] = useState({});
  const [ratings, setRatings] = useState({});

  const { addToCart, setIsCartOpen } = useCart()


  const limit = 10;
  const searchParams = useSearchParams();

  // Fetch categories once on mount
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories/getAllCategories`)
      .then(res => {
        const fetchedCategories = res.data.result.data;
        setCategories(fetchedCategories);
  
        const categorySlug = searchParams.get('category');
        if (categorySlug) {
          const matchedCategory = fetchedCategories.find(cat =>
            cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
          );
          if (matchedCategory) {
            setCategoryId(matchedCategory.id.toString());
          }
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
  }, []);


  // Fetch products whenever filters or page changes
  useEffect(() => {
    const params = {
      page,
      limit,
      search: search || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    };
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/getAllProducts`, { params })
      .then(res => {
        setProducts(res.data.result.data || []);
        setTotalPages(res.data.result.totalPages || 1);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      });
  }, [page, search, categoryId, minPrice, maxPrice]);

  useEffect(() => {
    async function fetchRatings() {
      const allRatings = {};
  
      for (const p of products) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/avgRating`, { productId: p.id },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          allRatings[p.id] = res.data.result;
          console.log('Response:', res.data.result);
        } catch (err) {
          console.error('Error fetching rating:', err);
        }
      }

  
      setRatings(allRatings);
    }
  
    if (products.length) fetchRatings();
  }, [products]);

  useEffect(() => {
    if (addedProductId) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [addedProductId]);
  

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <>
      {/* Import Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=Roboto&display=swap');
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            background: #fff;
            color: #333;
            font-family: 'Roboto', sans-serif;
          }
          h1, h3 {
            font-family: 'Montserrat', sans-serif;
            color: #222;
          }
          ::placeholder {
            color: #bbb;
          }
          button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }
        `}
      </style>

      <div style={{ maxWidth: 1280, margin: '50px auto', padding: '0 30px' }}>

        <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 40, letterSpacing: '0.05em' }}>
          Shop Our Products
        </h1>

        {/* Filters */}
        <form
          onSubmit={handleFilterSubmit}
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            marginBottom: 50,
            position: 'sticky',
            top: 20,
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 10px 20px rgba(246, 165, 192, 0.15)',
            zIndex: 10,
          }}
        >
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flexGrow: 1,
              minWidth: 250,
              padding: '14px 18px',
              borderRadius: 14,
              border: '1.8px solid #f6a5c0',
              fontSize: 17,
              outlineColor: '#f6a5c0',
              transition: 'border-color 0.3s ease',
              fontWeight: 400,
              color: '#444',
            }}
          />

          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            style={{
              padding: '14px 18px',
              borderRadius: 14,
              border: '1.8px solid #f6a5c0',
              fontSize: 17,
              color: categoryId ? '#444' : '#bbb',
              cursor: 'pointer',
              minWidth: 180,
              fontWeight: 500,
              transition: 'border-color 0.3s ease',
            }}
          >
            <option value="" disabled>
              All Categories
            </option>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            min={0}
            style={{
              width: 110,
              padding: '14px 18px',
              borderRadius: 14,
              border: '1.8px solid #f6a5c0',
              fontSize: 17,
              color: '#444',
              fontWeight: 400,
              outlineColor: '#f6a5c0',
              transition: 'border-color 0.3s ease',
            }}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            min={0}
            style={{
              width: 110,
              padding: '14px 18px',
              borderRadius: 14,
              border: '1.8px solid #f6a5c0',
              fontSize: 17,
              color: '#444',
              fontWeight: 400,
              outlineColor: '#f6a5c0',
              transition: 'border-color 0.3s ease',
            }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: '#f6a5c0',
              border: 'none',
              borderRadius: 14,
              padding: '14px 35px',
              color: 'white',
              fontSize: 17,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(246, 165, 192, 0.4)',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#ee8db8'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(238, 141, 184, 0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#f6a5c0'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(246, 165, 192, 0.4)'
            }}
          >
            Filter
          </button>
        </form>

        {/* Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 35,
          }}
        >
          {products.map(p => (

            <div
              key={p.id}
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
              <Link href={`/products/${p.id}`} style={{ textDecoration: 'none', flex: 1 }}>
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
                      src={Array.isArray(p.imageUrl) ? p.imageUrl[0] : '/placeholder.png'}
                      alt={p.name}
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
                  </div>

                  {/* Content Wrapper */}
                  <div style={{ padding: '20px 25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 20 }}>{p.name}</h3>
                    <p style={{ fontSize: 14, color: '#555', flexGrow: 1 }}>
                      {p.description?.length > 90 ? p.description.substring(0, 90) + '...' : p.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 12,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 18, color: '#f48fb1' }}>Rs.{p.price.toFixed(2)}</span>
                      <span style={{ fontSize: 13, color: '#aaa', fontWeight: 600 }}>
                        {p.category?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              {/* Add to Cart Button */}
              {/* {p.stock === 0 && (
  <span
    style={{
      color: '#fff',
      backgroundColor: '#f44336',
      padding: '6px 12px',
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 600,
      width: 'fit-content',
      margin: '0 auto 10px',
    }}
  >
    Out of Stock
  </span>
)} */}

{ratings[p.id] && (
  <div style={{ color: '#f5a623', fontWeight: 500, fontSize: '15px', paddingBottom: '20px' }}>
    ⭐️ {ratings[p.id].averageRating.toFixed(1)} 
    <span style={{ color: '#888', marginLeft: '4px', fontWeight: 400 }}>
    ({ratings[p.id].reviewCount} reviews)
    </span>
  </div>
)}

{/* <div style={{ color: '#f5a623', fontWeight: 500, fontSize: '15px' }}>
  ⭐️ {ratings[product.id].averageRating.toFixed(1)} 
  <span style={{ color: '#888', marginLeft: '4px', fontWeight: 400 }}>
    ({ratings[product.id].reviewCount} reviews)
  </span>
</div> */}

              {/* Reviews Section
              <div
  style={{
    padding: '10px 25px 20px',
    borderTop: '1px solid #f2f2f2',
    marginTop: 10,
  }}
>
  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#555' }}>
    Reviews
  </h4>
  <div style={{margin: '10px 0'}}>

  {productReviews[p.id]?.length > 0 ? (
      productReviews[p.id].slice(0, 2).map(review => (
        <div
          key={review.id}
          style={{
            backgroundColor: '#fafafa',
            border: '1px solid #eee',
            padding: 8,
            borderRadius: 6,
            marginBottom: 6,
            fontSize: 12,
          }}
        >
          <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>
            ⭐ {review.rating}/5
          </p>
          {/* <p style={{ marginBottom: 4 }}>⭐ {review.rating}/5</p> */}
          {/* <p style={{ marginBottom: 2 }}>{review.comment}</p>
          <p style={{ fontSize: 11, color: '#888' }}>By user #{review.userId}</p>
        </div>
      ))
  ) : (
    <p style={{ fontSize: 13, color: '#aaa' }}>No reviews yet.</p>
  )}
  </div>
</div> */}
<button
                disabled={p.stock === 0}
                onClick={() => {
                  if (p.stock > 0) {
                    addToCart(p);
                    setAddedProductId(p.id);
                    setAddedProductId(p.id);  
                    setTimeout(() => setAddedProductId(null), 2000);
                    setTimeout(() => setShowNotification(false), 3000);
                    setIsCartOpen(true);
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
                  cursor: p.stock === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 16px rgba(246, 165, 192, 0.35)',
                  opacity: p.stock === 0 ? 0.5 : 1,
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  if (p.stock > 0) {
                    e.currentTarget.style.backgroundColor = '#ee8db8';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(238, 141, 184, 0.5)';
                  }
                }}
                onMouseLeave={e => {
                  if (p.stock > 0) {
                    e.currentTarget.style.backgroundColor = '#f6a5c0';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(246, 165, 192, 0.35)';
                  }
                }}
              >
                {p.stock === 0
                  ? 'Out of Stock'
                  : addedProductId === p.id
                    ? 'Added!'
                    : 'Add to Cart'}
              </button>

            </div>
          ))}
          {/* Pagination */}
          <div
            style={{
              marginTop: 60,
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
            }}
          >
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                padding: '12px 30px',
                borderRadius: 16,
                border: '2px solid #f6a5c0',
                backgroundColor: page === 1 ? '#fff0f5' : '#fff',
                color: '#f6a5c0',
                fontWeight: 600,
                fontSize: 16,
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={e => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#f6a5c0'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#fff'
                  e.currentTarget.style.color = '#f6a5c0'
                }
              }}
            >
              Previous
            </button>

            <span
              style={{
                fontSize: 17,
                color: '#444',
                lineHeight: '40px',
                fontWeight: 500,
                letterSpacing: '0.05em',
              }}
            >
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                padding: '12px 30px',
                borderRadius: 16,
                border: '2px solid #f6a5c0',
                backgroundColor: page === totalPages ? '#fff0f5' : '#fff',
                color: '#f6a5c0',
                fontWeight: 600,
                fontSize: 16,
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={e => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#f6a5c0'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#fff'
                  e.currentTarget.style.color = '#f6a5c0'
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
        {showNotification && (
 <div
 style={{
   position: 'fixed',
   top: 20,
   left: '50%',
   transform: 'translateX(-50%)',
   backgroundColor: '#f6a5c0',
   color: '#fff',
   padding: '12px 24px',
   borderRadius: '10px',
   boxShadow: '0 6px 16px rgba(246, 165, 192, 0.35)',
   fontSize: '14px',
   fontWeight: 600,
   zIndex: 1000,
   opacity: showNotification ? 1 : 0,
   pointerEvents: 'none',
   transition: 'opacity 0.5s ease-in-out',
 }}
>
 Added to cart!
</div>

)}

      </div>
    </>
  )
}
