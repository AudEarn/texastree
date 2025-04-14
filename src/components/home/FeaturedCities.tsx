import Link from "next/link";


const featuredCities = [
  {
    name: "Houston",
    image: "/images/cities/houston.png"
  },
  {
    name: "Dallas",
    image: "/images/cities/dallas.png"
  },
  {
    name: "Austin",
    image: "/images/cities/austin.png"
  }
];

export const FeaturedCities = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCities.map((city) => (
            <Link
              key={city.name}
              href={`/directory/${city.name}`}
              className="group relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]"
              style={{
                backgroundImage: `url(${city.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {city.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};