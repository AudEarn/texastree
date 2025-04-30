"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Edit, Globe, Phone, Shield, Star, Award, MapPin, Check, Clock, CheckCircle, PhoneCall, ArrowRight } from "lucide-react";
import { useState } from "react";
import { EditBusinessForm } from "./EditBusinessForm";
import { QuoteRequestForm } from "./QuoteRequestForm";
import { StarRating } from "./StarRating";
import Image from "next/image";
import FeaturedImage from "./FeaturedImage";

interface FeaturedListingProps {
  business: {
    id: string;
    business_name: string;
    contact_email: string | null;
    contact_phone: string | null;
    google_rating: number | null;
    website_url: string | null;
    business_statement: string | null;
    feature_images: string[] | null;
    logo_url: string | null;
    is_verified: boolean;
    featured_in_city: boolean;
    city: string;
  };
}

const defaultFeatureImage =
  "/lovable-uploads/dd0aeb9a-2604-45fd-a461-1e2ee5d2df5c.png";
const defaultStatement =
  "Serving our community for over a decade, we take pride in every job as if it were in our own yard";

export const FeaturedListing = ({ business }: FeaturedListingProps) => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const featureImage = business.feature_images?.[0] || defaultFeatureImage;
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if user is admin
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const isAdmin = profile?.is_admin;

  
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically send data to backend
  };


  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50 border-none shadow-xl rounded-xl transform transition-transform hover:scale-[1.01]">
        {/* <div className="h-10 w-10 border">
                    <Image height={300} width={300} src={business.feature_images[0] || ""} alt={"Logo"} />
                  </div> */}
      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>
      
      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-transparent opacity-20"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400 to-transparent opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-400 to-transparent opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-yellow-400 to-transparent opacity-20"></div>
      
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <FeaturedImage business={business} images={[featureImage, featureImage, featureImage, featureImage]} />



          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-wrap gap-3">
                  <div className="flex items-center bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full text-amber-900 border border-amber-200 shadow-sm">
                    <Award className="text-amber-600 w-5 h-5 mr-2" />
                    <h2 className="text-xl font-bold">
                      #1 Tree Service in {business.city}
                    </h2>
                  </div>
                  
                  {business.is_verified && (
                    <Badge variant="secondary" className="relative bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-none shadow-md px-3 py-1 h-8">
                      <Shield className="w-4 h-4 mr-1.5 text-white" />
                      <span className="font-semibold">Verified Elite</span>
                    </Badge>
                  )}
                </div>
                
                {isAdmin && (
                  <Dialog
                    open={isEditFormOpen}
                    onOpenChange={setIsEditFormOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        className="bg-white hover:bg-gray-50 text-amber-700 border border-amber-200 shadow-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Business Details</DialogTitle>
                      </DialogHeader>
                      <EditBusinessForm
                        business={business}
                        onSuccess={() => setIsEditFormOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <div className="border-b border-amber-200 pb-2">
                <h3 className="text-3xl font-bold text-amber-900 tracking-tight">
                  {business.business_name}
                </h3>
                
                <div className="flex items-center text-amber-700 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Serving {business.city} and surrounding areas</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-lg border border-amber-100 shadow-sm relative">
              {/* Decorative quote marks */}
              <div className="absolute top-2 left-2 text-4xl text-amber-200">"</div>
              <div className="absolute bottom-0 right-2 text-4xl text-amber-200">"</div>
              
              <p className="text-lg text-amber-900 italic leading-relaxed px-4"> 
                {business?.business_statement?.slice(0, 180) || defaultStatement}
              </p>
            </div>

            {business.google_rating && (
              <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100 shadow-sm">
                <div className="bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full h-14 w-14 flex items-center justify-center shadow-md text-white">
                  <span className="font-bold text-xl">
                    {business.google_rating.toFixed(1)}
                  </span>
                </div>
                <div>
                  <StarRating rating={business.google_rating} size={22} />
                  <p className="text-amber-800 font-medium mt-1">Exceptional Google Rating</p>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
              {business.contact_phone && (
                <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-md border border-amber-100 hover:border-amber-300 transition-colors duration-200">
                  <p className="text-amber-900 text-xl font-semibold flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-full shadow-sm">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    {business.contact_phone}
                  </p>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditFormOpen(true)}
                      className="text-amber-600"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
              
              {business.website_url && (
                <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-md border border-amber-100 hover:border-amber-300 transition-colors duration-200">
                  <a
                    href={business.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-900 block text-xl font-semibold flex items-center gap-3 hover:text-amber-700 transition-colors"
                  >
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-full shadow-sm">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    Visit Official Website
                  </a>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditFormOpen(true)}
                      className="text-amber-600"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>

            <Dialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen}>
              {/* <DialogTrigger asChild>
                <Button
                  size="lg" 
                  className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white mt-4 text-lg px-8 py-6 shadow-lg rounded-lg border-b-2 border-amber-800 hover:border-amber-900 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Request Premium Quote
                </Button>
              </DialogTrigger> */}
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Request a Free Quote</DialogTitle>
                </DialogHeader>
                <QuoteRequestForm
                  businessId={business.id}
                  businessEmail={business.contact_email}
                  onSubmitSuccess={() => setIsQuoteFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Gold feature highlights */}
        <div className="mt-6 pt-6 border-t border-amber-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-amber-800">
            <div className="bg-amber-100 p-1 rounded-full">
              <Check className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-sm font-medium">Licensed & Insured</span>
          </div>
          <div className="flex items-center gap-2 text-amber-800">
            <div className="bg-amber-100 p-1 rounded-full">
              <Check className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-sm font-medium">24/7 Emergency Service</span>
          </div>
          <div className="flex items-center gap-2 text-amber-800">
            <div className="bg-amber-100 p-1 rounded-full">
              <Check className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-sm font-medium">Free Estimates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};