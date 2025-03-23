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
import { Edit, Globe, Phone, Shield, Star } from "lucide-react";
import { useState } from "react";
import { EditBusinessForm } from "./EditBusinessForm";
import { QuoteRequestForm } from "./QuoteRequestForm";
import { StarRating } from "./StarRating";
import Image from "next/image";

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

  console.log({ featureImage });
  return (
    <Card className="bg-gradient-to-r from-forest-50 via-forest-100 to-forest-50 border-2 border-forest-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-[400px] h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-white shadow-md">
            <Image
              width={400}
              height={400}
              src={featureImage}
              alt={`${business.business_name} featured image`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-wrap gap-2">
                  <Star className="text-yellow-500 w-6 h-6 fill-yellow-500" />
                  <h2 className="text-2xl font-bold text-forest-600">
                    #1 Tree Service Provider in {business.city}
                  </h2>
                  {business.is_verified && (
                    <Badge variant="secondary" className="relative">
                      <Shield className="w-5 h-5 mr-1.5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">Verified</span>
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
                        className="bg-white/80 hover:bg-white text-forest-700"
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
              <h3 className="text-xl font-semibold text-forest-700">
                {business.business_name}
              </h3>
            </div>

            <p className="text-lg text-forest-700 italic">
              {business.business_statement || defaultStatement}
            </p>

            {business.google_rating && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl">
                  {business.google_rating.toFixed(1)}
                </span>
                <StarRating rating={business.google_rating} size={24} />
              </div>
            )}

            <div className="space-y-3">
              {business.contact_phone && (
                <div className="flex items-center justify-between">
                  <p className="text-forest-700 text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {business.contact_phone}
                  </p>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditFormOpen(true)}
                      className="text-forest-600"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
              {business.website_url && (
                <div className="flex items-center justify-between">
                  <a
                    href={business.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest-600 hover:underline block text-lg flex items-center gap-2"
                  >
                    <Globe className="h-5 w-5" />
                    Visit Website
                  </a>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditFormOpen(true)}
                      className="text-forest-600"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>

            <Dialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-forest-600 hover:bg-forest-700 text-white mt-4 text-lg px-8"
                >
                  Request a Quote
                </Button>
              </DialogTrigger>
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
      </CardContent>
    </Card>
  );
};
