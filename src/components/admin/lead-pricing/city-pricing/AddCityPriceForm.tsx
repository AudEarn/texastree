import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LeadTypeData } from "../types";
import { CitySearchSelect } from "./CitySearchSelect";

interface NewCityPrice {
  city: string;
  lead_type: string;
  price: number;
  lead_type_id: string;
}

interface AddCityPriceFormProps {
  leadTypes?: LeadTypeData[];
}

export function AddCityPriceForm({ leadTypes = [] }: AddCityPriceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCityPrice, setNewCityPrice] = useState<NewCityPrice>({
    city: "",
    lead_type: "",
    price: 0,
    lead_type_id: "",
  });

  const addCityPrice = useMutation({
    mutationFn: async (newPrice: NewCityPrice) => {
      try {
        console.log("Submitting new price:", newPrice);
        const { error } = await supabase.from("lead_pricing_by_city").insert([
          {
            city: newPrice.city,
            lead_type: newPrice.lead_type,
            price: newPrice.price,
            lead_type_id: newPrice.lead_type_id,
          },
        ]);

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
      } catch (error: any) {
        console.error("Error adding city price:", error);
        throw new Error(error.message || "Failed to add city price");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadPricingByCity"] });
      setNewCityPrice({
        city: "",
        lead_type: "",
        price: 0,
        lead_type_id: "",
      });
      toast({
        title: "Success",
        description: "City-specific price added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const isValidNewPrice = (price: NewCityPrice): boolean => {
    return (
      price.city.trim() !== "" &&
      price.lead_type !== "" &&
      price.lead_type_id !== "" &&
      price.price > 0
    );
  };

  const handleAddCityPrice = () => {
    if (!isValidNewPrice(newCityPrice)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
      });
      return;
    }

    addCityPrice.mutate(newCityPrice);
  };

  const handleLeadTypeChange = (leadTypeId: string) => {
    const selectedType = leadTypes.find((type) => type.id === leadTypeId);
    if (selectedType) {
      setNewCityPrice({
        ...newCityPrice,
        lead_type: selectedType.name,
        lead_type_id: selectedType.id,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div className="flex-1">
        <CitySearchSelect
          value={newCityPrice.city}
          onChange={(city) => setNewCityPrice({ ...newCityPrice, city })}
        />
      </div>

      <div className="flex-1">
        <Select
          value={newCityPrice.lead_type_id}
          onValueChange={handleLeadTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select lead type" />
          </SelectTrigger>
          <SelectContent>
            {leadTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-32">
        <Input
          type="number"
          value={newCityPrice.price}
          onChange={(e) =>
            setNewCityPrice({
              ...newCityPrice,
              price: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="Price"
          className="w-full"
        />
      </div>

      <Button
        onClick={handleAddCityPrice}
        disabled={!isValidNewPrice(newCityPrice)}
      >
        Add Price
      </Button>
    </div>
  );
}
