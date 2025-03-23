import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Shield } from "lucide-react";
import { useState } from "react";
import { EditBusinessForm } from "../EditBusinessForm";
import { StarRating } from "../StarRating";

interface Company {
  id: string;
  business_name: string;
  contact_phone: string | null;
  contact_email: string | null;
  google_rating: number | null;
  website_url: string | null;
  business_statement: string | null;
  feature_images: string[] | null;
  logo_url: string | null;
  is_verified: boolean;
  featured_in_city: boolean | null;
  city: string;
}

interface CompanyTableRowProps {
  company: Company;
  isAdmin: boolean;
  isVerifiedSection: boolean;
}

export const CompanyTableRow = ({
  company,
  isAdmin,
  isVerifiedSection,
}: CompanyTableRowProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <TableRow
      className={`
        ${
          isVerifiedSection
            ? "bg-gradient-to-r from-forest-50/50 via-forest-100/30 to-forest-50/50 border-forest-200 shadow-lg"
            : ""
        }
        transition-all duration-200 hover:bg-forest-50/30
      `}
    >
      <TableCell className="max-w-[250px]">
        <div className="flex items-center gap-2">
          <span className={`truncate ${isVerifiedSection ? "font-bold" : ""}`}>
            {company.business_name}
          </span>
          {company.is_verified && (
            <Badge variant="secondary" className="ml-1 shrink-0">
              <Shield className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
              <span className="font-bold">Verified</span>
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{company.contact_phone || "N/A"}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {company.google_rating ? (
            <span className="font-bold">
              {company.google_rating.toFixed(1)}
            </span>
          ) : (
            <span className="text-gray-500">N/A</span>
          )}
          <StarRating rating={company.google_rating} />
        </div>
      </TableCell>
      <TableCell>
        {company.website_url ? (
          <a
            href={company.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest-600 hover:underline whitespace-nowrap"
          >
            Visit Website
          </a>
        ) : (
          "N/A"
        )}
      </TableCell>
      {isAdmin && (
        <TableCell>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Business Details</DialogTitle>
              </DialogHeader>
              <EditBusinessForm
                business={company}
                onSuccess={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </TableCell>
      )}
    </TableRow>
  );
};
