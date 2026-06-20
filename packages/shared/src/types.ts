export type MemberRole = "owner" | "editor" | "viewer";

export interface Member {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: MemberRole;
}

export interface Photo {
  id: string;
  uploadedBy: string;
  uri: string;
  takenAt?: string;
}

export interface Spot {
  id: string;
  name: string;
  category?: string;
  location: { lat: number; lng: number };
  order: number;

  plan?: {
    scheduledAt?: string;
    notes?: string;
    url?: string;
  };

  record?: {
    photos: Photo[];
    memo?: string;
    visitedAt?: string;
  };
}

export interface Day {
  id: string;
  date: string;
  spots: Spot[];
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  members: Member[];
  days: Day[];
  inviteToken: string;
}
