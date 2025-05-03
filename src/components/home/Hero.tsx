"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useState } from "react";
import QuickQuoteModal from "./QuickQuoteModal";
import { HomeQuoteRequestForm } from "../directory/HomeQuoteRequestForm";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import bbImg from "../../../public/images/cities/1.png";
import liImg from "../../../public/images/cities/2.png";
import quoteImg from "../../../public/images/cities/quote-img.jpg";

interface FormData {
  serviceType: string;
  serviceUrgency: string;
  propertyType: string;
  city: string;
  zipCode: string;
  name: string;
  email: string;
  phone: string;
  photo: File | null;
}

export const Hero = () => {
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleQuoteSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      const result = await response.json();
      console.log("Quote submitted successfully:", result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting quote:", error);
      // You might want to show an error message to the user here
      alert("Failed to submit quote. Please try again.");
    }
  };

  return (
    <>
      {/* <section className="hero-pattern py-20"> */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Find Trusted Tree Services in Texas
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Connect with verified tree service professionals in your area
            </p>

            <div className="w-full mx-auto my-8 overflow-hidden rounded-lg shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-500 text-white p-4">
                <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 rounded-full bg-yellow-400 opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 rounded-full bg-green-800 opacity-20"></div>

                <div className="relative flex items-center justify-center text-center">
                  <div className="space-y-2">
                    <h2 className="text-sm md:text-base font-bold leading-tight animate-pulse">
                      <span className="bg-white rounded-full aspect-square py-0.5">
                        🌳
                      </span>{" "}
                      Find the Best Tree Service in Your City — Fast, Free, and
                      Trusted by Texans!
                    </h2>
                    <div className="flex items-center space-x-1 text-[10px] md:text-xs justify-center">
                      <p className="text-xs font-semibold flex items-center">
                        <CheckCircle className="mr-1 h-4 w-4" /> Free Quotes
                      </p>
                      <p className="text-xs font-semibold flex items-center">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Licensed & Insured Pros
                      </p>
                      <p className="text-xs font-semibold flex items-center">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        24/7 Emergency Help Available
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] md:text-xs justify-center">
                      <p className="text-xs font-semibold flex items-center">
                        ⭐⭐⭐⭐⭐
                      </p>
                      <div className="rounded-lg bg-white p-0.5">
                        <Image
                          src={bbImg}
                          alt={"B"}
                          width={1000}
                          height={1000}
                          quality={1000}
                          className="h-8 w-auto"
                        />
                      </div>
                      <div className="rounded-lg bg-white p-0.5">
                        <Image
                          src={liImg}
                          alt={"B"}
                          width={1000}
                          height={1000}
                          quality={1000}
                          className="h-8 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 md:flex items-center">
                <div className="md:w-1/2 md:pr-4">
                  {!isSubmitted ? (
                    <>
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Detailed Quote Request
                      </h3>
                      <HomeQuoteRequestForm onSubmit={handleQuoteSubmit} />
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
                      <h3 className="mt-2 text-base font-bold text-gray-800">
                        Quote Request Sent!
                      </h3>
                      <p className="mt-1 text-gray-600 text-xs">
                        A tree service professional will contact you shortly
                        with your free quote.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-3 px-2 py-1 text-[10px] text-green-600 underline"
                      >
                        Submit another request
                      </button>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 md:pr-4">
                  <Image
                    src={quoteImg}
                    alt="quote image"
                    height={500}
                    width={500}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-green-700 text-white px-3 py-1.5 text-center font-medium text-xs">
                <p className="animate-pulse">
                  ⚡ Limited slots available — Get fast, affordable help today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuickQuoteModal
        showQuoteDialog={showQuoteDialog}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};
