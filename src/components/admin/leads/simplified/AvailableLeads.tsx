import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeadsTable } from "./LeadsTable";
import { LeadTypeDialog } from "./LeadTypeDialog";
import { CreditAssignmentDialog } from "./CreditAssignmentDialog";
import { Lead, BusinessCredit, PaymentLinksState } from "./types";

export const AvailableLeads = ({ leads }: { leads: Lead[] }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [isAssignCreditDialogOpen, setIsAssignCreditDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessCredit | null>(null);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinksState>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: businessesWithCredits } = useQuery({
    queryKey: ['businesses-credits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_lead_credits')
        .select(`
          *,
          tree_service_companies (
            id,
            business_name,
            city
          )
        `)
        .gt('credits_remaining', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BusinessCredit[];
    },
  });

  const handleGeneratePaymentLink = async (isExclusive: boolean) => {
    if (!selectedLead) return;
    
    setIsGenerating(true);
    try {
      // First update the lead with the type and max shares
      const { error: updateError } = await supabase
        .from('quote_requests')
        .update({
          lead_type: isExclusive ? 'exclusive' : 'shared',
          lead_status: 'pending_sale',
          max_shares: isExclusive ? 1 : 3,
        })
        .eq('id', selectedLead.id);

      if (updateError) throw updateError;

      // Then generate the payment link
      const { data, error } = await supabase.functions.invoke('create-lead-payment-link', {
        body: { 
          leadId: selectedLead.id,
          leadType: isExclusive ? 'exclusive' : 'shared',
        }
      });

      if (error) throw error;

      if (!data?.url) {
        throw new Error('No payment URL returned from the server');
      }

      setPaymentLinks(prev => ({
        ...prev,
        [selectedLead.id]: data.url
      }));

      toast({
        title: "Success",
        description: "Payment link generated successfully",
      });

      setIsSellDialogOpen(false);
      setSelectedLead(null);
    } catch (error: any) {
      console.error('Error generating payment link:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate payment link",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAssignCredit = async () => {
    if (!selectedBusiness || !selectedLead) {
      toast({
        title: "Error",
        description: "Please select a business to assign the credit to",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: leadError } = await supabase
        .from('quote_requests')
        .update({ 
          business_id: selectedBusiness.business_id,
          lead_status: 'assigned'
        })
        .eq('id', selectedLead.id);

      if (leadError) throw leadError;

      const { error: creditError } = await supabase
        .from('business_lead_credits')
        .update({ 
          credits_remaining: selectedBusiness.credits_remaining - 1 
        })
        .eq('id', selectedBusiness.id);

      if (creditError) throw creditError;

      const { data: business } = await supabase
        .from('tree_service_companies')
        .select('business_name, contact_email')
        .eq('id', selectedBusiness.business_id)
        .single();

      if (business?.contact_email) {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            businessEmail: business.contact_email,
            businessName: business.business_name,
            leadDetails: {
              fullName: selectedLead.full_name,
              phone: selectedLead.phone,
              email: selectedLead.email,
              address: selectedLead.address,
              serviceType: selectedLead.service_type,
              treeCount: selectedLead.tree_count,
              treeHeight: selectedLead.tree_height,
              debrisHauling: selectedLead.debris_hauling,
              timeframe: selectedLead.timeframe,
              description: selectedLead.description,
            },
          },
        });
      }

      toast({
        title: "Success",
        description: "Lead assigned and credit deducted successfully",
      });

      setIsAssignCreditDialogOpen(false);
      setSelectedBusiness(null);
      setSelectedLead(null);
    } catch (error: any) {
      console.error('Error assigning credit:', error);
      toast({
        title: "Error",
        description: "Failed to assign credit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <LeadsTable
        leads={leads}
        paymentLinks={paymentLinks}
        onSellExclusive={(lead) => {
          setSelectedLead(lead);
          handleGeneratePaymentLink(true);
        }}
        onSellShared={(lead) => {
          setSelectedLead(lead);
          handleGeneratePaymentLink(false);
        }}
        onAssignCreditClick={(lead) => {
          setSelectedLead(lead);
          setIsAssignCreditDialogOpen(true);
        }}
      />

      <CreditAssignmentDialog
        isOpen={isAssignCreditDialogOpen}
        onOpenChange={setIsAssignCreditDialogOpen}
        businessesWithCredits={businessesWithCredits}
        selectedBusiness={selectedBusiness}
        onBusinessSelect={setSelectedBusiness}
        onAssignCredit={handleAssignCredit}
      />
    </div>
  );
};