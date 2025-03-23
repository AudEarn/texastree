import * as z from "zod";

export const formSchema = z.object({
  business_name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  contact_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contact_phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  website_url: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  street_address: z.string().min(5, {
    message: "Please enter a valid street address.",
  }),
  city: z.string().min(2, {
    message: "Please enter a valid city.",
  }),
  zip_code: z.string().min(5, {
    message: "Please enter a valid ZIP code.",
  }),
});

export type FormValues = z.infer<typeof formSchema>;