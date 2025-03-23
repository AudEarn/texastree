'use client'

import Link from "next/link";


interface AlphabeticalCitiesListProps {
  cities: string[];
  searchQuery: string;
}

export const AlphabeticalCitiesList = ({ cities = [], searchQuery }: AlphabeticalCitiesListProps) => {
  if (!cities || cities.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-8">
        No cities found. Please check back later.
      </p>
    );
  }

  // Filter cities based on search query (case-insensitive)
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredCities.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-8">
        No cities found matching your search.
      </p>
    );
  }

  // Group cities by first letter
  const citiesByLetter = filteredCities.reduce((acc: { [key: string]: string[] }, city) => {
    const firstLetter = city.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(city);
    return acc;
  }, {});

  // Get all letters and sort them
  const letters = Object.keys(citiesByLetter).sort();

  // Split letters into smaller chunks for better rendering
  const chunkSize = 3;
  const letterChunks = Array.from({ length: Math.ceil(letters.length / chunkSize) }, (_, i) =>
    letters.slice(i * chunkSize, (i + 1) * chunkSize)
  );

  return (
    <div className="max-w-7xl mx-auto">
      {letterChunks.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {chunk.map((letter) => (
            <div key={letter} className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-2xl font-bold text-forest-600 mb-3">{letter}</h2>
              <ul className="space-y-1.5">
                {citiesByLetter[letter].sort().map((city) => (
                  <li key={city}>
                    <Link
                      href={`/directory/${city}`}
                      className="text-gray-700 hover:text-forest-600 hover:underline block py-0.5 text-sm"
                    >
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      <p className="text-sm text-gray-500 text-center mt-4">
        Showing {filteredCities.length} out of {cities.length} total cities
      </p>
    </div>
  );
};