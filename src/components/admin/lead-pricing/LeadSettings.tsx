import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LeadSettings as LeadSettingsType } from "./types";

export function LeadSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leadSettings } = useQuery({
    queryKey: ["leadSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_settings")
        .select("*")
        .single();
      if (error) throw error;
      return data as LeadSettingsType;
    },
  });

  const updateLeadSettings = useMutation({
    mutationFn: async ({
      id,
      maxPurchases,
    }: {
      id: string;
      maxPurchases: number;
    }) => {
      const { error } = await supabase
        .from("lead_settings")
        .update({ shared_lead_max_purchases: maxPurchases })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadSettings"] });
      toast({
        title: "Success",
        description: "Lead settings updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Settings</CardTitle>
        <CardDescription>
          Configure general settings for lead management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Maximum Shared Lead Purchases</Label>
            <Input
              type="number"
              value={leadSettings?.shared_lead_max_purchases || 3}
              onChange={(e) =>
                updateLeadSettings.mutate({
                  id: leadSettings?.id || "",
                  maxPurchases: parseInt(e.target.value),
                })
              }
              className="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}