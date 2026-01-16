export interface DashboardSummary {
  totalTickets: number;
  totalOpen: number;
  totalClosed: number;
  slaPercentage: string;
}

export interface TopItem {
  name: string;
  total: number;
}

export interface ChannelData {
  channel: string; // e.g., "Whatsapp", "Email"
  source_origin: string;
  total: number;
  pctSla: string;
  open: number;
  closed: number;
  connOpen: number;
  solOpen: number;
  connOver3h: number;
  solOver6h: number;
  nonFcrCount: number;
  pctFcr: string;
  pctNonFcr: string;
  pctPareto: string;
  pctNotPareto: string;
  topCorporate: TopItem[];
  topKip: TopItem[];
}

export interface DashboardResponse {
  summary: DashboardSummary;
  channels: ChannelData[];
}