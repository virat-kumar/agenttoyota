/* Shared Types */
export type VoidFn = () => void;
export type BannerKind = "success" | "error" | "info";

export interface ProfileData {
  income_annual_usd: string;
  credit_score: string;
  down_payment_usd: string;
  monthly_budget_usd: string;
  loan_term_months: string;
  lease_term_months: string;
  zipcode: string;
  employment_status: string;
  preferred_body_style: string;
  preferred_fuel_type: string;
}

export interface LoanRec {
  imageUrl: string;
  vehicleName: string;
  carValue: number;
  interestRate: number;
  monthlyEmi: number;
}

export interface LeaseRec {
  imageUrl: string;
  vehicleName: string;
  carValue: number;
  monthlyRent: number;
}