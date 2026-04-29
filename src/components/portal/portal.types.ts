// ─── Shared types for Portal sub-components ───────────────────────────────────

export interface Plan {
  id: string;
  name: string;
  price: number;
  desc: string;
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
