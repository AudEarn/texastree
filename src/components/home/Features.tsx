export const Features = () => {
  return (
    <section className="py-16 bg-forest-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TreeServe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Verified Professionals",
              description: "All listed businesses are thoroughly vetted for quality and reliability"
            },
            {
              title: "Local Expertise",
              description: "Find tree services that know your area and local regulations"
            },
            {
              title: "Quick Response",
              description: "Connect with professionals ready to help with your tree service needs"
            }
          ].map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};