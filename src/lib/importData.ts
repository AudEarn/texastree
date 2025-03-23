import { importCompanies } from './importCompanies'

// Company data from JSON
export const companiesData = [
  {
    "Company Name": "Bartlett Tree Experts",
    "City": "Dallas",
    "State": "TX",
    "Address": "11376 Kline Dr",
    "Phone": "(972) 620-0073",
    "Website": "https://www.bartlett.com/locations/Dallas-TX.cfm",
    "Google Rating": 3.5,
    "Yelp Rating": null
  }
] // Starting with just one company for testing

// Import the data with status logging
console.log('Starting import of', companiesData.length, 'companies...')
importCompanies(companiesData)
  .then((result) => {
    console.log('Import successful:', result)
    console.log('Total companies imported:', result.length)
  })
  .catch((error) => {
    console.error('Import failed:', error)
  })