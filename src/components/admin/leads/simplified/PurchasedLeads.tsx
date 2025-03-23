import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface PurchasedLeadsProps {
  leads: any[];
}

export const PurchasedLeads = ({ leads }: PurchasedLeadsProps) => {
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleUpdateNotes = async () => {
    try {
      const { error } = await supabase
        .from("lead_purchases")
        .update({ notes })
        .eq("id", selectedPurchase.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notes updated successfully",
      });

      setSelectedPurchase(null);
      setNotes("");
    } catch (error) {
      console.error("Error updating notes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notes",
      });
    }
  };

  const sortLeads = (a: any, b: any) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "customer":
        return direction * a.full_name.localeCompare(b.full_name);
      case "business":
        return (
          direction *
          (
            a.lead_purchases[0]?.tree_service_companies?.business_name || ""
          ).localeCompare(
            b.lead_purchases[0]?.tree_service_companies?.business_name || ""
          )
        );
      case "date":
      default:
        return (
          direction *
          (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        );
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedLeads = [...leads].sort(sortLeads);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => toggleSort("customer")}
              className="cursor-pointer"
            >
              Customer{" "}
              {sortField === "customer" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              onClick={() => toggleSort("business")}
              className="cursor-pointer"
            >
              Business{" "}
              {sortField === "business" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              onClick={() => toggleSort("date")}
              className="cursor-pointer"
            >
              Date{" "}
              {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.full_name}</TableCell>
              <TableCell>
                {lead.lead_purchases[0]?.tree_service_companies?.business_name}
              </TableCell>
              <TableCell>
                {new Date(lead.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>${lead.lead_purchases[0]?.amount_paid}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPurchase(lead.lead_purchases[0]);
                        setNotes(lead.lead_purchases[0]?.notes || "");
                      }}
                    >
                      View/Edit Notes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Lead Sale Notes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Enter notes about this sale"
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleUpdateNotes} className="w-full">
                        Save Notes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
