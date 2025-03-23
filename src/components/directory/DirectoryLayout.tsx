'use client'

import { Card, CardContent } from "@/components/ui/card";
import { DirectoryHeader } from "./DirectoryHeader";
import { CitySearch } from "./CitySearch";
import { PopularCities } from "./PopularCities";
import { AlphabeticalCitiesList } from "./AlphabeticalCitiesList";
import { CompanyList } from "./CompanyList";
import { LoadingState } from "./LoadingState";
import CitySEO  from "./CitySEO";
import { LocalBusinessSchema } from "./LocalBusinessSchema";
import { Breadcrumbs } from "./Breadcrumbs";

interface DirectoryLayoutProps {
  city?: string;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  allCities: string[];
  companies: any[];
  sortBy: 'name' | 'rating';
  sortOrder: 'asc' | 'desc';
  onSort: (column: 'name' | 'rating') => void;
  onBackClick?: () => void;
}

export const DirectoryLayout = ({
  city,
  isLoading,
  searchQuery,
  setSearchQuery,
  allCities,
  companies,
  sortBy,
  sortOrder,
  onSort,
  onBackClick,
}: DirectoryLayoutProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  // Dummy onCitySelect function since we don't need city selection in the directory layout
  const handleCitySelect = (selectedCity: string) => {
    console.log("City selected:", selectedCity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {city && (
        <>
          <CitySEO city={city} />
          <LocalBusinessSchema companies={companies} city={city} />
        </>
      )}
      
      <Breadcrumbs city={city} />
      
      {city ? (
        <Card>
          <CardContent className="pt-6">
            <DirectoryHeader city={city} onBackClick={onBackClick} />
            <CompanyList 
              companies={companies}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            
            {/* Local SEO Content Section */}
            <div className="mt-12 prose prose-forest max-w-none">
              <h2>Professional Tree Services in {city}, Texas</h2>
              <p>
                Looking for reliable tree services in {city}? Our directory features top-rated local tree service companies 
                that provide professional tree care, including tree trimming, removal, pruning, and emergency services. 
                Each company listed has been verified to serve the {city} area and many have customer reviews 
                to help you make an informed decision.
              </p>
              
              <h3>Why Choose Local Tree Services in {city}?</h3>
              <ul>
                <li>Local expertise with Texas native trees and vegetation</li>
                <li>Familiar with {city}'s tree ordinances and regulations</li>
                <li>Quick response times for emergency tree services</li>
                <li>Knowledge of local climate and environmental conditions</li>
              </ul>
              
              <h3>Common Tree Services in {city}</h3>
              <ul>
                <li>Tree Removal and Stump Grinding</li>
                <li>Tree Trimming and Pruning</li>
                <li>Emergency Tree Services</li>
                <li>Disease Treatment and Prevention</li>
                <li>Tree Health Assessments</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8">
          <DirectoryHeader />
          <CitySearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            cities={allCities}
            onCitySelect={handleCitySelect}
          />
          <PopularCities />
          <AlphabeticalCitiesList 
            cities={allCities} 
            searchQuery={searchQuery} 
          />
        </div>
      )}
    </div>
  );
};