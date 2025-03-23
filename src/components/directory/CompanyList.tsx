'use client'

import { CompaniesTable } from "./CompaniesTable";
import { FeaturedListing } from "./FeaturedListing";

interface Company {
  id: string;
  business_name: string;
  contact_phone: string | null;
  contact_email: string | null;
  google_rating: number | null;
  website_url: string | null;
  business_statement: string | null;
  feature_images: string[] | null;
  logo_url: string | null;
  is_verified: boolean;
  featured_in_city: boolean;
  city: string;
}

interface CompanyListProps {
  companies: Company[];
  sortBy: 'name' | 'rating';
  sortOrder: 'asc' | 'desc';
  onSort: (column: 'name' | 'rating') => void;
}

export const CompanyList = ({ companies, sortBy, sortOrder, onSort }: CompanyListProps) => {
  // Find the featured company
  const featuredCompany = companies.find(c => c.featured_in_city);
  
  // Filter out the featured company from the remaining companies
  const remainingCompanies = companies.filter(c => !c.featured_in_city);
  
  // Split into verified and unverified companies
  const verifiedCompanies = remainingCompanies.filter(c => c.is_verified);
  const unverifiedCompanies = remainingCompanies.filter(c => !c.is_verified);

  return (
    <div className="space-y-8">
      {featuredCompany && (
        <div className="mb-8">
          <FeaturedListing business={featuredCompany} />
        </div>
      )}
      
      {/* Always show the verified section */}
      <CompaniesTable
        companies={verifiedCompanies}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        title="Verified Tree Services"
        isVerifiedSection={true}
      />
      
      {unverifiedCompanies.length > 0 && (
        <CompaniesTable
          companies={unverifiedCompanies}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          title="Tree Services"
          isVerifiedSection={false}
        />
      )}
    </div>
  );
};