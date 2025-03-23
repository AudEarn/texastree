import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadPrice } from "../types";

interface PriceUpdateFormProps {
  price: LeadPrice;
}

export function PriceUpdateForm({ price }: PriceUpdateFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateDefaultPrice = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      const { error } = await supabase
        .from("lead_pricing_defaults")
        .update({ price })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadPricingDefaults"] });
      toast({
        title: "Success",
        description: "Default price updated successfully",
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
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={price.price}
        onChange={(e) =>
          updateDefaultPrice.mutate({
            id: price.id,
            price: parseFloat(e.target.value),
          })
        }
        className="w-24"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          updateDefaultPrice.mutate({
            id: price.id,
            price: price.price,
          })
        }
      >
        Update
      </Button>
    </div>
  );
}
