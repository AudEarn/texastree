"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useState } from "react";
import QuickQuoteModal from "./QuickQuoteModal";

export const Hero = () => {
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
    <>
      <section className="hero-pattern py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-forest-600 mb-6">
              Find Trusted Tree Services in Texas
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with verified tree service professionals in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-forest-600 text-forest-600 hover:bg-forest-50 min-w-[240px]"
              >
                <Link href="/directory">
                  Select a Tree Service in Your City
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-earth-500 hover:bg-earth-600 min-w-[240px] animate-pulse shadow-lg shadow-earth-500/50 transition-all hover:shadow-earth-500/70"
                onClick={() => setShowQuoteDialog(true)}
              >
                Get a Quick Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

        <QuickQuoteModal showQuoteDialog={showQuoteDialog} handleCloseDialog={handleCloseDialog} />
    </>
  );
};


