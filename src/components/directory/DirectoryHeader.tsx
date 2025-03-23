'use client'

import Link from "next/link";


interface DirectoryHeaderProps {
  city?: string;
  onBackClick?: () => void;
}

export const DirectoryHeader = ({ city, onBackClick }: DirectoryHeaderProps) => (
  <h1 className="text-3xl font-bold text-center text-forest-600 mb-8">
    {city ? (
      <div className="flex items-center justify-between">
        <span>Tree Services in {city}, Texas</span>
        {onBackClick && (
          <Link
            href="/directory"
            className="text-sm text-forest-600 hover:text-forest-700 transition-colors"
          >
            ← Back to Cities
          </Link>
        )}
      </div>
    ) : (
      <>
        <span>Texas Tree Service Directory</span>
        <p className="text-lg font-normal mt-2">
          Find reliable tree services in cities across Texas
        </p>
      </>
    )}
  </h1>
);