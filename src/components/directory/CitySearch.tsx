'use client'

import { Input } from "@/components/ui/input";
import Link from "next/link";

interface CitySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cities: string[];
  onCitySelect: (city: string) => void;
  showSelect?: boolean;
}

export const CitySearch = ({ 
  searchQuery, 
  setSearchQuery, 
  cities = [], 
  onCitySelect,
  showSelect = true 
}: CitySearchProps) => {

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    if (city === "other") {
      onCitySelect(searchQuery);
    } else {
      onCitySelect(city);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search for a city..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-2 border-forest-600 focus-visible:ring-forest-600"
      />
      {showSelect && searchQuery && (
        <div className="max-w-md mx-auto bg-white border-2 border-forest-600 rounded-md shadow-lg">
          <div className="max-h-[300px] overflow-y-auto py-2">
            {filteredCities.map((city) => (
                <Link key={city} href={`/directory/${city}`}>
              <button
                className="w-full px-4 py-2 text-left transition-all duration-300 hover:bg-[#39FF14] hover:text-black hover:font-bold hover:shadow-[0_0_20px_#39FF14] focus:outline-none focus:bg-[#39FF14] focus:text-black focus:font-bold focus:shadow-[0_0_20px_#39FF14]"
                onClick={() => handleCitySelect(city)}
                >
                {city}
              </button>
                  </Link>
            ))}
            {searchQuery && !filteredCities.includes(searchQuery) && (
              <button
                className="w-full px-4 py-2 text-left text-gray-600 italic transition-all duration-300 hover:bg-[#39FF14] hover:text-black hover:font-bold hover:shadow-[0_0_20px_#39FF14] focus:outline-none focus:bg-[#39FF14] focus:text-black focus:font-bold focus:shadow-[0_0_20px_#39FF14]"
                onClick={() => handleCitySelect("other")}
              >
                Use {searchQuery}
              </button>
            )}
          </div>
        </div>
      )}
      <p className="text-sm text-gray-500 text-center mt-2">
        Showing {filteredCities.length} out of {cities.length} total cities
      </p>
    </div>
  );
};