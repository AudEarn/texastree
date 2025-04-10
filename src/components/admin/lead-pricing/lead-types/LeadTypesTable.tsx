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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Add Loader2 to the imports
import { ArrowDown, ArrowUp, Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { LeadTypeData } from "../types";

interface LeadTypesTableProps {
  leadTypes?: LeadTypeData[];
}

export function LeadTypesTable({ leadTypes = [] }: LeadTypesTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LeadTypeData>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LeadTypeData;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  // Fetch lead types with sorting from the backend
  const { data: sortedLeadTypes = leadTypes, isLoading } = useQuery({
    queryKey: ['leadTypes', sortConfig.key, sortConfig.direction],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/lead-types?sort=${sortConfig.key}&order=${sortConfig.direction}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch lead types');
      }
      return response.json();
    },
    // Use the provided leadTypes as initial data
    initialData: leadTypes,
    // Only fetch from backend when we have a sort config change
    enabled: leadTypes.length > 0,
  });

  const requestSort = (key: keyof LeadTypeData) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const updateLeadType = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<LeadTypeData> & { id: string }) => {
      const response = await fetch('/api/admin/lead-types', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update lead type');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadTypes"] });
      toast({
        title: "Success",
        description: "Lead type updated successfully",
      });
      // Delay reset of form state
      setTimeout(() => {
        setEditingId(null);
        setEditForm({});
      }, 1000);
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
      const response = await fetch(`/api/admin/lead-types?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete lead type');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadTypes"] });
      queryClient.invalidateQueries({ queryKey: ["leadPricingDefaults"] });
      toast({
        title: "Success",
        description: "Lead type deleted successfully",
      });
      // Let the success message show before closing
      setTimeout(() => {
        const dialogElement = document.querySelector('[role="dialog"]');
        if (dialogElement) {
          const closeButton = dialogElement.querySelector('button[data-state="open"]');
          closeButton?.click();
        }
      }, 1000);
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
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name and Global status are required",
      });
    }
  };

  const getSortIcon = (key: keyof LeadTypeData) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4 inline ml-1" /> : 
      <ArrowDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => requestSort('name')} className="cursor-pointer">
            Name {getSortIcon('name')}
          </TableHead>
          <TableHead onClick={() => requestSort('description')} className="cursor-pointer">
            Description {getSortIcon('description')}
          </TableHead>
          <TableHead onClick={() => requestSort('is_global')} className="cursor-pointer">
            Global {getSortIcon('is_global')}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedLeadTypes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No lead types found
            </TableCell>
          </TableRow>
        ) : (
          sortedLeadTypes.map((leadType) =>
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
                    disabled={updateLeadType.isPending}
                  >
                    {updateLeadType.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
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
                          disabled={deleteLeadType.isPending}
                        >
                          {deleteLeadType.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )
          )
        )}
      </TableBody>
    </Table>
  );
}
