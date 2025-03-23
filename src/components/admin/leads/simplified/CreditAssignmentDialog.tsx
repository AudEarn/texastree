import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BusinessCredit } from "./types";

interface CreditAssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  businessesWithCredits: BusinessCredit[] | undefined;
  selectedBusiness: BusinessCredit | null;
  onBusinessSelect: (business: BusinessCredit | null) => void;
  onAssignCredit: () => void;
}

export const CreditAssignmentDialog = ({
  isOpen,
  onOpenChange,
  businessesWithCredits,
  selectedBusiness,
  onBusinessSelect,
  onAssignCredit,
}: CreditAssignmentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Lead to Business</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Business</Label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => {
                const business = businessesWithCredits?.find(
                  (b) => b.id === e.target.value
                );
                onBusinessSelect(business || null);
              }}
              value={selectedBusiness?.id || ""}
            >
              <option value="">Select a business</option>
              {businessesWithCredits?.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.tree_service_companies.business_name} -{" "}
                  {business.credits_remaining} credits
                </option>
              ))}
            </select>
          </div>

          <Button onClick={onAssignCredit} className="w-full">
            Assign Lead and Deduct Credit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
