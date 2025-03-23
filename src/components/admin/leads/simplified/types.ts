import { LeadType } from "../../lead-pricing/types";

export interface Lead {
  id: string;
  full_name: string;
  service_type: string;
  city: string;
  created_at: string;
  [key: string]: any;
}

export type LeadStatus = "new" | "assigned" | "contacted" | "converted" | "lost" | "pending_sale";

export interface PaymentLinksState {
  [key: string]: string;
}

export interface LeadTypeState {
  isShared: boolean;
  isExclusive: boolean;
  isEmergency: boolean;
  isVerifiedOnly: boolean;
  currentPrice: number | null;
}

export interface BusinessCredit {
  id: string;
  business_id: string;
  credits_remaining: number;
  tree_service_companies: {
    business_name: string;
  };
}