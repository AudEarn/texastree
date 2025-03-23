'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Head from 'next/head'

interface CityPageProps {
  city: string;
}

interface SeoData {
  meta_title: string
  meta_description: string
}

export default function CityPage({ city }: CityPageProps) {
  console.log("this is citypage", city)
  const [seoData, setSeoData] = useState<SeoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize Supabase client
  // Use explicit string values for environment variables to avoid the error
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  useEffect(() => {
    // Only create the client if we have the necessary values
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing")
      setIsLoading(false)
      return
    }
    
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
    
    async function fetchSeoData() {
      try {
        const { data, error } = await supabase
          .from('city_seo')
          .select('meta_title, meta_description')
          .eq('city', city)
          .single()

        if (error) {
          console.error('Error fetching city SEO:', error)
          return
        }

        setSeoData(data)
      } catch (error) {
        console.error('Error fetching city SEO:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeoData()
  }, [city, supabaseUrl, supabaseAnonKey])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{seoData?.meta_title || `Directory - ${city}`}</title>
        <meta
          name="description"
          content={seoData?.meta_description || `Find listings in ${city}`}
        />
        <link rel="canonical" href={`/directory/${city}`} />
      </Head>

      {/* <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{city}</h1>
        <div className="prose max-w-none">
          <p>Discover listings and information about {city}.</p>
        </div>
      </div> */}
    </>
  )
}