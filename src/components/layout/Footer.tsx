'use client'
import Link from "next/link";


export function Footer() {
  const popularCities = ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso"];
  
  return (
    <footer className="bg-forest-600 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-merriweather font-bold mb-4">TreeServe</h3>
            <p className="text-forest-100">Your trusted directory for professional tree services across Texas.</p>
          </div>
          <div>
            <h4 className="font-merriweather font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/directory" className="hover:text-forest-200">Tree Service Directory</Link></li>
              <li><Link href="/blog" className="hover:text-forest-200">Tree Care Blog</Link></li>
              <li><Link href="/claim-listing" className="hover:text-forest-200">List Your Tree Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-merriweather font-bold mb-4">Popular Texas Cities</h4>
            <ul className="space-y-2">
              {popularCities.map(city => (
                <li key={city}>
                  <Link href={`/directory/${city}`} className="hover:text-forest-200">
                    Tree Services in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-merriweather font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>Email: contact@treeserve.com</li>
              <li>Phone: (555) 123-4567</li>
              <li className="mt-4">
                <Link href="/directory" className="hover:text-forest-200">
                  Find Tree Services Near You
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-forest-500">
          <p className="text-center text-forest-100">
            &copy; {new Date().getFullYear()} TreeServe - Texas Tree Service Directory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}