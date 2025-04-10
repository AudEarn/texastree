import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NewLeadType } from "../types";

export function AddLeadTypeForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newLeadType, setNewLeadType] = useState<Partial<NewLeadType>>({
    is_global: true,
  });

  const addLeadType = useMutation({
    mutationFn: async (newType: NewLeadType) => {
      // Use the API route to bypass RLS policies
      const response = await fetch('/api/admin/lead-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newType),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add lead type');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadTypes"] });
      queryClient.invalidateQueries({ queryKey: ["leadPricingDefaults"] });
      setNewLeadType({ is_global: true });
      toast({
        title: "Success",
        description: "Lead type added successfully",
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

  const handleAddLeadType = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLeadType.name?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name is required",
      });
      return;
    }

    if (!newLeadType.description?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Description is required",
      });
      return;
    }

    addLeadType.mutate({
      name: newLeadType.name.toLowerCase(),
      description: newLeadType.description,
      is_global: newLeadType.is_global ?? true,
    } as NewLeadType);
  };

  return (
    <form onSubmit={handleAddLeadType} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={newLeadType.name || ""}
            onChange={(e) =>
              setNewLeadType((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Enter name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={newLeadType.description || ""}
            onChange={(e) =>
              setNewLeadType((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Enter description"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Global</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is_global"
              checked={newLeadType.is_global}
              onCheckedChange={(checked) =>
                setNewLeadType((prev) => ({
                  ...prev,
                  is_global: checked === true,
                }))
              }
            />
            <label
              htmlFor="is_global"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Available in all cities
            </label>
          </div>
        </div>
      </div>
      <Button type="submit">Add Lead Type</Button>
    </form>
  );
}
