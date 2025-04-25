import Link from "next/link";
import { Button } from "../ui/button";
import { CityButton } from "../directory/CityButton";

const featuredCities = [
  {
    name: "Houston",
    image: "/images/cities/houston.png",
  },
  {
    name: "Dallas",
    image: "/images/cities/dallas.png",
  },
  {
    name: "Austin",
    image: "/images/cities/austin.png",
  },
];


const popularCities = [
"Houston",
"San Antonio",
"Dallas",
"Austin",
"Fort Worth",
"El Paso",
"Arlington",
"Corpus Christi",
"Plano",
"Lubbock",
"Laredo",
"Alief",
"Irving",
"Garland",
"Frisco",
  ];

export const MostPopulatedCities = () => {
  return (
    <>
    <section className="pt-16 pb-16">
      {/* <section className="py-16 bg-white"> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Texas Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {popularCities.map((city) => (
            <CityButton key={city} cityName={city} isShowImages={false} />
          ))}
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCities.map((city) => (
            <Link
              key={city.name}
              href={`/directory/${city.name}`}
              className="group relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]"
              style={{
                backgroundImage: `url(${city.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
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
        </div> */}
      </div>
    </section>
    </>
  );
};
