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
  serviceTypeInput: string;
  serviceUrgency: string;
  serviceUrgencyInput: string;
  propertyType: string;
  propertyTypeInput: string;
  city: string;
  zipCode: string;
  fullAddress: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string | null;
}

export const HomeQuoteRequestForm = ({
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
  const [openServiceUrgencyInput, setOpenServiceUrgencyInput] = useState(false);
  const [openPropertyTypeInput, setOpenPropertyTypeInput] = useState(false);
  const [openServiceTypeInput, setOpenServiceTypeInput] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    serviceType: "",
    serviceTypeInput: "",
    serviceUrgency: "",
    serviceUrgencyInput: "",
    propertyTypeInput: "",
    propertyType: "",
    city: "",
    zipCode: "",
    fullAddress: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    photo: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  // Add cleanup for preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    console.log(name, value);

    if (name === "serviceUrgency" && value === "On a Specific Day") {
      setOpenServiceUrgencyInput(true);
    } else if (name === "serviceUrgency") {
      setOpenServiceUrgencyInput(false);
    }

    if (name === "propertyType" && value === "Other") {
      setOpenPropertyTypeInput(true);
    } else if (name === "propertyType") {
      setOpenPropertyTypeInput(false);
    }

    if (name === "serviceType" && value === "Other") {
      setOpenServiceTypeInput(true);
    } else if (name === "serviceType") {
      setOpenServiceTypeInput(false);
    }

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
      const file = e.target.files[0];

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      try {
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, photo: base64 }));
      } catch (error) {
        console.error("Conversion failed:", error);
      }
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    let canProceed = false;

    switch (currentStep) {
      case 1:
        // First step - service type must be selected
        canProceed = !!formData.serviceType && 
        (formData.serviceType !== "Other" || !!formData.serviceTypeInput);
        break;
      case 2:
        // Second step - service urgency must be selected
        // If "On a Specific Day" is selected, input must be filled
        canProceed =
          !!formData.serviceUrgency &&
          (formData.serviceUrgency !== "On a Specific Day" ||
            !!formData.serviceUrgencyInput);
        break;
      case 3:
        // Third step - property type must be selected
        // If "Other" is selected, input must be filled
        canProceed =
          !!formData.propertyType &&
          (formData.propertyType !== "Other" || !!formData.propertyTypeInput);
        break;
      case 4:
        // Fourth step - all fields required
        canProceed =
          !!formData.city && !!formData.zipCode && !!formData.fullAddress;
        break;
      case 5:
        // Fifth step - all fields required
        canProceed =
          !!formData.firstName && !!formData.lastName && !!formData.email;
        break;
      case 6:
        // Sixth step - optional, can always proceed
        canProceed = true;
        break;
      default:
        canProceed = true;
    }

    if (canProceed) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              What kind of help do you need?
            </h3>
            <div className="space-y-2">
              {[
                "Tree Removal",
                "Tree Trimming / Pruning",
                "Stump Grinding / Removal",
                "Lot Clearing / Land Clearing",
                "Emergency Tree Service [URGENT] 🚨",
                "Other",
              ].map((option, i) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-green-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value={option}
                    checked={formData.serviceType === option}
                    onChange={handleInputChange}
                    className="h-3 w-3 text-green-600"
                  />
                  <span
                    className={`text-gray-700 text-sm ${
                      i === 4 && "font-bold"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              ))}
              {openServiceTypeInput && (
                <div className="mt-3">
                  <textarea
                    name="serviceTypeInput"
                    value={formData.serviceTypeInput}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    rows={2}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              How soon do you need service?
            </h3>
            <div className="space-y-2">
              {[
                "As soon as possible",
                "Within a week",
                "Within a month",
                "Just comparing prices",
                "On a Specific Day",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-green-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="serviceUrgency"
                    value={option}
                    checked={formData.serviceUrgency === option}
                    onChange={handleInputChange}
                    className="h-3 w-3 text-green-600"
                  />
                  <span className="text-gray-700 text-sm">{option}</span>
                </label>
              ))}
              {openServiceUrgencyInput && (
                <div className="mt-3">
                  {/* <label className="block text-xs font-medium text-gray-700">
                    Other (briefly explain)
                  </label> */}
                  <textarea
                    required
                    name="serviceUrgencyInput" // serviceUrgencyInput
                    value={formData.serviceUrgencyInput}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    rows={2}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              What type of property is it?
            </h3>
            <div className="space-y-2">
              {[
                "Home / Residential",
                "Business / Commercial",
                "Vacant Land / Lot",
                "Other",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-green-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="propertyType"
                    value={option}
                    checked={formData.propertyType === option}
                    onChange={handleInputChange}
                    className="h-3 w-3 text-green-600"
                  />
                  <span className="text-gray-700 text-sm">{option}</span>
                </label>
              ))}
              {openPropertyTypeInput && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700">
                    Other (briefly explain)
                  </label>
                  <textarea
                    required
                    name="propertyTypeInput" // propertyTypeInput
                    value={formData.propertyTypeInput}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    rows={2}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Where is the work needed?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
              <div className="mt-3 col-span-2">
                <label className="block text-xs font-medium text-gray-700">
                  Full Address
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Best way to contact you
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block text-xs font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Phone Number (optional but recommended)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Upload a picture (optional)
            </h3>
            <span className="text-xs">
              So we can provide you the most accurate quote as quickly as
              possible, please attach a picture! Not required but very helpful.
            </span>
            <div className="mt-1 flex justify-center px-3 pt-3 pb-3 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData((prev) => ({ ...prev, photo: null }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-xs text-gray-600">
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
                  </>
                )}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        currentStep > i + 1
                          ? "bg-green-500"
                          : currentStep === i + 1
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className="text-white text-xs font-medium">
                        {i + 1}
                      </span>
                    </div>
                    {i < 5 && (
                      <div
                        className={`w-8 h-1 ${
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

          <div className="flex justify-between pt-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Previous
              </button>
            )}
            {currentStep < 7 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 ml-auto"
              >
                Next
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 ml-auto"
              >
                Submit Request
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </form>
      </Form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              Quote Request Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-xs">
              Thank you for submitting your quote request. Our team will review
              your information and get back to you soon through your preferred
              contact method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-center text-xs text-gray-500">
              You will receive updates about your request status.
            </p>
            <Button
              className="w-full bg-forest-600 hover:bg-forest-700 text-xs py-1"
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
