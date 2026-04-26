// ─── Shared types for Portal sub-components ───────────────────────────────────

export interface Plan {
  name: string;
  price: number;
  desc: string;
  sumupUrl: string | null;
  free: boolean;
}

export interface PurchaseRow {
  date: string;
  product: string;
  amount: string;
  status: string;
}

export interface Invoice {
  date: string;
  label: string;
}

export interface UsageBar {
  label: string;
  pct: number;
  color: string;
}
