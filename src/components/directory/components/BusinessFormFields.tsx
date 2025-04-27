import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { BusinessFormValues } from "../utils/businessFormUtils";

interface BusinessFormFieldsProps {
  form: UseFormReturn<BusinessFormValues>;
}

export const BusinessFormFields = ({ form }: BusinessFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="business_name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="google_rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rating (0-5)</FormLabel>
            <FormControl>
              <Input 
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...field}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  field.onChange(value || null);
                }}
                value={field.value === null ? "" : field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="website_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} placeholder="https://example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      
      
    <FormField
        control={form.control}
        name="logo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo URL</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} placeholder="https://example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      

      <FormField
  control={form.control}
  name="feature_images"
  render={({ field }) => {
    // Convert array to string for display
    const displayValue = Array.isArray(field.value) 
      ? field.value.join('\n') // Using newline as separator
      : field.value || "";
    
    return (
        <FormItem className="col-span-2">
        <FormLabel>Features Images</FormLabel>
        <FormControl>
          <Textarea
            placeholder="https://example.com"
            value={displayValue}
            onChange={(e) => {
              // Convert string back to array on change
              const inputValue = e.target.value;
              // Split by comma or newline
              const arrayValue = inputValue
                ? inputValue.split(/[,\n]+/).filter(Boolean).map(item => item.trim())
                : [];
              
              // Update the form with the array value
              field.onChange(arrayValue);
            }}
            className="h-20"
          />
          {/* <Textarea {...field} value={field.value || ""} className="h-20" /> */}
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>

      <FormField
        control={form.control}
        name="business_statement"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Business Statement</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value || ""} className="h-20" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <div className="col-span-2 flex gap-4">
        <FormField
          control={form.control}
          name="is_verified"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Verified Business</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured_in_city"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Featured Listing</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </>
  );
};