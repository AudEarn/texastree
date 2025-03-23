import { useState } from "react";
import { TypedInput } from "./form/TypedInput";
import { CitySearchSelect } from "../../lead-pricing/city-pricing/CitySearchSelect";
import type { Database } from "@/integrations/supabase/types";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

interface CustomerInformationFormProps {
  editedLead: QuoteRequest;
  editMode: boolean;
  onInputChange: (field: keyof QuoteRequest, value: QuoteRequest[keyof QuoteRequest]) => void;
}

export const CustomerInformationForm = ({
  editedLead,
  editMode,
  onInputChange,
}: CustomerInformationFormProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-4">Customer Information</h3>
      <div className="space-y-4">
        <TypedInput
          label="Name"
          field="full_name"
          value={editedLead.full_name}
          onChange={(value) => onInputChange('full_name', value)}
          disabled={!editMode}
        />
        <TypedInput
          label="Email"
          field="email"
          value={editedLead.email}
          onChange={(value) => onInputChange('email', value)}
          disabled={!editMode}
        />
        <TypedInput
          label="Phone"
          field="phone"
          value={editedLead.phone}
          onChange={(value) => onInputChange('phone', value)}
          disabled={!editMode}
        />
        <TypedInput
          label="Street Address"
          field="address"
          value={editedLead.address}
          onChange={(value) => onInputChange('address', value)}
          disabled={!editMode}
        />
        {editMode ? (
          <CitySearchSelect
            value={editedLead.original_city || ''}
            onChange={(city) => onInputChange('original_city', city)}
          />
        ) : (
          <TypedInput
            label="City"
            field="original_city"
            value={editedLead.original_city || ''}
            onChange={() => {}}
            disabled={true}
          />
        )}
        <TypedInput
          label="ZIP Code"
          field="address"
          value={editedLead.address?.split(' ').pop() || ''}
          onChange={(value) => onInputChange('address', value)}
          disabled={!editMode}
        />
      </div>
    </div>
  );
};