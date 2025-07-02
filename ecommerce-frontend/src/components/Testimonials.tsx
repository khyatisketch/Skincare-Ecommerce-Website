export default function Testimonials() {
    const reviews = [
      {
        name: 'Aarushi Mehta',
        quote: 'I’ve tried so many serums, but this one gave me visible glow in 2 weeks. Love it!',
        avatar: '/avatars/user1.jpg',
      },
      {
        name: 'Simran Kaur',
        quote: 'Clean ingredients, cute packaging, and it actually works — what more could I ask for?',
        avatar: '/avatars/user2.png',
      },
      {
        name: 'Tanya Sharma',
        quote: 'I’m on my third bottle already. It’s now a staple in my skincare routine.',
        avatar: '/avatars/user3.jpeg',
      },
      {
        name: 'Nidhi Patel',
        quote: 'Fast shipping, great texture, and no breakouts! Highly recommended.',
        avatar: '/avatars/user4.png',
      },
    ]
  
    return (
      <section className="bg-white py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say 💖</h2>
          <p className="text-gray-600 mb-12">Real people, real results.</p>
  
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-pink-50 p-6 rounded-xl shadow-sm text-left hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <h4 className="font-semibold text-gray-800">{review.name}</h4>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">“{review.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  