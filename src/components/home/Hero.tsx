"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Link from "next/link";
import { useState } from "react";

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

      <Dialog open={showQuoteDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] bg-[#bed6fb] p-0 overflow-hidden">
          <DialogHeader className="p-0">
            <div className="w-full h-60 overflow-hidden">
              <Image
                height={300}
                width={300}
                src="https://texastreeservicedirectory.com/lovable-uploads/dd0aeb9a-2604-45fd-a461-1e2ee5d2df5c.png"
                alt="Tree Service Quote Request"
                className="w-full h-auto object-cover"
              />
            </div>
          </DialogHeader>

          <div className="h-[calc(90vh-16rem)] w-full">
            <iframe
              src="https://tally.so/r/wQ4dNg"
              className="w-full h-full border-0"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Dry Cleaning Order Form"
            >
              Loading…
            </iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

import Image from "next/image";
