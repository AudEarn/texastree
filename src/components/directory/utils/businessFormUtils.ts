import { z } from "zod";

export const businessFormSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  contact_phone: z.string().nullable(),
  contact_email: z.string().email("Must be a valid email").nullable(),
  google_rating: z.number().min(0).max(5).nullable(),
  website_url: z.string()
    .transform(url => {
      if (!url) return null;
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    })
    .refine(url => !url || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url), {
      message: "Must be a valid URL"
    })
    .nullable(),
  business_statement: z.string().nullable(),
  feature_images: z.array(z.string()).nullable(),
  logo_url: z.string().nullable(),
  is_verified: z.boolean(),
  featured_in_city: z.boolean(),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;

export const handleBusinessUpdate = async (
  supabase: any,
  values: BusinessFormValues,
  businessId: string,
  city: string,
  currentFeatured: boolean,
  onSuccess: () => void,
  onError: (error: Error) => void
) => {
  try {
    if (values.featured_in_city && !currentFeatured) {
      const { error: unfeaturedError } = await supabase
        .from('tree_service_companies')
        .update({ featured_in_city: false })
        .eq('city', city)
        .neq('id', businessId);

      if (unfeaturedError) throw unfeaturedError;
    }

    const { error } = await supabase
      .from('tree_service_companies')
      .update({
        business_name: values.business_name,
        contact_phone: values.contact_phone || null,
        contact_email: values.contact_email || null,
        google_rating: values.google_rating,
        website_url: values.website_url || null,
        business_statement: values.business_statement || null,
        feature_images: values.feature_images || [],
        logo_url: values.logo_url || null,
        is_verified: values.is_verified,
        featured_in_city: values.featured_in_city,
      })
      .eq('id', businessId);

    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error as Error);
  }
};