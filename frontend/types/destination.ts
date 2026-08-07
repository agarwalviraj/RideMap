import { Cluster } from "./cluster";

export interface Destination {
  id: string;

  source_name: string;
  name: string;
  address: string;

  lat: number;
  lng: number;

  distance_km: number;

  place_id: string | null;

  images: string[];

  cluster_id: string | null;

  created_at?: string;

  // Populated when selecting with a join
  cluster?: Cluster | null;
}
