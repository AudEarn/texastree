import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface TableHeaderProps {
  onSort: (column: "name" | "rating") => void;
  isAdmin: boolean;
  isVerifiedSection: boolean;
}

export const CompanyTableHeader = ({ onSort, isAdmin, isVerifiedSection }: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {isVerifiedSection && <TableHead className="w-[5%]">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-left p-0"
          >
            Logo
          </Button>
        </TableHead>}
        <TableHead className="w-[40%]">
          <Button
            variant="ghost"
            onClick={() => onSort("name")}
            className="flex items-center gap-2"
          >
            Business Name
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead className="w-[20%]">Contact</TableHead>
        <TableHead className="w-[20%]">
          <Button
            variant="ghost"
            onClick={() => onSort("rating")}
            className="flex items-center gap-2"
          >
            Avg. Review
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead className="w-[20%]">Website</TableHead>
       
        {isAdmin && <TableHead className="w-[10%]">Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
};
