// // components/CartDrawer.js
// import { useEffect, useState } from 'react'
// import { useCart } from '../context/CartContext'
// import styles from './Cart.module.css'
// import axios from 'axios'
// import { useRouter } from 'next/router'

// export default function CartDrawer() {
//   const [mounted, setMounted] = useState(false)
//   const router = useRouter()
  
//   const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart()

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

//   // const placeOrder = async (cart, token) => {
//   //   const items = cart.map(item => ({
//   //     productId: String(item.id),
//   //     quantity: item.quantity,
//   //   }))

//   //   const res = await axios.post('http://localhost:4007/order/createOrder',
//   //     {
//   //       items,
//   //       shippingAddress: "Default Address, Abu Road, Rajasthan, India" // Add this
//   //     }, {
//   //     headers: {
//   //       Authorization: `Bearer ${token}`
//   //     }
//   //   })

//   //   return res.data.result
//   // }

//   const handleCheckout = () => {
//     setIsCartOpen(false)
//     router.push('/checkout')
//   }

//   return (
//     <div className={`${styles.cartDrawer} ${isCartOpen ? styles.open : ''}`}>
//       <div className={styles.header}>
//         <h2>Shopping Bag</h2>
//         <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>✕</button>
//       </div>

//       {cart.length === 0 ? (
//         <p className={styles.empty}>Your cart is empty.</p>
//       ) : (
//         <div className={styles.body}>
//           {cart.map(item => (
//             <div key={item.id} className={styles.item}>
//               <img src={item.imageUrl} alt={item.name} className={styles.image} />
//               <div className={styles.details}>
//                 <h4>{item.name}</h4>
//                 <p>Rs. {item.price}</p>
//                 <div className={styles.controls}>
//                   <input
//                     type="number"
//                     value={item.quantity}
//                     min={1}
//                     onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
//                   />
//                   <button onClick={() => removeFromCart(item.id)}>Remove</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <hr className={styles.separator} />
//           <div className={styles.total}>
//             <h3>Estimated Total:</h3>
//             <p>Rs. {total.toFixed(2)}</p>
//           </div>
//           <div className={styles.actions}>
//             <button onClick={clearCart} className={styles.clear}>Clear Cart</button>
//             <button className={styles.checkout} onClick={handleCheckout}>Checkout</button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
