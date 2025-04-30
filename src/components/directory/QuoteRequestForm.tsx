"use client";

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
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormValues, formSchema } from "./schema";

interface QuoteRequestFormProps {
  businessId?: string;
  businessEmail?: string; // Kept for backward compatibility
  onSubmitSuccess?: () => void;
  preselectedCity?: string;
  onSelectAnotherCity?: (formData: FormValues) => void;
  initialFormData?: Partial<FormValues>;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  serviceType: string;
  serviceUrgency: string;
  propertyType: string;
  city: string;
  zipCode: string;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
}

export const QuoteRequestForm = ({
  businessId,
  onSubmitSuccess,
  preselectedCity,
  onSelectAnotherCity,
  initialFormData,
  onSubmit,
}: QuoteRequestFormProps) => {
  const { toast } = useToast();
  const [serviceType, setServiceType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    serviceType: "",
    serviceUrgency: "",
    propertyType: "",
    city: "",
    zipCode: "",
    name: "",
    email: "",
    phone: "",
    photo: null,
  });

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
    if (preselectedCity && form.getValues("city") !== preselectedCity) {
      form.setValue("city", preselectedCity);
    }
  }, [preselectedCity, form]);

  const onSubmitForm = async (formData: FormValues) => {
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

      const { error } = await supabase.from("quote_requests").insert({
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit quote request";

      toast({
        title: "Error",
        description:
          errorMessage || "Failed to submit quote request. Please try again.",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const result = reader.result as string;
        // This will include the data URI prefix: data:image/png;base64,...
        resolve(result);
      };
  
      reader.onerror = () => {
        reject(new Error("File reading error"));
      };
  
      reader.readAsDataURL(file);
    });
  }
  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        // console.log(formData,e.target.files[0])
        try {
            const base64 = await fileToBase64(e.target.files![0]);
            console.log("Base64 string:", base64);
            setFormData((prev) => ({ ...prev, photo: base64 }));
          } catch (error) {
            console.error("Conversion failed:", error);
          }
      
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              What kind of help do you need?
            </h3>
            <div className="space-y-3">
              {[
                "Tree Removal",
                "Tree Trimming / Pruning",
                "Stump Grinding / Removal",
                "Emergency Tree Service",
                "Lot Clearing / Land Clearing",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value={option}
                    checked={formData.serviceType === option}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Other (briefly explain)
                </label>
                <textarea
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              How soon do you need service?
            </h3>
            <div className="space-y-3">
              {[
                "As soon as possible",
                "Within a week",
                "Within a month",
                "Just comparing prices",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="serviceUrgency"
                    value={option}
                    checked={formData.serviceUrgency === option}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              What type of property is it?
            </h3>
            <div className="space-y-3">
              {[
                "Home / Residential",
                "Business / Commercial",
                "Vacant Land / Lot",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-green-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="propertyType"
                    value={option}
                    checked={formData.propertyType === option}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Where is the work needed?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Best way to contact you
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name (First Name only is fine)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number (optional but recommended)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Upload a picture (optional)
            </h3>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep > i + 1
                          ? "bg-green-500"
                          : currentStep === i + 1
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="text-white font-medium">{i + 1}</span>
                    </div>
                    {i < 5 && (
                      <div
                        className={`w-12 h-1 ${
                          currentStep > i + 1 ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {renderStep()}

          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            )}
            {currentStep < 7 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 ml-auto"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 ml-auto"
              >
                Submit Request
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
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
