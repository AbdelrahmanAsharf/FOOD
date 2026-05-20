export interface BillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  city?: string;
  street?: string;
  building?: string;
}

export interface PaymobResponse {
  success: boolean;
  payment_key?: string;
  iframe_url?: string;
  order_id?: number;
  error?: string;
}