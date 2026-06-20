export type CampaignStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface Campaign {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: CampaignStatus;
  color: string;
  icon: string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  missions?: {
    id: string;
    title: string;
    status: string;
    progress: number;
  }[];
  _count?: {
    missions: number;
  };
}

export interface CreateCampaignInput {
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  deadline?: string;
}

export interface UpdateCampaignInput {
  title?: string;
  description?: string;
  status?: CampaignStatus;
  color?: string;
  icon?: string;
  deadline?: string | null;
}
