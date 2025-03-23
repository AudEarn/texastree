import { DefaultPricingTable } from "./lead-pricing/DefaultPricingTable";
import { CityPricingTable } from "./lead-pricing/CityPricingTable";
import { LeadSettings } from "./lead-pricing/LeadSettings";
import { LeadTypesManager } from "./lead-pricing/LeadTypesManager";

export function LeadPricingSettings() {
  return (
    <div className="space-y-8">
      <LeadTypesManager />
      <DefaultPricingTable />
      <CityPricingTable />
      <LeadSettings />
    </div>
  );
}