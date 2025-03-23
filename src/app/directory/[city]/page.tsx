'use client'

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { DirectoryLayout } from "@/components/directory/DirectoryLayout";
import { useParams, useRouter } from "next/navigation";

const DirectoryCity = () => {
  const {city} = useParams();
  console.log({city});

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
        console.log("Starting city fetch...");
        let allCitiesData: string[] = [];
        let lastId: string | null = null;
        let hasMore = true;

        while (hasMore) {
          let query = supabase
            .from('tree_service_companies')
            .select('id, city')
            .not('city', 'is', null)
            .neq('city', '')
            .order('id')
            .limit(100);

          if (lastId) {
            query = query.gt('id', lastId);
          }

          const { data, error } = await query;

          if (error) {
            console.error('Error fetching cities:', error);
            break;
          }

          if (!data || data.length === 0) {
            hasMore = false;
            break;
          }

          const processedChunk = data
            .map(item => item.city?.trim())
            .filter((city): city is string => Boolean(city));

          allCitiesData = [...allCitiesData, ...processedChunk];
          lastId = data[data.length - 1].id;
        }

        const uniqueCitiesMap = new Map<string, string>();
        
        allCitiesData.forEach(city => {
          const lowerCity = city.toLowerCase();
          if (!uniqueCitiesMap.has(lowerCity)) {
            const properCity = city
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
      const query = supabase
        .from("tree_service_companies")
        .select("*")
        .eq("city", city);

      const { data: allCompanies, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;

      const uniqueCompanies = (allCompanies || []).filter(
        (company, index, self) =>
          index === self.findIndex((c) => c.business_name === company.business_name)
      );

      if (sortBy === 'rating') {
        const ratedCompanies = uniqueCompanies.filter(c => c.google_rating !== null);
        const unratedCompanies = uniqueCompanies.filter(c => c.google_rating === null);

        ratedCompanies.sort((a, b) => {
          if (!a.google_rating || !b.google_rating) return 0;
          return sortOrder === 'asc' ? 
            a.google_rating - b.google_rating : 
            b.google_rating - a.google_rating;
        });

        unratedCompanies.sort((a, b) => 
          a.business_name.localeCompare(b.business_name)
        );

        return [...ratedCompanies, ...unratedCompanies];
      } else {
        return uniqueCompanies.sort((a, b) => {
          const comparison = a.business_name.localeCompare(b.business_name);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
      }
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

  console.log(city, allCities);
//   return (<></>);

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

  if (!companies || companies.length === 0) {
    toast({
      title: "No Tree Services Found",
      description: `There are no tree services listed in ${city}. Redirecting to directory...`,
      variant: "destructive",
    });
    setTimeout(() => router.push("/directory"), 2000);
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