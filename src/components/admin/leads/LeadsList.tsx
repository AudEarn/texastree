import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";
import { LeadDetailsDialog } from "./LeadDetailsDialog";

interface LeadsListProps {
  leads?: any[];
  filter: "all" | "new" | "assigned" | "contacted" | "converted";
}

export const LeadsList = ({ leads = [], filter }: LeadsListProps) => {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "assigned":
        return "bg-yellow-500";
      case "contacted":
        return "bg-purple-500";
      case "converted":
        return "bg-green-500";
      case "lost":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!Array.isArray(leads)) {
    console.error("Leads prop is not an array:", leads);
    return (
      <div className="text-center py-4 text-gray-500">No leads available</div>
    );
  }

  if (leads.length === 0) {
    return <div className="text-center py-4 text-gray-500">No leads found</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
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
                <Badge className={getStatusColor(lead.lead_status)}>
                  {lead.lead_status.charAt(0).toUpperCase() +
                    lead.lead_status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLead(lead)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <LeadDetailsDialog
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={() => setSelectedLead(null)}
      />
    </>
  );
};
