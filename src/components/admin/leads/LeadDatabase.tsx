import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Archive, User } from "lucide-react";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const LeadDatabase = () => {
  const [selectedLead, setSelectedLead] = useState(null);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_requests')
        .select(`
          *,
          tree_service_companies (
            business_name
          ),
          user:user_id (
            id,
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
      console.log('Fetched leads with profiles:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lead Database</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>User Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads?.map((lead) => (
                <TableRow 
                  key={lead.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedLead(lead)}
                >
                  <TableCell>{format(new Date(lead.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{lead.full_name}</TableCell>
                  <TableCell>{lead.original_city}, TX</TableCell>
                  <TableCell>
                    {lead.tree_service_companies?.business_name || (
                      <span className="text-muted-foreground text-sm">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>{lead.service_type}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={lead.lead_type === 'exclusive' ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {lead.lead_status === 'new' && (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {lead.is_archived ? (
                        <div className="flex items-center gap-1">
                          <Archive className="h-3 w-3" />
                          Archived
                        </div>
                      ) : (
                        lead.lead_type || 'standard'
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>${lead.price || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {lead.user ? (
                        <span className="text-xs text-muted-foreground">
                          Created {format(new Date(lead.user.created_at), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-xs text-red-500">No user account</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedLead && (
        <LeadDetailsDialog
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
        />
      )}
    </div>
  );
};