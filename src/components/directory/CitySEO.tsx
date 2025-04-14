'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Head from 'next/head';

interface CityPageProps {
  city: string;
}

interface SeoData {
  meta_title: string;
  meta_description: string;
}

export default function CityPage({ city }: CityPageProps) {
  console.log('CityPage rendered for:', city);
  const [seoData, setSeoData] = useState<SeoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSeoData = async () => {
      if (!supabase) {
        toast({
          title: 'Configuration Error',
          description: 'Unable to connect to database. Please try again later.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('city_seo')
          .select('meta_title, meta_description')
          .eq('city', city)
          .single();

        console.log('Supabase SEO response:', { data, error }); // Debug log

        if (error) {
          console.error('Supabase error fetching city SEO:', error);
          toast({
            title: 'Error Loading SEO Data',
            description: `Failed to load SEO data for ${city}.`,
            variant: 'destructive',
          });
          setSeoData(null);
          return;
        }

        setSeoData(data || null);
      } catch (error) {
        console.error('Unexpected error fetching city SEO:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred while loading SEO data.',
          variant: 'destructive',
        });
        setSeoData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeoData();
  }, [city, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{seoData?.meta_title || `Tree Services in ${city}`}</title>
        <meta
          name="description"
          content={seoData?.meta_description || `Find top-rated tree service companies in ${city}.`}
        />
        <link rel="canonical" href={`/directory/${city}`} />
      </Head>

      {/* Uncomment when content is needed */}
      {/* <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{city}</h1>
        <div className="prose max-w-none">
          <p>Discover listings and information about {city}.</p>
        </div>
      </div> */}
    </>
  );
}