import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadsList } from "./LeadsList";

interface LeadTabContentProps {
  title: string;
  leads?: any[];
  filter: 'all' | 'new' | 'assigned' | 'contacted' | 'converted';
}

export const LeadTabContent = ({ title, leads = [], filter }: LeadTabContentProps) => {
  const filteredLeads = filter === 'all' 
    ? leads 
    : (Array.isArray(leads) ? leads.filter(lead => lead.lead_status === filter) : []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <LeadsList leads={filteredLeads} filter={filter} />
      </CardContent>
    </Card>
  );
};