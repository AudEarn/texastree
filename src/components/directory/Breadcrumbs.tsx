'use client'

import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbsProps {
  city?: string;
}

export const Breadcrumbs = ({ city="" }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link href="/" className="hover:text-forest-600">Home</Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/directory" className="hover:text-forest-600">Directory</Link>
      {city && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-forest-600">{city}, TX</span>
        </>
      )}
    </nav>
  );
};