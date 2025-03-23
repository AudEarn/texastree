import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { AvailableLeads } from "./simplified/AvailableLeads";
import { PendingSaleLeads } from "./simplified/PendingSaleLeads";
import { PurchasedLeads } from "./simplified/PurchasedLeads";
import { ArchivedLeads } from "./simplified/ArchivedLeads";

export const LeadManagementDashboard = () => {
  const { toast } = useToast();

  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('quote_requests')
          .select(`
            *,
            lead_purchases (
              *,
              tree_service_companies (
                business_name
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching leads:', fetchError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch leads. Please try again.",
          });
          throw fetchError;
        }
        
        // Transform the data to include the city
        const transformedData = data?.map(lead => {
          // Extract city from address (assuming format: "street, city, state zip")
          const addressParts = lead.address.split(',');
          const city = addressParts.length > 1 ? addressParts[1].trim() : '';
          
          return {
            ...lead,
            city
          };
        });

        console.log('All leads fetched:', transformedData);
        return transformedData;
      } catch (err) {
        console.error('Error in query:', err);
        throw err;
      }
    },
  });

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-red-500 space-y-4">
        <AlertCircle className="h-12 w-12" />
        <p className="text-lg font-medium">Error loading leads</p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!leads?.length) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-muted-foreground space-y-4">
        <AlertCircle className="h-12 w-12" />
        <p className="text-lg font-medium">No leads found</p>
        <p className="text-sm">There are currently no leads in the system.</p>
      </div>
    );
  }

  // Debug logs to understand the data
  console.log('Total leads:', leads.length);
  console.log('Leads with status "new":', leads.filter(lead => lead.lead_status === 'new').length);
  console.log('Non-archived leads:', leads.filter(lead => !lead.is_archived).length);
  console.log('Leads without purchases:', leads.filter(lead => !lead.lead_purchases?.length).length);

  // Updated filtering logic for available leads - now includes both new and assigned leads without purchases
  const availableLeads = leads.filter(lead => {
    const isAvailable = (lead.lead_status === 'new' || lead.lead_status === 'assigned') && 
                       !lead.is_archived &&
                       !lead.lead_purchases?.length;
    
    if (isAvailable) {
      console.log('Found available lead:', lead);
    }
    
    return isAvailable;
  });
  
  const pendingSaleLeads = leads.filter(lead => 
    lead.lead_status === 'pending_sale' && 
    !lead.is_archived
  );
  
  const purchasedLeads = leads.filter(lead => 
    lead.lead_purchases?.length > 0 && 
    !lead.is_archived
  );

  const archivedLeads = leads.filter(lead => 
    lead.is_archived
  );

  console.log('Available Leads:', availableLeads);
  console.log('Pending Sale Leads:', pendingSaleLeads);
  console.log('Purchased Leads:', purchasedLeads);
  console.log('Archived Leads:', archivedLeads);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lead Management</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available for Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailableLeads leads={availableLeads} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <PendingSaleLeads leads={pendingSaleLeads} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchased Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <PurchasedLeads leads={purchasedLeads} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Archived Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ArchivedLeads leads={archivedLeads} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};