'use client'
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

interface FormFieldProps {
  form: UseFormReturn<FormValues>;
  preselectedCity?: string;
}

const ContactFields = ({ form }: FormFieldProps) => (
  <div className="space-y-4">
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name *</FormLabel>
          <FormControl>
            <Input
              placeholder="John Doe"
              {...field}
              className="border-2 border-forest-600 focus-visible:ring-forest-600"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <Input
                placeholder="(555) 555-5555"
                {...field}
                className="border-2 border-forest-600 focus-visible:ring-forest-600"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input
                placeholder="john@example.com"
                {...field}
                className="border-2 border-forest-600 focus-visible:ring-forest-600"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={form.control}
      name="preferredContact"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preferred Contact Method *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="border-2 border-forest-600 focus-visible:ring-forest-600">
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-2 border-forest-600">
              <SelectItem value="Call">Call</SelectItem>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

interface LocationFieldsProps extends FormFieldProps {
  onSelectAnotherCity?: () => void;
}

const LocationFields = ({
  form,
  preselectedCity,
  onSelectAnotherCity,
}: LocationFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="streetAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address *</FormLabel>
            <FormControl>
              <Input
                placeholder="123 Main St"
                {...field}
                className="border-2 border-forest-600 focus-visible:ring-forest-600"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City *</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input
                  value={field.value}
                  readOnly
                  className="border-2 border-forest-600 bg-gray-50"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 border-forest-600 hover:bg-forest-100"
                  onClick={onSelectAnotherCity}
                >
                  Select Another City
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const ServiceFields = ({
  form,
  onServiceTypeChange,
}: FormFieldProps & { onServiceTypeChange: (value: string) => void }) => {
  const [serviceType, setServiceType] = useState("");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="serviceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Type *</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setServiceType(value);
                onServiceTypeChange(value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-2 border-forest-600 focus-visible:ring-forest-600 hover:bg-[#0EA5E9]/10 transition-colors">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border-2 border-forest-600">
                <SelectItem
                  value="Tree Removal"
                  className="hover:bg-[#0EA5E9]/10"
                >
                  Tree Removal
                </SelectItem>
                <SelectItem
                  value="Tree Trimming & Pruning"
                  className="hover:bg-[#0EA5E9]/10"
                >
                  Tree Trimming & Pruning
                </SelectItem>
                <SelectItem
                  value="Stump Grinding / Removal"
                  className="hover:bg-[#0EA5E9]/10"
                >
                  Stump Grinding / Removal
                </SelectItem>
                <SelectItem
                  value="Emergency Tree Services"
                  className="text-red-600 font-bold hover:bg-[#0EA5E9]/10"
                >
                  Emergency Tree Services
                </SelectItem>
                <SelectItem
                  value="Land Clearing"
                  className="hover:bg-[#0EA5E9]/10"
                >
                  Land Clearing
                </SelectItem>
                <SelectItem value="Other" className="hover:bg-[#0EA5E9]/10">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const TreeDetailsFields = ({ form }: FormFieldProps) => (
  <div className="space-y-4">
    <FormField
      control={form.control}
      name="treeHeight"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Approximate Tree Height *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="border-2 border-forest-600 focus-visible:ring-forest-600 hover:bg-[#0EA5E9]/10 transition-colors">
                <SelectValue placeholder="Please select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-2 border-forest-600">
              <SelectItem
                value="Under 15 feet"
                className="hover:bg-[#0EA5E9]/10"
              >
                Under 15 feet
              </SelectItem>
              <SelectItem value="15-30 feet" className="hover:bg-[#0EA5E9]/10">
                15-30 feet
              </SelectItem>
              <SelectItem value="30-60 feet" className="hover:bg-[#0EA5E9]/10">
                30-60 feet
              </SelectItem>
              <SelectItem value="60+ feet" className="hover:bg-[#0EA5E9]/10">
                60+ feet
              </SelectItem>
              <SelectItem value="Not sure" className="hover:bg-[#0EA5E9]/10">
                Not sure
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="debrisHauling"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Need Debris Hauling? *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="border-2 border-forest-600 focus-visible:ring-forest-600 hover:bg-[#0EA5E9]/10 transition-colors">
                <SelectValue placeholder="Please select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-2 border-forest-600">
              <SelectItem value="Yes" className="hover:bg-[#0EA5E9]/10">
                Yes
              </SelectItem>
              <SelectItem value="No" className="hover:bg-[#0EA5E9]/10">
                No
              </SelectItem>
              <SelectItem value="Not sure" className="hover:bg-[#0EA5E9]/10">
                Not sure
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const TimeframeFields = ({ form }: FormFieldProps) => (
  <div className="space-y-4">
    <FormField
      control={form.control}
      name="timeframe"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preferred Timeframe *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="border-2 border-forest-600 focus-visible:ring-forest-600">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-2 border-forest-600">
              <SelectItem value="ASAP">ASAP</SelectItem>
              <SelectItem value="Within a week">Within a week</SelectItem>
              <SelectItem value="Within a month">Within a month</SelectItem>
              <SelectItem value="No rush">No rush</SelectItem>
              <SelectItem value="Specific date">Specific date</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    {form.watch("timeframe") === "Specific date" && (
      <FormField
        control={form.control}
        name="specificDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter Desired Date</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., July 15th, 2024"
                {...field}
                className="border-2 border-forest-600 focus-visible:ring-forest-600"
              />
            </FormControl>
            <FormDescription>
              Please enter your preferred date (e.g., July 15th, 2024)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )}
  </div>
);

const DescriptionField = ({
  form,
  serviceType,
}: FormFieldProps & { serviceType: string }) => (
  <FormField
    control={form.control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {serviceType === "Other"
            ? "Please Describe Your Service Need *"
            : "Additional Details"}
        </FormLabel>
        <FormControl>
          <Textarea
            placeholder={
              serviceType === "Other"
                ? "Please describe the tree service you need..."
                : "Any additional details about the job?"
            }
            className="resize-none border-2 border-forest-600 focus-visible:ring-forest-600"
            {...field}
            required={serviceType === "Other"}
          />
        </FormControl>
        <FormMessage />
        {serviceType === "Other" && (
          <FormDescription>
            Since you selected "Other", please provide details about the service
            you need.
          </FormDescription>
        )}
      </FormItem>
    )}
  />
);

export {
  ContactFields,
  DescriptionField,
  LocationFields,
  ServiceFields,
  TimeframeFields,
  TreeDetailsFields,
};
