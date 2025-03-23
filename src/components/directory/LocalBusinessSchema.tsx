'use client';

import { useEffect } from 'react';

interface Company {
  id: string;
  business_name: string;
  contact_phone: string | null;
  google_rating: number | null;
  website_url: string | null;
  description: string | null;
  street_address: string | null;
  city: string;
  state: string;
  zip_code: string | null;
}

interface LocalBusinessSchemaProps {
  companies: Company[];
  city: string;
}

export const LocalBusinessSchema = ({ companies, city }: LocalBusinessSchemaProps) => {
  useEffect(() => {
    // Create schema data
    const schemaData = companies.map((company) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `https://treeserve.com/directory/${city}/company/${company.id}`,
      "name": company.business_name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": company.street_address || "",
        "addressLocality": company.city,
        "addressRegion": company.state,
        "postalCode": company.zip_code || "",
        "addressCountry": "US"
      },
      "telephone": company.contact_phone || "",
      "url": company.website_url || `https://treeserve.com/directory/${city}/company/${company.id}`,
      "description": company.description || `Professional tree services in ${company.city}, ${company.state}`,
      "aggregateRating": company.google_rating ? {
        "@type": "AggregateRating",
        "ratingValue": company.google_rating,
        "bestRating": "5",
        "worstRating": "1"
      } : undefined,
      "geo": {
        "@type": "GeoCoordinates",
        "addressCountry": "US",
        "addressRegion": company.state,
        "addressLocality": company.city
      },
      "category": "Tree Service"
    }));

    // Create the script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(script);
    };
  }, [companies, city]);

  // This component doesn't render anything visible
  return null;
};