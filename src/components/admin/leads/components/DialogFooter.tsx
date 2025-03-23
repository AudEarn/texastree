import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

interface DialogFooterProps {
  lead: QuoteRequest;
}

export const DialogFooter = ({ lead }: DialogFooterProps) => {
  return (
    <div className="border-t pt-4 mt-4">
      <p className="text-xs text-muted-foreground">
        Created {format(new Date(lead.created_at), 'PPpp')}
        {lead.last_reassigned_at && (
          <> • Last reassigned {format(new Date(lead.last_reassigned_at), 'PPpp')}</>
        )}
      </p>
      {lead.original_city && (
        <p className="text-xs text-muted-foreground mt-1">
          Originally from {lead.original_city}
        </p>
      )}
    </div>
  );
};