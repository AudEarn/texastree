import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomerInformationForm } from "./components/CustomerInformationForm";
import { DialogFooter } from "./components/DialogFooter";
import { DialogHeader } from "./components/DialogHeader";
import { ServiceDetailsForm } from "./components/ServiceDetailsForm";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

interface LeadDetailsDialogProps {
  lead: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LeadDetailsDialog = ({
  lead,
  open,
  onOpenChange,
}: LeadDetailsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [isExclusiveSelected, setIsExclusiveSelected] = useState(false);
  const [isSharedSelected, setIsSharedSelected] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<QuoteRequest>({
    defaultValues: lead || undefined,
  });

  // Reset form when lead changes
  useEffect(() => {
    if (lead) {
      reset(lead);
    }
  }, [lead, reset]);

  const { mutate: updateLead, isPending: isUpdating } = useMutation({
    mutationFn: async (data: Partial<QuoteRequest>) => {
      if (!lead?.id) throw new Error("No lead ID provided");

      const { data: updatedLead, error } = await supabase
        .from("quote_requests")
        .update(data)
        .eq("id", lead.id)
        .select()
        .single();

      if (error) throw error;
      return updatedLead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["all-leads"] });
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      setEditMode(false);
    },
    onError: (error) => {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteLead, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!lead?.id) throw new Error("No lead ID provided");

      const { error } = await supabase
        .from("quote_requests")
        .delete()
        .eq("id", lead.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["all-leads"] });
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = handleSubmit((data) => {
    updateLead(data);
  });

  const handleInputChange = (field: keyof QuoteRequest, value: any) => {
    setValue(field, value, { shouldDirty: true });
  };

  const handleEmailBlast = async (blastType: "verified" | "cold") => {
    if (!lead) return;

    setIsSendingEmail(true);
    try {
      const leadTypes = [];
      if (isExclusiveSelected) leadTypes.push("exclusive");
      if (isSharedSelected) leadTypes.push("shared");

      if (leadTypes.length === 0) {
        toast({
          title: "Error",
          description:
            "Please select at least one lead type (Exclusive or Shared)",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.functions.invoke(
        "send-lead-email-blast",
        {
          body: {
            leadId: lead.id,
            leadType: leadTypes,
            city: lead.original_city,
            blastType,
            serviceDetails: {
              fullName: lead.full_name,
              serviceType: lead.service_type,
              treeCount: lead.tree_count,
              treeHeight: lead.tree_height,
              timeframe: lead.timeframe,
              description: lead.description,
            },
          },
        }
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: `Email blast sent to ${blastType} businesses in ${lead.original_city}`,
      });

      // Update the lead's email blast types
      await updateLead({
        email_blast_types: [...(lead.email_blast_types || []), blastType],
      });
    } catch (error) {
      console.error("Error sending email blast:", error);
      toast({
        title: "Error",
        description: "Failed to send email blast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!lead) return null;

  const formValues = watch();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader
          lead={lead}
          editMode={editMode}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onEdit={() => setEditMode(true)}
          onSave={handleSave}
          onCancel={() => {
            setEditMode(false);
            reset(lead);
          }}
          onDelete={() => deleteLead()}
        />

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <CustomerInformationForm
              editedLead={formValues}
              editMode={editMode}
              onInputChange={handleInputChange}
            />
            <ServiceDetailsForm
              editedLead={formValues}
              editMode={editMode}
              onInputChange={handleInputChange}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Lead Type Selection</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exclusive"
                  checked={isExclusiveSelected}
                  onCheckedChange={(checked) => {
                    setIsExclusiveSelected(checked as boolean);
                    if (checked) setIsSharedSelected(false);
                  }}
                />
                <label htmlFor="exclusive">Exclusive Lead</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shared"
                  checked={isSharedSelected}
                  onCheckedChange={(checked) => {
                    setIsSharedSelected(checked as boolean);
                    if (checked) setIsExclusiveSelected(false);
                  }}
                />
                <label htmlFor="shared">Shared Lead</label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Email Actions</h3>
            <div className="flex space-x-4">
              <Button
                onClick={() => handleEmailBlast("verified")}
                disabled={
                  isSendingEmail || (!isExclusiveSelected && !isSharedSelected)
                }
              >
                {isSendingEmail
                  ? "Sending..."
                  : `Email to Verified Businesses in ${lead.original_city}`}
              </Button>
              <Button
                onClick={() => handleEmailBlast("cold")}
                disabled={
                  isSendingEmail || (!isExclusiveSelected && !isSharedSelected)
                }
                variant="secondary"
              >
                {isSendingEmail
                  ? "Sending..."
                  : `Email to All Businesses in ${lead.original_city}`}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Additional Information</h3>
            <Input
              {...register("description")}
              disabled={!editMode}
              placeholder="No additional information provided."
              className="border-2 border-black rounded-md"
            />
          </div>

          <DialogFooter lead={lead} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
