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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { LeadDetailsDialog } from "./LeadDetailsDialog";

interface UnclaimedLeadsListProps {
  leads: any[];
}

export const UnclaimedLeadsList = ({ leads }: UnclaimedLeadsListProps) => {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const { toast } = useToast();

  const { mutate: markNotificationSent } = useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase
        .from("quote_requests")
        .update({ unclaimed_notification_sent: true })
        .eq("id", leadId);

      if (error) throw error;
    },
    onError: (error) => {
      console.error("Error marking notification as sent:", error);
      toast({
        title: "Error",
        description: "Failed to update notification status",
        variant: "destructive",
      });
    },
  });

  const handleNotification = (lead: any) => {
    toast({
      title: "Unclaimed Lead Alert",
      description: `Lead from ${
        lead.city
      } has been unclaimed for ${formatDistanceToNow(
        new Date(lead.created_at)
      )}`,
      variant: "destructive",
    });
    markNotificationSent(lead.id);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Original City</TableHead>
            <TableHead>Time Unclaimed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-8 w-8" />
                  <p>No unclaimed leads found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
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
                <TableCell>
                  <Badge variant="outline">
                    {lead.original_city || lead.city}
                  </Badge>
                </TableCell>
                <TableCell>
                  {lead.last_reassigned_at
                    ? formatDistanceToNow(new Date(lead.last_reassigned_at), {
                        addSuffix: true,
                      })
                    : formatDistanceToNow(new Date(lead.created_at), {
                        addSuffix: true,
                      })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                    >
                      View Details
                    </Button>
                    {!lead.unclaimed_notification_sent && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleNotification(lead)}
                      >
                        Send Alert
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
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
