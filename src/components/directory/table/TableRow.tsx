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
import Image from "next/image";
import { useState } from "react";
import { EditBusinessForm } from "../EditBusinessForm";
import { StarRating } from "../StarRating";
import ImageMagnifier from "@/components/common/ImageMagnifier";

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
  description?: string | null;
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
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);

  const defaultDescription =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, nulla obcaecati, consequatur deserunt ratione eum corporis adipisci perspiciatis officiis labore expedita quasi ab beatae fugit necessitatibus illo cumque. At, quisquam?";

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
        <TableCell className="max-w-[50px]">
            {/* can you please add a hover effect of below div. if i hover it will scale 1.5 */}
          <div className="rounded-full h-12 w-12 overflow-hidden hover:scale-125 transition-all ease-linear duration-500 ">
            <Image
              height={300}
              width={300}
              src={company?.logo_url || ""}
              alt={company?.business_name}
              className="object-contain"
            />
            {/* <ImageMagnifier
          width={400}
          height={400}
          src={company?.logo_url || ""}
          alt={`${company.business_name} featured image`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        /> */}

          </div>
        </TableCell>
      )}

      <TableCell className="max-w-[250px]">
        <div className="">
          <div className="flex items-center gap-2 text-gray-800">
            <span
              className={`truncate ${isVerifiedSection ? "font-bold" : ""}`}
            >
              {company.business_name}
            </span>
            {company.is_verified && (
              <Badge variant="secondary" className="ml-1 shrink-0">
                <Shield className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">Verified</span>
              </Badge>
            )}
          </div>
          {isVerifiedSection && (
            <div className="mt-2">
              <p className="text-wrap text-sm text-gray-600">
                {company?.description?.slice(0, 100) ||
                  defaultDescription.slice(0, 100)}
                ...
              </p>
              <Button
                variant="link"
                className="text-forest-600 p-0 h-auto text-sm"
                onClick={() => setIsDescriptionDialogOpen(true)}
              >
                See More
              </Button>
            </div>
          )}
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

      <Dialog
        open={isDescriptionDialogOpen}
        onOpenChange={setIsDescriptionDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{company.business_name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {company?.description || defaultDescription}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </TableRow>
  );
};
