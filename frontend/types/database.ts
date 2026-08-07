export interface ClusterView {
  id: string;
  name: string;
  size: number;

  centerLat: number;
  centerLng: number;
}

export interface DestinationView {
  id: string;

  sourceName: string;
  name: string;
  address: string;

  lat: number;
  lng: number;

  distanceKm: number;

  placeId: string | null;

  images: string[];

  clusterId: string | null;

  cluster?: ClusterView | null;
}
