import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LeadTypeState } from "./types";

interface LeadTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leadTypeState: LeadTypeState;
  onSharedChange: (checked: boolean) => void;
  onExclusiveChange: (checked: boolean) => void;
  onEmergencyChange: (checked: boolean) => void;
  onVerifiedOnlyChange: (checked: boolean) => void;
  onGeneratePaymentLink: () => void;
  isGenerating: boolean;
}

export const LeadTypeDialog = ({
  isOpen,
  onOpenChange,
  leadTypeState,
  onSharedChange,
  onExclusiveChange,
  onEmergencyChange,
  onVerifiedOnlyChange,
  onGeneratePaymentLink,
  isGenerating,
}: LeadTypeDialogProps) => {
  const { isShared, isExclusive, isEmergency, isVerifiedOnly, currentPrice } =
    leadTypeState;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select lead type</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shared"
              checked={isShared}
              onCheckedChange={(checked) => onSharedChange(checked === true)}
            />
            <Label htmlFor="shared">Shared Lead</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclusive"
              checked={isExclusive}
              onCheckedChange={(checked) => onExclusiveChange(checked === true)}
            />
            <Label htmlFor="exclusive">Exclusive Lead</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="emergency"
              checked={isEmergency}
              onCheckedChange={(checked) => onEmergencyChange(checked === true)}
            />
            <Label htmlFor="emergency">Emergency Lead</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={isVerifiedOnly}
              onCheckedChange={(checked) =>
                onVerifiedOnlyChange(checked === true)
              }
            />
            <Label htmlFor="verified">
              Verified Businesses Only (3-hour priority window)
            </Label>
          </div>

          {currentPrice !== null && (
            <div className="text-lg font-semibold text-green-600">
              Price: ${currentPrice}
            </div>
          )}

          <Button
            onClick={onGeneratePaymentLink}
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Payment Link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
