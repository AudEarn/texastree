import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeadTypeData } from "./types";
import { AddLeadTypeForm } from "./lead-types/AddLeadTypeForm";
import { LeadTypesTable } from "./lead-types/LeadTypesTable";

export function LeadTypesManager() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Types</CardTitle>
        <CardDescription>Manage available lead types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AddLeadTypeForm />
          <LeadTypesTable leadTypes={leadTypes} />
        </div>
      </CardContent>
    </Card>
  );
}