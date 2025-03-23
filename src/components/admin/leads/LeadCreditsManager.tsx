import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";

export const LeadCreditsManager = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [credits, setCredits] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch businesses with their lead credits
  const { data: businessesWithCredits } = useQuery({
    queryKey: ["businesses-credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_lead_credits")
        .select(
          `
          *,
          tree_service_companies (
            id,
            business_name,
            city
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch all businesses
  const { data: allBusinesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tree_service_companies")
        .select("id, business_name, city")
        .order("business_name");

      if (error) throw error;
      return data;
    },
  });

  const addCreditsMutation = useMutation({
    mutationFn: async (businessId: string) => {
      const { data, error } = await supabase
        .from("business_lead_credits")
        .insert({
          business_id: businessId,
          credits_remaining: parseInt(credits),
          notes,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses-credits"] });
      toast({
        title: "Success",
        description: "Lead credits added successfully",
      });
      setSelectedBusiness(null);
      setCredits("");
      setNotes("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add lead credits",
      });
    },
  });

  const updateCreditsMutation = useMutation({
    mutationFn: async ({
      id,
      credits,
      notes,
    }: {
      id: string;
      credits: number;
      notes: string;
    }) => {
      const { data, error } = await supabase
        .from("business_lead_credits")
        .update({
          credits_remaining: credits,
          notes,
        })
        .eq("id", id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses-credits"] });
      toast({
        title: "Success",
        description: "Lead credits updated successfully",
      });
      setSelectedBusiness(null);
      setCredits("");
      setNotes("");
      setIsEditMode(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead credits",
      });
    },
  });

  const handleAddCredits = () => {
    if (!selectedBusiness || !credits) return;
    addCreditsMutation.mutate(selectedBusiness.id);
  };

  const handleUpdateCredits = () => {
    if (!selectedBusiness || !credits) return;
    updateCreditsMutation.mutate({
      id: selectedBusiness.id,
      credits: parseInt(credits),
      notes,
    });
  };

  const handleEditClick = (business: any) => {
    setSelectedBusiness(business);
    setCredits(business.credits_remaining.toString());
    setNotes(business.notes || "");
    setIsEditMode(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Lead Credits Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditMode(false);
                setSelectedBusiness(null);
                setCredits("");
                setNotes("");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Credits
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Lead Credits" : "Add Lead Credits"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {!isEditMode && (
                <div className="space-y-2">
                  <Label>Business</Label>
                  <select
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                      const business = allBusinesses?.find(
                        (b) => b.id === e.target.value
                      );
                      setSelectedBusiness(business);
                    }}
                    value={selectedBusiness?.id || ""}
                  >
                    <option value="">Select a business</option>
                    {allBusinesses?.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.business_name} - {business.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Number of Credits</Label>
                <Input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about these credits"
                />
              </div>
              <Button
                className="w-full"
                onClick={isEditMode ? handleUpdateCredits : handleAddCredits}
              >
                {isEditMode ? "Update Credits" : "Add Credits"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Credits Remaining</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessesWithCredits?.map((credit) => (
            <TableRow key={credit.id}>
              <TableCell>
                {credit.tree_service_companies?.business_name}
              </TableCell>
              <TableCell>{credit.tree_service_companies?.city}</TableCell>
              <TableCell>{credit.credits_remaining}</TableCell>
              <TableCell>{credit.notes}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(credit)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
