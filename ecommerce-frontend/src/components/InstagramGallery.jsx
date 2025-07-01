import Image from 'next/image'

export default function InstagramGallery() {
  const images = [
    '/gallery/skin1.jpg',
    '/gallery/skin2.webp',
    '/gallery/skin3.webp',
    '/gallery/skin4.webp',
  ]

  return (
    <section className="py-16 bg-white px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">From Our Feed</h2>
        <p className="text-gray-600 mb-10">Get inspired by our skincare community</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <Image
                src={src}
                alt={`Gallery ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
