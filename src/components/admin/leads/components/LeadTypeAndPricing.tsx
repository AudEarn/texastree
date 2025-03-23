import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useState } from "react";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

interface LeadTypeAndPricingProps {
  lead: QuoteRequest;
  onClose?: () => void;
}

export const LeadTypeAndPricing = ({
  lead,
  onClose,
}: LeadTypeAndPricingProps) => {
  const { toast } = useToast();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handleTypeChange = (type: string) => {
    setSelectedTypes(
      (current) =>
        current.includes(type) ? current.filter((t) => t !== type) : [type] // Only allow one type to be selected
    );

    // Set price based on type
    let price = 0;
    switch (type) {
      case "shared":
        price = 44;
        break;
      case "exclusive":
        price = 89;
        break;
      case "emergency":
        price = 129;
        break;
      default:
        price = 44;
    }
    setCurrentPrice(price);
  };

  const handleGeneratePaymentLink = async () => {
    if (selectedTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one lead type",
        variant: "destructive",
      });
      return;
    }

    if (!currentPrice || currentPrice <= 0) {
      toast({
        title: "Error",
        description: "A valid price must be set",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Starting payment link generation with params:", {
        leadId: lead.id,
        leadType: selectedTypes[0],
        price: currentPrice,
      });

      // First update the lead with the selected type and price
      const { error: updateError } = await supabase
        .from("quote_requests")
        .update({
          lead_status: "pending_sale",
          email_blast_types: selectedTypes,
          price: currentPrice,
          lead_type: selectedTypes[0],
        })
        .eq("id", lead.id);

      if (updateError) {
        console.error("Error updating lead:", updateError);
        throw new Error("Failed to update lead status");
      }

      console.log("Lead updated successfully, generating payment link...");

      // Then generate the payment link with all required parameters
      const { data, error } = await supabase.functions.invoke(
        "create-lead-payment-link",
        {
          body: {
            leadId: lead.id,
            leadType: selectedTypes[0],
            price: Number(currentPrice), // Ensure price is a number
          },
        }
      );

      console.log("Response from edge function:", { data, error });

      if (error) throw error;
      if (!data?.url) {
        throw new Error("No payment URL returned from server");
      }

      // Update lead with payment link URL
      const { error: linkUpdateError } = await supabase
        .from("quote_requests")
        .update({
          payment_link: data.url,
        })
        .eq("id", lead.id);

      if (linkUpdateError) throw linkUpdateError;

      console.log("Payment link generated and stored successfully");

      toast({
        title: "Success",
        description: "Payment link generated successfully",
      });

      if (onClose) onClose();
    } catch (error: any) {
      console.error("Error in payment link generation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate payment link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Lead Type Selection</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shared"
              checked={selectedTypes.includes("shared")}
              onCheckedChange={() => handleTypeChange("shared")}
            />
            <Label htmlFor="shared">Shared Lead ($44)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclusive"
              checked={selectedTypes.includes("exclusive")}
              onCheckedChange={() => handleTypeChange("exclusive")}
            />
            <Label htmlFor="exclusive">Exclusive Lead ($89)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emergency"
              checked={selectedTypes.includes("emergency")}
              onCheckedChange={() => handleTypeChange("emergency")}
            />
            <Label htmlFor="emergency">Emergency Lead ($129)</Label>
          </div>
        </div>
      </div>

      {currentPrice !== null && (
        <div className="text-lg font-semibold text-green-600">
          Price: ${currentPrice}
        </div>
      )}

      <div className="space-y-4">
        <Button
          className="w-full"
          onClick={handleGeneratePaymentLink}
          disabled={isLoading || !currentPrice || currentPrice <= 0}
        >
          {isLoading ? "Processing..." : "Generate Payment Link"}
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
