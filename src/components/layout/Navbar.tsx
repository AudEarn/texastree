'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QuickQuoteModal from "../home/QuickQuoteModal";
import { useState } from "react";

export function Navbar() {
    const [showQuoteDialog, setShowQuoteDialog] = useState(false);
      const [selectedCity, setSelectedCity] = useState<string>("");
      const [searchQuery, setSearchQuery] = useState("");
      const [formData, setFormData] = useState<any>(null);
    
      const handleCloseDialog = () => {
        setShowQuoteDialog(false);
        setSelectedCity("");
        setSearchQuery("");
        setFormData(null);
      };
    
      const handleSelectAnotherCity = (currentFormData: any) => {
        setFormData(currentFormData);
        setSelectedCity("");
      };
    
      const handleSubmitSuccess = () => {
        handleCloseDialog();
      };
    
      
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

              variant="outline"
              className="border-forest-600 text-forest-600 hover:bg-forest-50"
              onClick={() => setShowQuoteDialog(true)}
            >
              List Your Business
            </Button>
          </div>
        </div>
      </div>
      <QuickQuoteModal showQuoteDialog={showQuoteDialog} handleCloseDialog={handleCloseDialog} />
    </nav>
  );
}
