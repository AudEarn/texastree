'use client'

import { DirectoryLayout } from "@/components/directory/DirectoryLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DirectoryCity = () => {
  const params = useParams();
  console.log(params);
  const city = typeof params.city === 'string'
    ? decodeURIComponent(params.city)
    : Array.isArray(params.city)
    ? decodeURIComponent(params.city[0])
    : '';
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [allCities, setAllCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('name');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await supabase
          .from('tree_service_companies')
          .select('city')
          .not('city', 'is', null)
          .neq('city', '')
          .order('city');

        if (error) {
          console.error('Error fetching cities:', error);
          setIsLoadingCities(false);
          return;
        }

        const uniqueCitiesMap = new Map<string, string>();

        data.forEach(item => {
          const cityValue = item.city?.trim();
          if (!cityValue) return;

          const lowerCity = cityValue.toLowerCase();
          if (!uniqueCitiesMap.has(lowerCity)) {
            const properCity = cityValue
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            uniqueCitiesMap.set(lowerCity, properCity);
          }
        });

        const uniqueCities = Array.from(uniqueCitiesMap.values()).sort();
        setAllCities(uniqueCities);
        setIsLoadingCities(false);
      } catch (error) {
        console.error('Error in fetchCities:', error);
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ["companies", city, sortBy, sortOrder],
    queryFn: async () => {
      if (!city) return [];

      const query = supabase
        .from("tree_service_companies")
        .select("*")
        .eq("city", city)
        .not('business_name', 'is', null);

      // Apply sorting at database level when possible
      if (sortBy === 'name') {
        query.order('business_name', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'rating') {
        query.order('google_rating', { ascending: sortOrder === 'asc', nullsFirst: sortOrder === 'asc' });
      }

      const { data: allCompanies, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // De-duplicate by business name
      const uniqueBusinessNames = new Set<string>();
      return (allCompanies || []).filter(company => {
        if (!company.business_name || uniqueBusinessNames.has(company.business_name)) {
          return false;
        }
        uniqueBusinessNames.add(company.business_name);
        return true;
      });
    },
    enabled: !!city,
  });

  const handleSort = (column: 'name' | 'rating') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder(column === 'rating' ? 'desc' : 'asc');
    }
  };

  // Add new useEffect for handling empty companies state
  useEffect(() => {
    if (city && !companiesLoading && (!companies || companies.length === 0)) {
      toast({
        title: "No Tree Services Found",
        description: `There are no tree services listed in ${city}. Redirecting to directory...`,
        variant: "destructive",
      });
      const redirectTimer = setTimeout(() => router.push("/directory"), 2000);

      // Cleanup timeout on unmount
      return () => clearTimeout(redirectTimer);
    }
  }, [city, companies, companiesLoading, router, toast]);

  if (!city && (companies?.length === 0)) {
    return (
      <DirectoryLayout
        isLoading={isLoadingCities}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allCities={allCities}
        companies={[]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    );
  }

  if (companiesLoading || isLoadingCities) {
    return <DirectoryLayout
      isLoading={true}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      allCities={allCities}
      companies={[]}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={handleSort}
    />;
  }

  // Remove the toast and redirect logic from here
  if (!companies || companies.length === 0) {
    return <DirectoryLayout
      isLoading={true}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      allCities={allCities}
      companies={[]}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={handleSort}
    />;
  }

  return (
    <DirectoryLayout
      city={city}
      isLoading={false}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      allCities={allCities}
      companies={companies}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={handleSort}
      onBackClick={() => router.push("/directory")}
    />
  );
};

export default DirectoryCity;