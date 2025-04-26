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
import Image from "next/image";

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
        {isVerifiedSection && (
      <TableCell className="max-w-[250px]">
        <div className="">
            <Image height={300} width={300} src={company?.logo_url || ""} alt={company?.business_name} />
          </div>
      </TableCell>
            )}


      <TableCell className="max-w-[250px]">
        <div className="">

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
        {isVerifiedSection && (company?.description?.slice(0, 100) || <p className="text-wrap">{"Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, nulla obcaecati, consequatur deserunt ratione eum corporis adipisci perspiciatis officiis labore expedita quasi ab beatae fugit necessitatibus illo cumque. At, quisquam?".slice(0, 100)}...</p>)}
          </div>
      </TableCell>
      <TableCell>{company.contact_phone || "N/A"}</TableCell>
      <TableCell>
        <div className="flex ps-3 flex-col gap-1">
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
      {isVerifiedSection && (
      <TableCell className="max-w-[80px]">
        <div className="">
            <Image height={300} width={300} src={company?.feature_images[0] || ""} alt={company?.business_name} />
          </div>
      </TableCell>
            )}
    </TableRow>
  );
};
