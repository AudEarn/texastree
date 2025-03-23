import { CityButton } from "./CityButton";

interface CitiesGridProps {
  cities: string[] | undefined;
  searchQuery: string;
}

export const CitiesGrid = ({ cities = [], searchQuery }: CitiesGridProps) => {
  if (!cities || cities.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-8">
        No cities found. Please check back later.
      </p>
    );
  }

  // Filter cities based on search query (case-insensitive)
  const filteredCities = cities
    .filter(cityName => 
      cityName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b));

  if (filteredCities.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-8">
        No cities found matching your search.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {filteredCities.map((cityName) => (
          <CityButton key={cityName} cityName={cityName} />
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        Showing {filteredCities.length} out of {cities.length} total cities
      </p>
    </div>
  );
};