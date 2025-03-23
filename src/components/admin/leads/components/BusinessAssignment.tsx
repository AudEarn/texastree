import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface BusinessAssignmentProps {
  selectedBusiness: any;
  openBusinessSearch: boolean;
  setOpenBusinessSearch: (open: boolean) => void;
  businessSearch: string;
  setBusinessSearch: (search: string) => void;
  filteredBusinesses: any[];
  onSelectBusiness: (business: any) => void;
}

export const BusinessAssignment = ({
  selectedBusiness,
  openBusinessSearch,
  setOpenBusinessSearch,
  businessSearch,
  setBusinessSearch,
  filteredBusinesses,
  onSelectBusiness,
}: BusinessAssignmentProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-4">Assign to Business</h3>
      <Popover open={openBusinessSearch} onOpenChange={setOpenBusinessSearch}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openBusinessSearch}
            className="w-full justify-between"
          >
            {selectedBusiness
              ? selectedBusiness.business_name
              : "Select business..."}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder="Search businesses..."
              value={businessSearch}
              onValueChange={setBusinessSearch}
            />
            <CommandEmpty>No businesses found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[200px]">
                {filteredBusinesses.map((business) => (
                  <CommandItem
                    key={business.id}
                    onSelect={() => onSelectBusiness(business)}
                  >
                    {business.business_name} - {business.city}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
