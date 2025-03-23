import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Lead } from "./types";

interface LeadsTableProps {
  leads: Lead[];
  paymentLinks?: { [key: string]: string };
  onSellExclusive?: (lead: Lead) => void;
  onSellShared?: (lead: Lead) => void;
  onAssignCreditClick?: (lead: Lead) => void;
  isPendingSale?: boolean;
  onViewDetails?: (lead: Lead) => void;
  onReturnToAvailable?: (lead: Lead) => void;
  onCloseAndArchive?: (lead: Lead) => void;
}

export const LeadsTable = ({
  leads,
  paymentLinks,
  onSellExclusive,
  onSellShared,
  onAssignCreditClick,
  isPendingSale = false,
  onViewDetails,
  onReturnToAvailable,
  onCloseAndArchive,
}: LeadsTableProps) => {
  if (!leads?.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No leads found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {!isPendingSale ? (
            <>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </>
          ) : (
            <>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Payment Link</TableHead>
              <TableHead>Shares Sold</TableHead>
              <TableHead>Actions</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            {!isPendingSale ? (
              <>
                <TableCell>
                  <div>
                    <div className="font-medium">{lead.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {lead.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{lead.service_type}</TableCell>
                <TableCell>{lead.city}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(lead.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {(onSellExclusive || onSellShared) && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => onSellExclusive?.(lead)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Sell Exclusive
                        </Button>
                        <Button
                          onClick={() => onSellShared?.(lead)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Sell Shared
                        </Button>
                      </div>
                    )}
                    {onAssignCreditClick && (
                      <Button
                        onClick={() => onAssignCreditClick(lead)}
                        variant="secondary"
                        size="sm"
                      >
                        Assign as credit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>
                  {formatDistanceToNow(new Date(lead.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{lead.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {lead.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{lead.service_type}</TableCell>
                <TableCell>{lead.city}</TableCell>
                <TableCell>
                  {paymentLinks?.[lead.id] && (
                    <Button
                      variant="link"
                      className="text-forest-600 hover:text-forest-700"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentLinks[lead.id]);
                      }}
                    >
                      Copy Link
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {lead.current_shares || 0} / {lead.max_shares || 3}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onViewDetails && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(lead)}
                      >
                        View Details
                      </Button>
                    )}
                    {onReturnToAvailable && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onReturnToAvailable(lead)}
                      >
                        Return to Available
                      </Button>
                    )}
                    {onCloseAndArchive && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onCloseAndArchive(lead)}
                      >
                        Close & Archive
                      </Button>
                    )}
                  </div>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
