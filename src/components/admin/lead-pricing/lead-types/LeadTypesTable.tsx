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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { LeadTypeData } from "../types";

interface LeadTypesTableProps {
  leadTypes?: LeadTypeData[];
}

export function LeadTypesTable({ leadTypes }: LeadTypesTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LeadTypeData>>({});

  const updateLeadType = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<LeadTypeData> & { id: string }) => {
      const { error } = await supabase
        .from("lead_types")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadTypes"] });
      setEditingId(null);
      setEditForm({});
      toast({
        title: "Success",
        description: "Lead type updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const deleteLeadType = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lead_types").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadTypes"] });
      toast({
        title: "Success",
        description: "Lead type deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const startEditing = (leadType: LeadTypeData) => {
    setEditingId(leadType.id);
    setEditForm(leadType);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = (id: string) => {
    if (editForm.name && typeof editForm.is_global === "boolean") {
      updateLeadType.mutate({ id, ...editForm });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Global</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leadTypes?.map((leadType) =>
          editingId === leadType.id ? (
            <TableRow key={leadType.id}>
              <TableCell>
                <Input
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={editForm.description || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={editForm.is_global}
                  onCheckedChange={(checked) =>
                    setEditForm((prev) => ({
                      ...prev,
                      is_global: checked === true,
                    }))
                  }
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdate(leadType.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={leadType.id}>
              <TableCell>{leadType.name}</TableCell>
              <TableCell>{leadType.description}</TableCell>
              <TableCell>{leadType.is_global ? "Yes" : "No"}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEditing(leadType)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Lead Type</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this lead type? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteLeadType.mutate(leadType.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}
