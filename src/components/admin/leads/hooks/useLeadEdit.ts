import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];
type QuoteRequestUpdate = Partial<Omit<QuoteRequest, 'id' | 'created_at'>>;

const useLeadEdit = (initialLead: QuoteRequest | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editedLead, setEditedLead] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    if (initialLead) {
      setEditedLead(initialLead);
    }
  }, [initialLead]);

  const { mutate: updateLead, isPending: isUpdating } = useMutation({
    mutationFn: async (updatedData: QuoteRequestUpdate) => {
      if (!initialLead?.id) throw new Error("No lead ID provided");
      
      const { data, error } = await supabase
        .from('quote_requests')
        .update(updatedData)
        .eq('id', initialLead.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['all-leads'] });
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      setEditMode(false);
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteLead, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!initialLead?.id) throw new Error("No lead ID provided");

      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', initialLead.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['all-leads'] });
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = <K extends keyof QuoteRequest>(
    field: K,
    value: QuoteRequest[K]
  ) => {
    setEditedLead((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSave = () => {
    if (editedLead && initialLead) {
      const changedFields = Object.entries(editedLead).reduce<QuoteRequestUpdate>((acc, [key, value]) => {
        const typedKey = key as keyof QuoteRequest;
        if (value !== initialLead[typedKey]) {
          acc[typedKey] = value;
        }
        return acc;
      }, {});

      if (Object.keys(changedFields).length > 0) {
        updateLead(changedFields);
      } else {
        setEditMode(false);
      }
    }
  };

  return {
    editMode,
    editedLead,
    isUpdating,
    isDeleting,
    setEditMode,
    handleInputChange,
    handleSave,
    deleteLead,
  };
};

export { useLeadEdit };