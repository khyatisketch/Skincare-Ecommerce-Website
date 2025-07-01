export default function WhyChooseUs() {
    const values = [
      {
        icon: "🌱",
        title: "Clean Ingredients",
        description: "Formulated without parabens, sulfates, or harsh chemicals.",
      },
      {
        icon: "🐰",
        title: "Cruelty-Free",
        description: "Never tested on animals — always ethical & safe.",
      },
      {
        icon: "🧪",
        title: "Derm-Tested",
        description: "Clinically tested for safety and effectiveness.",
      },
      {
        icon: "🚚",
        title: "Free Shipping",
        description: "On all orders over ₹999 across India.",
      },
    ]
  
    return (
      <section className="py-16 bg-gray-50 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us</h2>
          <p className="text-gray-600 mb-12">Skincare that’s kind to your skin, the planet, and your wallet.</p>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {values.map((item, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  