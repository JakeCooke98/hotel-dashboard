
export interface Room {
  id: string;
  name: string;
  description: string;
  facilities: number;
  created: string;
  updated: string | null;
  image?: string;
  facilityList?: string[];
}
