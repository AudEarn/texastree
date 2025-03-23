import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Database } from "@/integrations/supabase/types";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

interface TypedInputProps {
  label: string;
  field: keyof QuoteRequest;
  value: any;
  onChange: (value: any) => void;
  type?: "text" | "number" | "select" | "boolean";
  options?: string[];
  disabled?: boolean;
}

const SERVICE_TYPES = [
  "Tree Removal",
  "Tree Trimming & Pruning",
  "Stump Grinding / Removal",
  "Emergency Tree Services",
  "Land Clearing",
  "Other"
];

const TREE_HEIGHT_OPTIONS = [
  "N/A",
  "<10ft",
  "10-25ft",
  "25-50ft",
  "50ft+"
];

const TIMEFRAME_OPTIONS = [
  "ASAP",
  "Within a week",
  "Within a month",
  "No rush",
  "Specific date"
];

export const TypedInput = ({
  label,
  field,
  value,
  onChange,
  type = "text",
  options = [],
  disabled = false
}: TypedInputProps) => {
  const inputStyle = "border-2 border-black rounded-md";

  // Get the appropriate options based on the field
  const getFieldOptions = () => {
    switch (field) {
      case "service_type":
        return SERVICE_TYPES;
      case "tree_height":
        return TREE_HEIGHT_OPTIONS;
      case "timeframe":
        return TIMEFRAME_OPTIONS;
      default:
        return options;
    }
  };

  // Convert field to select type if it has predefined options
  const getInputType = () => {
    if (field === "service_type" || field === "tree_height" || field === "timeframe") {
      return "select";
    }
    return type;
  };

  const inputType = getInputType();
  const fieldOptions = getFieldOptions();

  if (inputType === "select" && fieldOptions.length > 0) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <Select
          value={String(value)}
          onValueChange={(val) => onChange(val)}
          disabled={disabled}
        >
          <SelectTrigger className={inputStyle}>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {fieldOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (type === "boolean") {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field}
          checked={Boolean(value)}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        <Label htmlFor={field}>{label}</Label>
      </div>
    );
  }

  if (type === "number") {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => {
            const val = e.target.value;
            // Only allow positive integers
            if (/^\d*$/.test(val)) {
              onChange(val ? parseInt(val) : "");
            }
          }}
          min="1"
          disabled={disabled}
          className={inputStyle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={inputStyle}
      />
    </div>
  );
};