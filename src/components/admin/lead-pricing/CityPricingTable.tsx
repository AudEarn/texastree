import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CityPrice, LeadTypeData } from "./types";
import { AddCityPriceForm } from "./city-pricing/AddCityPriceForm";
import { CityPricesTable } from "./city-pricing/CityPricesTable";

export function CityPricingTable() {
  // Fetch lead types for the form dropdown
  const { data: leadTypes } = useQuery({
    queryKey: ["leadTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_types")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as LeadTypeData[];
    },
  });

  // Fetch city-specific prices with their associated lead type details
  const { data: cityPrices } = useQuery({
    queryKey: ["leadPricingByCity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_pricing_by_city")
        .select("*, lead_type:lead_types(*)")
        .order('city');
      if (error) throw error;
      return data as (CityPrice & { lead_type: LeadTypeData })[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>City-Specific Pricing</CardTitle>
        <CardDescription>Override global prices for specific cities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AddCityPriceForm leadTypes={leadTypes} />
          <CityPricesTable cityPrices={cityPrices} />
        </div>
      </CardContent>
    </Card>
  );
}