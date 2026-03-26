export interface DonationResponse {
  success: boolean;
  message: string;
  data: DonationData;
}

export interface DonationData {
  donation: Donation;
  payment_url: string;
}

export interface Donation {
  id: number;
  type: string;
  attributes: DonationAttributes;
  relationships: any[]; // or define if needed later
  meta: DonationMeta;
}

export interface DonationAttributes {
  amount: string;
  donation_type: string;
  payment_method: string;
  payment_gateway: string;
  transaction_reference: string;
  status: "pending" | "completed" | "failed";
  note: string;
  is_anonymous: boolean;
}

export interface DonationMeta {
  created_at: string; // ISO timestamp
  updated_at: string;
}

export interface DonationRequest {
  amount: number;
  donationTypeId: string | null;
  currency: string;
  paymentMethod: string;
  note?: string;
  isAnonymous: boolean;
}

export interface DonationHistoryResponse {
  success: boolean;
  message: string;
  data: DonationHistoryItem[];
}

export interface DonationHistoryRelationships {
  donation_type: {
    id: number;
    name: string;
    description: string;
  };
}

export interface DonationHistoryItem {
  id: number;
  type: string;
  attributes: DonationHistoryAttributes;
  relationships: DonationHistoryRelationships;
  meta: DonationHistoryMeta;
}

export interface DonationHistoryAttributes {
  amount: string; // "250.00"
  donation_type: string; // e.g. "offering", "tithe"
  payment_method: string; // e.g. "paystack"
  payment_reference: string | null;
  status: "pending" | "completed" | "failed";
}

export interface DonationHistoryMeta {
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Root structure
export interface DonationTypesResponse {
  success: boolean;
  message: string;
  data: DonationType[];
}

// Each donation type item
interface DonationType {
  id: number;
  type: "donation_type";
  attributes: GivingAttributes;
  meta: DonationMeta;
}

// Attributes of a donation type
interface GivingAttributes {
  name: string;
  description: string;
  is_active: boolean;
}

export interface PartnershipTypeResponse {
  success: boolean;
  message: string;
  data: PartnershipTypeItem[];
}

export interface PartnershipTypeItem {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Giving categories from the unified /categories?type=giving endpoint
export interface GivingCategory {
  _id: string;
  name: string;
  slug: string;
  type: "giving";
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GivingCategoriesResponse {
  success: boolean;
  message: string;
  data: GivingCategory[];
}

export interface PaymentMethodsResponse {
  success: boolean;
  message: string;
  data: PaymentMethodsData;
}

export interface PaymentMethodsData {
  paystack: boolean;
  bank_accounts: BankAccount[];
}

export interface BankAccount {
  id: number;
  title: string | null;
  bank_name: string;
  account_name: string;
  account_number: string;
  sort_code: string | null;
  currency: string; // Could be "NGN" | "USD" if you want to restrict
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
