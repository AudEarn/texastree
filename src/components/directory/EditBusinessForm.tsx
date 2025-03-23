'use client'

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
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BusinessFormFields } from "./components/BusinessFormFields";
import {
  businessFormSchema,
  type BusinessFormValues,
  handleBusinessUpdate,
} from "./utils/businessFormUtils";

interface EditBusinessFormProps {
  business: {
    id: string;
    business_name: string;
    contact_phone: string | null;
    contact_email: string | null;
    google_rating: number | null;
    website_url: string | null;
    business_statement: string | null;
    feature_images: string[] | null;
    logo_url: string | null;
    is_verified: boolean;
    featured_in_city: boolean | null;
    city: string;
  };
  onSuccess: () => void;
}

export const EditBusinessForm = ({
  business,
  onSuccess,
}: EditBusinessFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditNotes, setCreditNotes] = useState<string>("");

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      business_name: business.business_name,
      contact_phone: business.contact_phone || "",
      contact_email: business.contact_email || "",
      google_rating: business.google_rating || 0,
      website_url: business.website_url || "",
      business_statement: business.business_statement || "",
      feature_images: business.feature_images || [],
      logo_url: business.logo_url || "",
      is_verified: business.is_verified,
      featured_in_city: business.featured_in_city || false,
    },
  });

  // Query to check if user is admin
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const isAdmin = profile?.is_admin;

  const onSubmit = async (values: BusinessFormValues) => {
    handleBusinessUpdate(
      supabase,
      values,
      business.id,
      business.city,
      business.featured_in_city || false,
      () => {
        toast({
          title: "Success",
          description: "Business details updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        onSuccess();
      },
      (error) => {
        console.error("Error updating business:", error);
        toast({
          title: "Error",
          description: "Failed to update business details",
          variant: "destructive",
        });
      }
    );
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("tree_service_companies")
        .delete()
        .eq("id", business.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business listing deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["companies"] });
      onSuccess();
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        title: "Error",
        description: "Failed to delete business listing",
        variant: "destructive",
      });
    }
  };

  const handleAddCredits = async () => {
    try {
      const { error } = await supabase.from("business_lead_credits").insert({
        business_id: business.id,
        credits_remaining: creditAmount,
        notes: creditNotes,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead credits added successfully",
      });

      setCreditAmount(0);
      setCreditNotes("");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    } catch (error) {
      console.error("Error adding lead credits:", error);
      toast({
        title: "Error",
        description: "Failed to add lead credits",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <BusinessFormFields form={form} />

          {isAdmin && (
            <div className="col-span-2 space-y-4 border-t pt-4">
              <h3 className="font-semibold">Add Lead Credits</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Number of credits"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="Notes"
                    value={creditNotes}
                    onChange={(e) => setCreditNotes(e.target.value)}
                  />
                </div>
                <Button type="button" onClick={handleAddCredits}>
                  Add Credits
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Save Changes
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" type="button">
                Delete Listing
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  business listing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
};
