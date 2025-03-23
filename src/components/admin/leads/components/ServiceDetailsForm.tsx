import { TypedInput } from "./form/TypedInput";
import type { Database } from "@/integrations/supabase/types";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

interface ServiceDetailsFormProps {
  editedLead: QuoteRequest;
  editMode: boolean;
  onInputChange: (field: keyof QuoteRequest, value: QuoteRequest[keyof QuoteRequest]) => void;
}

export const ServiceDetailsForm = ({
  editedLead,
  editMode,
  onInputChange,
}: ServiceDetailsFormProps) => {
  const timeframeOptions = [
    "ASAP",
    "Within a week",
    "Within a month",
    "No rush",
    "Specific date"
  ];

  const serviceTypeOptions = [
    "Tree Removal",
    "Tree Trimming & Pruning",
    "Stump Grinding / Removal",
    "Emergency Tree Services",
    "Land Clearing",
    "Other"
  ];

  return (
    <div>
      <h3 className="font-semibold mb-4">Service Details</h3>
      <div className="space-y-4">
        <TypedInput
          label="Service Type"
          field="service_type"
          value={editedLead.service_type}
          onChange={(value) => onInputChange('service_type', value)}
          type="select"
          options={serviceTypeOptions}
          disabled={!editMode}
        />
        <TypedInput
          label="Tree Count"
          field="tree_count"
          value={editedLead.tree_count}
          onChange={(value) => onInputChange('tree_count', value)}
          type="number"
          disabled={!editMode}
        />
        <TypedInput
          label="Tree Height"
          field="tree_height"
          value={editedLead.tree_height}
          onChange={(value) => onInputChange('tree_height', value)}
          disabled={!editMode}
        />
        <TypedInput
          label="Debris Hauling"
          field="debris_hauling"
          value={editedLead.debris_hauling}
          onChange={(value) => onInputChange('debris_hauling', value)}
          type="boolean"
          disabled={!editMode}
        />
        <TypedInput
          label="Timeframe"
          field="timeframe"
          value={editedLead.timeframe}
          onChange={(value) => onInputChange('timeframe', value)}
          type="select"
          options={timeframeOptions}
          disabled={!editMode}
        />
        {editedLead.timeframe === "Specific date" && (
          <TypedInput
            label="Specific Date"
            field="specific_date"
            value={editedLead.specific_date}
            onChange={(value) => onInputChange('specific_date', value)}
            disabled={!editMode}
          />
        )}
      </div>
    </div>
  );
};