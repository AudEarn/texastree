import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadPrice, LeadTypeData } from "../types";
import { PriceUpdateForm } from "./PriceUpdateForm";

interface DefaultPricesTableProps {
  defaultPrices: (LeadPrice & { lead_type: LeadTypeData })[];
}

export function DefaultPricesTable({ defaultPrices }: DefaultPricesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lead Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price ($)</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultPrices.map((price) => (
          <TableRow key={price.id}>
            <TableCell className="font-medium capitalize">
              {price.lead_type?.name || "Unknown"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {price.lead_type?.description || "No description"}
            </TableCell>
            <TableCell>
              <PriceUpdateForm price={price} />
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}