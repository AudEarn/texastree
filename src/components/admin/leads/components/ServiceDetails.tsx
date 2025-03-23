import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { texasCities } from "@/data/texas-cities";
import { Edit } from "lucide-react";

interface ServiceDetailsProps {
  lead: any;
  editingCity: boolean;
  newCity: string;
  setNewCity: (city: string) => void;
  handleCityEdit: () => void;
  setEditingCity: (editing: boolean) => void;
}

export const ServiceDetails = ({
  lead,
  editingCity,
  newCity,
  setNewCity,
  handleCityEdit,
  setEditingCity,
}: ServiceDetailsProps) => {
  return (
    <div>
      <h3 className="font-semibold">Service Details</h3>
      <div className="mt-2 space-y-2">
        <p>
          <span className="font-medium">Service Type:</span> {lead.service_type}
        </p>
        <p>
          <span className="font-medium">Tree Count:</span> {lead.tree_count}
        </p>
        <p>
          <span className="font-medium">Tree Height:</span> {lead.tree_height}
        </p>
        <p>
          <span className="font-medium">Debris Hauling:</span>{" "}
          {lead.debris_hauling ? "Yes" : "No"}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-medium">Timeframe:</span>
          {editingCity ? (
            <div className="flex items-center gap-2">
              <Select value={newCity} onValueChange={setNewCity}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {texasCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleCityEdit}>
                Save
              </Button>
            </div>
          ) : (
            <>
              {lead.specific_date || lead.timeframe}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingCity(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
