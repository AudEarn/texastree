import { supabase } from "@/integrations/supabase/client"

export async function importCompanies(companiesData: any[]) {
  try {
    console.log(`Attempting to import ${companiesData.length} companies...`)
    
    // Transform the data to match our database schema
    const transformedData = companiesData.map(company => ({
      business_name: company["Company Name"],
      contact_phone: company["Phone"],
      website_url: company["Website"],
      street_address: company["Address"],
      city: company["City"],
      state: company["State"],
      google_rating: company["Google Rating"],
      yelp_rating: company["Yelp Rating"],
      verification_status: 'unverified',
      is_featured: false
    }))

    // Insert the data in batches of 50 to avoid timeout issues
    const batchSize = 50
    const batches = []
    
    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize)
      batches.push(batch)
    }

    console.log(`Split into ${batches.length} batches of ${batchSize} companies each`)

    const results = []
    for (let i = 0; i < batches.length; i++) {
      console.log(`Importing batch ${i + 1} of ${batches.length}...`)
      const { data, error } = await supabase
        .from('tree_service_companies')
        .insert(batches[i])
        .select()

      if (error) {
        console.error(`Error importing batch ${i + 1}:`, error)
        throw error
      }

      results.push(data)
      console.log(`Successfully imported batch ${i + 1}`)
    }

    console.log('All batches imported successfully')
    return results.flat()

  } catch (error) {
    console.error('Error importing companies:', error)
    throw error
  }
}