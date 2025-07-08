import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Link from 'next/link';
import { useCart } from '../context/CartContext'
import { useSearchParams } from 'next/navigation'
// import WishlistButton from '../components/WishListButton'
import ProductCard from '../components/ProductCard'



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

  // ✅ 1. Fetch categories once on mount
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories/getAllCategories`)
      .then(res => {
        setCategories(res.data.result.data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  // ✅ 2. After categories load, match slug in URL to categoryId
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categories.length > 0) {
      const matchedCategory = categories.find(cat =>
        cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
      );
      if (matchedCategory) {
        setCategoryId(matchedCategory.id.toString());
      }
    }
  }, [categories, searchParams]);


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
  <ProductCard key={p.id} product={p} rating={ratings[p.id]} />
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
