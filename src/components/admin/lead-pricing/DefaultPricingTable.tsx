import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeadPrice, LeadTypeData } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { DefaultPricesTable } from "./default-pricing/DefaultPricesTable";

export function DefaultPricingTable() {
  const { data: leadTypes, isLoading: isLoadingLeadTypes } = useQuery({
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

  const { data: defaultPrices, isLoading: isLoadingPrices } = useQuery({
    queryKey: ["leadPricingDefaults"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_pricing_defaults")
        .select("*, lead_type:lead_types(*)")
        .order("lead_type");
      if (error) throw error;
      return data as (LeadPrice & { lead_type: LeadTypeData })[];
    },
  });

  if (isLoadingLeadTypes || isLoadingPrices) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!defaultPrices?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Default Lead Pricing</CardTitle>
          <CardDescription>
            Set the default prices for different types of leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No default prices configured yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Lead Pricing</CardTitle>
        <CardDescription>
          Set the default prices for different types of leads
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DefaultPricesTable defaultPrices={defaultPrices} />
      </CardContent>
    </Card>
  );
}