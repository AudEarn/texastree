import { DefaultPricingTable } from "./DefaultPricingTable";
import { CityPricingTable } from "./CityPricingTable";
import { LeadSettings } from "./LeadSettings";
import { LeadTypesManager } from "./LeadTypesManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LeadPricingSettings() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="types">Lead Types</TabsTrigger>
          <TabsTrigger value="global">Global Pricing</TabsTrigger>
          <TabsTrigger value="city">City Pricing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="types" className="mt-4">
          <LeadTypesManager />
        </TabsContent>
        
        <TabsContent value="global" className="mt-4">
          <DefaultPricingTable />
        </TabsContent>
        
        <TabsContent value="city" className="mt-4">
          <CityPricingTable />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <LeadSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}