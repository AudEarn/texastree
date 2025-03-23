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
  DialogHeader as BaseDialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Database } from "@/integrations/supabase/types";
import { Trash2 } from "lucide-react";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

interface DialogHeaderProps {
  lead: QuoteRequest;
  editMode: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export const DialogHeader = ({
  lead,
  editMode,
  isUpdating,
  isDeleting,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: DialogHeaderProps) => {
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

  return (
    <BaseDialogHeader className="flex flex-row justify-between items-center border-b pb-4">
      <div className="flex flex-col gap-2">
        <DialogTitle>Lead Details</DialogTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Lead Status:</span>
          <Badge className={getStatusColor(lead.lead_status)}>
            {lead.lead_status.charAt(0).toUpperCase() +
              lead.lead_status.slice(1)}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {editMode ? (
          <>
            <Button onClick={onSave} variant="default" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
            <Button onClick={onCancel} variant="outline" disabled={isUpdating}>
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={onEdit} variant="outline">
            Edit
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Lead"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this lead?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                lead and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </BaseDialogHeader>
  );
};
