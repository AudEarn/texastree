import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Check, Copy } from "lucide-react";
import { useState } from "react";
import { LeadDetailsDialog } from "../LeadDetailsDialog";
import { LeadStatus } from "./types";

interface PendingSaleLeadsProps {
  leads: any[];
}

export const PendingSaleLeads = ({ leads }: PendingSaleLeadsProps) => {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: updateLeadStatus } = useMutation({
    mutationFn: async ({
      leadId,
      status,
      archive = false,
    }: {
      leadId: string;
      status: LeadStatus;
      archive?: boolean;
    }) => {
      const { error } = await supabase
        .from("quote_requests")
        .update({
          lead_status: status,
          is_archived: archive,
          payment_status: archive ? "canceled" : "pending",
        })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Success",
        description: "Lead status updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating lead status:", error);
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    },
  });

  const handleReturnToAvailable = (leadId: string) => {
    updateLeadStatus({ leadId, status: "new" });
  };

  const handleArchiveLead = (leadId: string) => {
    updateLeadStatus({ leadId, status: "pending_sale", archive: true });
  };

  const handleCopyLink = async (leadId: string, paymentLink: string) => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopiedLinks((prev) => ({ ...prev, [leadId]: true }));
      toast({
        title: "Success",
        description: "Payment link copied to clipboard",
      });
      setTimeout(() => {
        setCopiedLinks((prev) => ({ ...prev, [leadId]: false }));
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy payment link",
        variant: "destructive",
      });
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      pending: { variant: "secondary", label: "Pending" },
      paid: { variant: "success", label: "Paid" },
      canceled: { variant: "destructive", label: "Canceled" },
    };
    const { variant, label } = variants[status] || variants.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Payment Link</TableHead>
            <TableHead>Shares Sold</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-8 w-8" />
                  <p>No pending sale leads found</p>
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
                <TableCell>{lead.city}</TableCell>
                <TableCell>
                  {getPaymentStatusBadge(lead.payment_status)}
                </TableCell>
                <TableCell>
                  {lead.payment_link ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() =>
                              handleCopyLink(lead.id, lead.payment_link)
                            }
                          >
                            {copiedLinks[lead.id] ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            Copy Link
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to copy payment link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No link generated
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {lead.current_shares || 0} / {lead.max_shares || 3}
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
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReturnToAvailable(lead.id)}
                    >
                      Return to Available
                    </Button>
                    {((lead.max_shares &&
                      lead.current_shares < lead.max_shares) ||
                      !lead.max_shares) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Close & Archive
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Archive Lead</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will archive the lead and remove it from the
                              pending sales. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleArchiveLead(lead.id)}
                            >
                              Archive Lead
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
