'use client'

import { ArrowRight, CheckCircle, Clock, PhoneCall } from "lucide-react";
import { CompaniesTable } from "./CompaniesTable";
import { FeaturedListing } from "./FeaturedListing";
import { useState } from "react";


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
    const [formData, setFormData] = useState({
        email: '',
      });
      const [isSubmitted, setIsSubmitted] = useState(false);
    const featuredCompany = companies.find(c => c.featured_in_city);
    
    // Filter out the featured company from the remaining companies
  const remainingCompanies = companies.filter(c => !c.featured_in_city);
  
  // Split into verified and unverified companies
  const verifiedCompanies = remainingCompanies.filter(c => c.is_verified);
  const unverifiedCompanies = remainingCompanies.filter(c => !c.is_verified);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically send data to backend
  };

console.log(featuredCompany)

  return (
    <div className="space-y-8">
      {featuredCompany && (
        <div className="mb-8">
          <FeaturedListing business={featuredCompany} />
        </div>
      )}

      
    <div className="w-full mx-auto my-8 overflow-hidden rounded-lg shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
      {/* Attention-grabbing header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6">
        <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 rounded-full bg-yellow-400 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 rounded-full bg-green-800 opacity-20"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl animate-pulse">
              Need Help With Tree Service in {featuredCompany?.city}?
            </h2>
            <p className="text-xl font-semibold flex items-center">
              <CheckCircle className="mr-2 h-6 w-6" /> Get a FREE Quote Quickly from a Tree Service Pro!
            </p>
            <div className="flex items-center space-x-4 text-sm md:text-base">
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4" /> Quick Response
              </span>
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4" /> Licensed Experts
              </span>
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4" /> 100% Free Quote
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <div className="absolute inset-0 bg-green-400 rounded-full opacity-20"></div>
              <div className="text-green-600 font-bold text-center">
                <PhoneCall className="mx-auto h-8 w-8" />
                <span className="text-sm">Call Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6 md:flex ">
        <div className="md:w-1/2 mx-auto md:pr-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
              >
                Get Your FREE Quote Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting, you agree to be contacted about tree services.
              </p>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-2xl font-bold text-gray-800">Quote Request Sent!</h3>
              <p className="mt-2 text-gray-600">A tree service professional will contact you shortly with your free quote.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-6 px-4 py-2 text-sm text-green-600 underline"
              >
                Submit another request
              </button>
            </div>
          )}
        </div>
      
      </div>
      
      <div className="bg-green-700 text-white px-6 py-3 text-center font-medium">
        <p className="animate-pulse">Limited Time: 10% OFF for First-Time Customers • Call Now!</p>
      </div>
    </div>
      
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