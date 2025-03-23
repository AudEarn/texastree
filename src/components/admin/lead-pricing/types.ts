export type LeadType = string;

export type LeadStatus = "new" | "assigned" | "contacted" | "converted" | "lost" | "pending_sale";

export interface LeadPrice {
  id: string;
  lead_type: LeadType;
  lead_type_id?: string;
  price: number;
}

export interface CityPrice extends LeadPrice {
  city: string;
}

export interface LeadSettings {
  id: string;
  shared_lead_max_purchases: number;
  unclaimed_period_hours: number;
  auto_notification_enabled: boolean;
}

export interface LeadTypeData {
  id: string;
  name: string;
  description: string | null;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

export type NewLeadType = {
  name: string;
  description: string;
  is_global: boolean;
};