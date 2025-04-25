import { Verified } from "lucide-react";

export const Features = () => {
  return (
    <section className="py-16 bg-forest-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TreeServe</h2>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
                icon: "✅" ,
                title: "Verified Texas Tree Experts",
                description: "We only list licensed and insured tree service professionals across Texas. Each company is carefully vetted for experience, customer satisfaction, and safety standards to ensure you hire with confidence."
            },
            {
                icon: "📍",
                title: "Local Knowledge, Statewide Coverage",
                description: "From Dallas to Houston, Austin to El Paso, our directory features tree care providers who understand your local climate, soil conditions, and city regulations. Get expert advice from pros who know your neighborhood."
            },
            {
              icon: "⚡",
              title: "Fast Quotes & Easy Contact",
              description: "Skip the search — get connected with top-rated tree services near you in minutes. Whether you need tree trimming, stump grinding, or emergency storm cleanup, we make it simple to get a quick, competitive quote."
            },
            {
              icon: "🛠️",
              title: "Services for Every Need",
              description: "Find specialists for tree removal, pruning, land clearing, arborist reports, and more. Whether you're a homeowner, landlord, or commercial property manager, we’ve got you covered."
            },
            {
                icon: "🌱",
                title: "Your Trusted Resource for Texas Tree Care",
                description: "Find specialists for tree removal, pruning, land clearing, arborist reports, and more. Whether you're a homeowner, landlord, or commercial property manager, we’ve got you covered."
            },
        ].map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};