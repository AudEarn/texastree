'use client'
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AddressFields } from "./FormFields/AddressFields";
import { BusinessInfoFields } from "./FormFields/BusinessInfoFields";
import { ContactInfoFields } from "./FormFields/ContactInfoFields";
import { formSchema } from "./schema";

type FormValues = z.infer<typeof formSchema>;
type TreeServiceCompany =
  Database["public"]["Tables"]["tree_service_companies"]["Insert"];

export const ClaimListingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      contact_email: "",
      contact_phone: "",
      website_url: "",
      description: "",
      street_address: "",
      city: "",
      zip_code: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const submission: TreeServiceCompany = {
        business_name: values.business_name,
        city: values.city,
        contact_email: values.contact_email,
        contact_phone: values.contact_phone,
        website_url: values.website_url,
        description: values.description,
        street_address: values.street_address,
        zip_code: values.zip_code,
        state: "TX",
        verification_status: "unverified",
      };

      const { error } = await supabase
        .from("tree_service_companies")
        .insert(submission);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your listing claim has been submitted for review.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your listing claim. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <BusinessInfoFields form={form} />
          <ContactInfoFields form={form} />
          <AddressFields form={form} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Claim"}
        </Button>
      </form>
    </Form>
  );
};
