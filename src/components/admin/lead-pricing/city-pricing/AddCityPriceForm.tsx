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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
      // Ensure lead_type is correctly set before sending the request
      if (!newPrice.lead_type.trim()) {
        throw new Error("Lead type is required");
      }
  
      const response = await fetch('/api/admin/city-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrice),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add city price');
      }
  
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadPricingByCity"] });
      setTimeout(() => {
        setNewCityPrice({
          city: "",
          lead_type: "",
          price: 0,
          lead_type_id: "",
        });
      }, 1000);
      
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex-1">
        <CitySearchSelect
          value={newCityPrice.city}
          onChange={(city) => setNewCityPrice({ ...newCityPrice, city })}
          disabled={addCityPrice.isPending}
        />
      </div>

      <div className="flex-1">
        <Select
          value={newCityPrice.lead_type_id}
          onValueChange={handleLeadTypeChange}
          disabled={addCityPrice.isPending}
        >
          <SelectTrigger className="h-10">
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
          className="h-10"
          disabled={addCityPrice.isPending}
        />
      </div>

      <Button
        onClick={handleAddCityPrice}
        disabled={!isValidNewPrice(newCityPrice) || addCityPrice.isPending}
        className="h-10 px-4"
      >
        {addCityPrice.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Price"
        )}
      </Button>
    </div>
  );
}
