import { Table, TableBody } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyTableHeader } from "./table/TableHeader";
import { CompanyTableRow } from "./table/TableRow";

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

interface CompaniesTableProps {
  companies: Company[];
  sortBy: 'name' | 'rating';
  sortOrder: 'asc' | 'desc';
  onSort: (column: 'name' | 'rating') => void;
  title: string;
  isVerifiedSection: boolean;
}

export const CompaniesTable = ({ 
  companies, 
  sortBy, 
  sortOrder, 
  onSort,
  title,
  isVerifiedSection
}: CompaniesTableProps) => {

  // Check if user is admin
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      return data;
    }
  });

  const isAdmin = profile?.is_admin;

  const sortCompanies = (companiesToSort: Company[]) => {
    return [...companiesToSort].sort((a, b) => {
      if (sortBy === 'name') {
        const comparison = a.business_name.localeCompare(b.business_name);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else if (sortBy === 'rating') {
        if (!a.google_rating && !b.google_rating) return 0;
        if (!a.google_rating) return 1;
        if (!b.google_rating) return -1;
        return sortOrder === 'asc' ? 
          a.google_rating - b.google_rating : 
          b.google_rating - a.google_rating;
      }
      return 0;
    });
  };

  const sortedCompanies = sortCompanies(companies);

  return (
    <div>
      <h3 className="text-lg font-semibold text-forest-700 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <CompanyTableHeader onSort={onSort} isAdmin={!!isAdmin} isVerifiedSection={isVerifiedSection} />
          <TableBody>
            {sortedCompanies.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-center text-gray-500 py-4">
                  No businesses found in this section
                </td>
              </tr>
            ) : (
              sortedCompanies.map(company => (
                <CompanyTableRow
                  key={company.id}
                  company={company}
                  isAdmin={!!isAdmin}
                  isVerifiedSection={isVerifiedSection}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};