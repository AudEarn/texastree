import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Trash2 } from "lucide-react";
import { CityPrice, LeadTypeData } from "../types";

interface CityPricesTableProps {
  cityPrices?: (CityPrice & { lead_type: LeadTypeData })[];
}

export function CityPricesTable({ cityPrices }: CityPricesTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteCityPrice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lead_pricing_by_city")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadPricingByCity"] });
      toast({
        title: "Success",
        description: "City price override removed",
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

  const resetToGlobal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lead_pricing_by_city")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadPricingByCity"] });
      toast({
        title: "Success",
        description: "Price reset to global default",
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

  if (!cityPrices?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No city-specific prices configured yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>City</TableHead>
          <TableHead>Lead Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price ($)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cityPrices.map((price) => (
          <TableRow key={price.id}>
            <TableCell>{price.city}</TableCell>
            <TableCell className="capitalize">{price.lead_type.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {price.lead_type.description}
            </TableCell>
            <TableCell>${price.price}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                Custom Price
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Reset to global price"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset to Global Price</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reset this city's price to the
                        global default?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => resetToGlobal.mutate(price.id)}
                      >
                        Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      title="Delete custom price"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Custom Price</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this custom price? The
                        global price will be used instead.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteCityPrice.mutate(price.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
