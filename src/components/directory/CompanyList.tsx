"use client";

import { ArrowRight, CheckCircle, PhoneCall } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import bbImg from "../../../public/images/cities/1.png";
import liImg from "../../../public/images/cities/2.png";
import quoteImg from "../../../public/images/cities/quote-img.jpg";
import { CompaniesTable } from "./CompaniesTable";
import { FeaturedListing } from "./FeaturedListing";
import { QuoteRequestForm } from "./QuoteRequestForm";

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
  sortBy: "name" | "rating";
  sortOrder: "asc" | "desc";
  onSort: (column: "name" | "rating") => void;
}

interface FormData {
  serviceType: string;
  serviceUrgency: string;
  propertyType: string;
  city: string;
  zipCode: string;
  name: string;
  email: string;
  phone: string;
  photo: File | null;
}

export const CompanyList = ({
  companies,
  sortBy,
  sortOrder,
  onSort,
}: CompanyListProps) => {
  // Find the featured company
  const [formData, setFormData] = useState({
    email: "",
    zip: "",
  });

  console.log(formData)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const featuredCompany = companies.find((c) => c.featured_in_city);

  // Filter out the featured company from the remaining companies
  const remainingCompanies = companies.filter((c) => !c.featured_in_city);

  // Split into verified and unverified companies
  const verifiedCompanies = remainingCompanies.filter((c) => c.is_verified);
  const unverifiedCompanies = remainingCompanies.filter((c) => !c.is_verified);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically send data to backend
  };

  const handleQuoteSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      const result = await response.json();
      console.log("Quote submitted successfully:", result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting quote:", error);
      // You might want to show an error message to the user here
      alert("Failed to submit quote. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {featuredCompany && (
        <div className="mb-8">
          <FeaturedListing business={featuredCompany} />
        </div>
      )}

      <div className="w-full mx-auto my-8 overflow-hidden rounded-lg shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 rounded-full bg-yellow-400 opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 rounded-full bg-green-800 opacity-20"></div>

          <div className="relative flex items-center justify-between text-center">
            <div className="space-y-3">
              <h2 className="text-xl md:text-3xl font-bold leading-tight animate-pulse">
                <span className="bg-white rounded-full aspect-square py-0.5">🌳</span> Find the Best Tree Service in {featuredCompany?.city} — Fast,
                Free, and Trusted!
              </h2>
              <div className="flex flex-col md:flex-row items-center space-x-4 text-sm md:text-base justify-center">
                <p className="text-lg font-semibold flex items-center">
                  <CheckCircle className="mr-2 h-6 w-6" /> Free Quotes
                </p>
                <p className="text-lg font-semibold flex items-center">
                  <CheckCircle className="mr-2 h-6 w-6" />
                  Licensed & Insured Pros
                </p>
                <p className="text-lg font-semibold flex items-center">
                  <CheckCircle className="mr-2 h-6 w-6" />
                  24/7 Emergency Help Available
                </p>
              </div>
              <div className="flex flex-col-reverse md:flex-row gap-2 items-center space-x-4 text-sm md:text-base justify-center">
                <p className="text-lg font-semibold flex items-center">
                  ⭐⭐⭐⭐⭐
                </p>
                <div className="rounded-lg bg-white p-1">
                  <Image
                    src={bbImg}
                    alt={"B"}
                    width={1000}
                    height={1000}
                    quality={1000}
                    className="h-12 w-auto"
                  />
                </div>
                <div className="rounded-lg bg-white p-1">
                  <Image
                    src={liImg}
                    alt={"B"}
                    width={1000}
                    height={1000}
                    quality={1000}
                    className="h-12 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:flex items-center">
          <div className="md:w-1/2 md:pr-8">
            {!isSubmitted ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Detailed Quote Request
                </h3>
                <QuoteRequestForm onSubmit={handleQuoteSubmit} />
                
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h3 className="mt-4 text-2xl font-bold text-gray-800">
                  Quote Request Sent!
                </h3>
                <p className="mt-2 text-gray-600">
                  A tree service professional will contact you shortly with your
                  free quote.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-4 py-2 text-sm text-green-600 underline"
                >
                  Submit another request
                </button>
              </div>
            )}
          </div>
          <div className="md:w-1/2 md:pr-8">
            <Image src={quoteImg} alt="quote image" height={500} width={500} className="w-full" />
          </div>
        </div>

        <div className="bg-green-700 text-white px-6 py-3 text-center font-medium">
          <p className="animate-pulse">
            ⚡ Limited slots available — Get fast, affordable help today.
          </p>
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
