'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ContactFields,
  DescriptionField,
  LocationFields,
  ServiceFields,
  TimeframeFields,
  TreeDetailsFields,
} from "./quote-form/FormFields";
import { FormValues, formSchema } from "./schema";

interface QuoteRequestFormProps {
  businessId?: string;
  businessEmail?: string; // Kept for backward compatibility
  onSubmitSuccess?: () => void;
  preselectedCity?: string;
  onSelectAnotherCity?: (formData: FormValues) => void;
  initialFormData?: Partial<FormValues>;
}

export const QuoteRequestForm = ({
  businessId,
  onSubmitSuccess,
  preselectedCity,
  onSelectAnotherCity,
  initialFormData,
}: QuoteRequestFormProps) => {
  const { toast } = useToast();
  const [serviceType, setServiceType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialFormData?.fullName || "",
      phone: initialFormData?.phone || "",
      email: initialFormData?.email || "",
      streetAddress: initialFormData?.streetAddress || "",
      city: preselectedCity || initialFormData?.city || "",
      serviceType: initialFormData?.serviceType || "",
      treeCount: initialFormData?.treeCount || "",
      treeHeight: initialFormData?.treeHeight || "",
      debrisHauling: initialFormData?.debrisHauling || "",
      timeframe: initialFormData?.timeframe || "",
      specificDate: initialFormData?.specificDate || "",
      preferredContact: initialFormData?.preferredContact || "",
      description: initialFormData?.description || "",
    },
  });

  // Ensure city is set when preselectedCity changes
  useEffect(() => {
    if (preselectedCity && form.getValues('city') !== preselectedCity) {
      form.setValue('city', preselectedCity);
    }
  }, [preselectedCity, form]);

  const onSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);

    try {
      // Validate businessId is a valid UUID using a simple regex check
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validBusinessId =
        businessId && uuidRegex.test(businessId) ? businessId : null;

      // Ensure city is valid
      if (!formData.city) {
        throw new Error("City is required");
      }

      const { error } = await supabase
        .from("quote_requests")
        .insert({
          business_id: validBusinessId,
          full_name: formData.fullName?.trim() || "Anonymous",
          phone: formData.phone?.replace(/\D/g, "") || "",
          email: formData.email?.trim().toLowerCase() || "",
          address: formData.streetAddress
            ? `${formData.streetAddress.trim()}, ${formData.city || ""}, TX`
            : "",
          service_type: formData.serviceType || "Not specified",
          tree_count: parseInt(formData.treeCount || "1"),
          tree_height: formData.treeHeight || "Not specified",
          debris_hauling: formData.debrisHauling === "Yes",
          timeframe: formData.timeframe || "Not specified",
          specific_date: formData.specificDate || null,
          description: formData.description?.trim() || null,
          preferred_contact: formData.preferredContact || "Not specified",
          original_city: formData.city || "",
          status: "pending",
          lead_status: "new",
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your quote request has been submitted successfully.",
        variant: "default",
      });

      setShowSuccessDialog(true);
      form.reset();

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit quote request";

      toast({
        title: "Error",
        description: errorMessage || "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAnotherCity = () => {
    if (onSelectAnotherCity) {
      onSelectAnotherCity(form.getValues());
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ContactFields form={form} />
          <LocationFields
            form={form}
            preselectedCity={preselectedCity}
            onSelectAnotherCity={handleSelectAnotherCity}
          />
          <ServiceFields
            form={form}
            onServiceTypeChange={(value) => setServiceType(value)}
          />
          <TreeDetailsFields form={form} />
          <TimeframeFields form={form} />
          <DescriptionField form={form} serviceType={serviceType} />

          <Button
            type="submit"
            className="w-full bg-forest-600 hover:bg-forest-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Quote Request"}
          </Button>
        </form>
      </Form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quote Request Submitted Successfully!</DialogTitle>
            <DialogDescription>
              Thank you for submitting your quote request. Our team will review
              your information and get back to you soon through your preferred
              contact method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-500">
              You will receive updates about your request status.
            </p>
            <Button
              className="w-full bg-forest-600 hover:bg-forest-700"
              onClick={() => setShowSuccessDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
