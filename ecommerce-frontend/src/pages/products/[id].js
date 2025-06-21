import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query

  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState(null) // Track selected main image
  const [relatedProducts, setRelatedProducts] = useState([])
  const token = localStorage.getItem('token'); 

  const [rating, setRating] = useState(5);
const [comment, setComment] = useState('');
const [reviewSubmitting, setReviewSubmitting] = useState(false);
const [reviews, setReviews] = useState([]);

 useEffect(() => {
  if (product?.categoryId && product?.id) {
    const categoryId = String(product.categoryId);
    const exclude = String(product.id);

    console.log('Calling related products with:', { categoryId, exclude });

    axios
      .get(`http://localhost:4007/products/related/${categoryId}?exclude=${exclude}`)
      .then(res => {
        console.log('Related products:', res.data);
        setRelatedProducts(res.data.result?.data || []);
      })
      .catch(err => {
        console.error('Error fetching related products:', err.response?.data || err.message);
        setRelatedProducts([]);
      });
  }
}, [product]);

useEffect(() => {
  if (id) {
    axios.get(`http://localhost:4007/products/${id}/getReviews`)
      .then(res => {
        const fetchedReviews = res.data?.result?.reviews || [];
        setReviews(fetchedReviews);
      })
      .catch(err => {
        console.error('Failed to fetch reviews:', err);
        setReviews([]); // fallback
      });
  }
}, [id]);


const submitReview = async () => {
  try {
    setReviewSubmitting(true);
    await axios.post(`http://localhost:4007/products/${id}/reviews`, {
      rating,
      comment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Reset form
    setRating(5);
    setComment('');

    // Optionally, refetch reviews or show a success toast
    const res = await axios.get(`http://localhost:4007/products/${id}/getReviews`);
    const fetchedReviews = res.data?.result?.reviews || [];
    setReviews(fetchedReviews);
    alert("Review submitted!");
  } catch (err) {
    console.error("Failed to submit review:", err);
    alert("Failed to submit review. Please try again.");
  } finally {
    setReviewSubmitting(false);
  }
};


  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:4007/products/product/${id}`)
        .then(res => {
          const data = res.data.result
          console.log('Product:', data);
          setProduct(data)
          setMainImage(data.imageUrl?.[0] || null) // Set default main image
          setLoading(false)
        })
        .catch(() => {
          setError('Product not found')
          setLoading(false)
        })
    }
  }, [id])

  if (loading) return <p className="text-center p-10">Loading...</p>
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* TOP: Product Section */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* LEFT: Product Info */}
        <div className="col-span-2 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nourishing lip balm</p>
          <div className="flex items-center gap-1">
          {'⭐'.repeat(5)} <span className="text-sm text-gray-600">({product.ratingCount || '9525'})</span>
          </div>
  
          {/* Price */}
            <button className="mt-4 bg-black text-white px-8 py-3 rounded-full text-sm tracking-wide hover:bg-gray-800 transition">
              Add to Bag - ₹{product.price}
            </button>
  
          {/* Description */}
          <div className="mt-6 space-y-1 text-sm">
    <p className="font-semibold text-gray-700 dark:text-gray-300">Product Description:</p>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
  </div>
  
          {/* Features */}
          <div className="flex gap-10 text-sm mt-6 border-t pt-4">
    <div><p className="font-semibold">Moisturizing</p></div>
    <div><p className="font-semibold">Nourishing</p></div>
  </div>
        </div>
  
        {/* CENTER: Main Image + Right-side Thumbnails */}
<div className="flex flex-col items-center justify-center w-full">
  <div className="flex flex-wrap md:flex-nowrap gap-6 items-center justify-center">
    {/* Main Product Image */}
    <div className="flex-1">
      <img
        src={mainImage}
        alt={product.name}
        className="w-full max-w-md aspect-square object-cover rounded-2xl shadow-lg mx-auto"
      />
    </div>

    {/* Thumbnails Next to It */}
    <div className="flex md:flex-col gap-4">
      {product.imageUrl?.map((img, idx) => (
        <img
          key={idx}
          src={img}
          onClick={() => setMainImage(img)}
          alt={`Thumbnail ${idx + 1}`}
          className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer ${
          mainImage === img ? 'border-black' : 'border-gray-300'
          }`}
        />
      ))}
    </div>
  </div>
</div>

  
        {/* RIGHT Column – leave blank or use for extra info if needed */}
      </div>
      <br/>

      <div className="mt-10 lg:mt-0">
  <div className="border p-6 rounded-xl shadow-md bg-gray-50 dark:bg-gray-800">
    <h3 className="font-semibold text-lg mb-2">Why Customers Love Us</h3>
    <ul className="list-disc text-sm pl-5 text-gray-700 dark:text-gray-300 space-y-1">
      <li>🚚 Free shipping over ₹500</li>
      <li>💸 30-day money-back guarantee</li>
      <li>🧴 Dermatologist tested</li>
    </ul>
  </div>
</div>

<div className="mt-20 border-t pt-10">
  <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
  <div className="space-y-4 max-w-lg">
    <div>
      <label className="block text-sm font-medium">Rating</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="mt-1 w-full border p-2 rounded"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r !== 1 ? 's' : ''}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium">Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows="4"
        className="mt-1 w-full border p-2 rounded"
        placeholder="Write your review here..."
      />
    </div>

    <button
      onClick={submitReview}
      disabled={reviewSubmitting}
      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
    >
      {reviewSubmitting ? "Submitting..." : "Submit Review"}
    </button>
  </div>
</div>

<div className="mt-10">
  <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
  {reviews.length === 0 ? (
    <p className="text-sm text-gray-500">No reviews yet.</p>
  ) : (
    <div className="space-y-4">
      {reviews.map((rev, idx) => (
        <div key={idx} className="border p-4 rounded bg-white dark:bg-gray-800">
          <p className="text-sm">{'⭐'.repeat(rev.rating)}</p>
          <p className="text-sm mt-1">{rev.comment}</p>
          <p className="text-xs text-gray-500 mt-1">By {rev.user?.name || 'Anonymous'}</p>
        </div>
      ))}
    </div>
  )}
</div>


  
      {/* BOTTOM: Products You May Like Section */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold mb-6">Products You May Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
  <div
    key={product.id}
    onClick={() => router.push(`/products/${product.id}`)}
    className="border rounded-xl p-4 bg-white dark:bg-gray-800 hover:shadow-lg transition cursor-pointer"
  >
    <img
      src={product.imageUrl?.[0]}
      alt={product.name}
      className="h-40 w-full object-cover rounded-lg md-2"
    />
    <h3 className="text-sm font-medium">{product.name}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">₹{product.price}</p>
  </div>
))}

        </div>
      </div>
    </div>
  )
  
}
