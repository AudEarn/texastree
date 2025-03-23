import { Badge } from "@/components/ui/badge";

type LeadStatus = "new" | "assigned" | "contacted" | "converted" | "lost";

interface LeadStatusSectionProps {
  currentStatus: LeadStatus;
  onStatusUpdate: (status: LeadStatus) => void;
}

export const LeadStatusSection = ({ currentStatus, onStatusUpdate }: LeadStatusSectionProps) => {
  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-500 hover:bg-blue-600';
      case 'assigned': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'contacted': return 'bg-purple-500 hover:bg-purple-600';
      case 'converted': return 'bg-green-500 hover:bg-green-600';
      case 'lost': return 'bg-red-500 hover:bg-red-600';
      default: return '';
    }
  };

  return (
    <div>
      <h3 className="font-semibold">Lead Status</h3>
      <div className="mt-2 space-x-2">
        {(['new', 'assigned', 'contacted', 'converted', 'lost'] as LeadStatus[]).map((status) => (
          <Badge 
            key={status}
            variant="outline" 
            className={`cursor-pointer ${currentStatus === status ? `text-white ${getStatusColor(status)}` : ''}`}
            onClick={() => onStatusUpdate(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        ))}
      </div>
    </div>
  );
};