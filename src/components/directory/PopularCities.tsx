'use client'

import Link from "next/link";
import { CityButton } from "./CityButton";

const popularCities = [
  "Houston",
  "Dallas",
  "Austin",
  "San Antonio",
  "Fort Worth",
  "El Paso",
  "Arlington",
  "Corpus Christi"
];

export const PopularCities = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-forest-600 mb-4">
          Popular Texas Cities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {popularCities.map((city) => (
            <CityButton key={city} cityName={city} />
          ))}
        </div>
      </div>
      <div className="prose prose-forest max-w-none">
        <p className="text-gray-600">
          Looking for professional tree services in Texas? Browse our comprehensive directory
          of tree care professionals across major cities like{' '}
          {popularCities.slice(0, -1).map((city, index) => (
            <span key={city}>
              <Link
                href={`/directory/${city}`}
                className="text-forest-600 hover:text-forest-700 no-underline"
              >
                {city}
              </Link>
              {index < popularCities.length - 2 ? ', ' : ''}
            </span>
          ))}
          {' and '}
          <Link
            href={`/directory/${popularCities[popularCities.length - 1]}`}
            className="text-forest-600 hover:text-forest-700 no-underline"
          >
            {popularCities[popularCities.length - 1]}
          </Link>.
          Each city page provides detailed information about local tree service providers,
          including reviews, contact information, and service areas.
        </p>
      </div>
    </div>
  );
};