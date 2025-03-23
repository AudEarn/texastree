import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-merriweather font-bold text-forest-600">
              TreeServe
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/directory"
              className="text-gray-700 hover:text-forest-600"
            >
              Directory
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-forest-600">
              Blog
            </Link>
            <Button
              asChild
              variant="outline"
              className="border-forest-600 text-forest-600 hover:bg-forest-50"
            >
              <Link href="/claim-listing">List Your Business</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
