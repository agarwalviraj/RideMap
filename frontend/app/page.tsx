import DestinationList from "../components/DestinationList";
import { Destination } from "../types/destination";
import { createClient } from "../lib/supabase";
let cachedDestinations: Destination[] | null = null;

import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: destinations, error } = await supabase
    .from("destinations")
    .select("*")
    .order("distance_km", { ascending: true });
  if (error) {
    console.log("Error fetching destinations:", error);
    throw new Error(error.message);
  }
  console.log("Fetched destinations:", destinations);

  return (
    <main className="page-shell">
      {/* <section className="hero">
        <div className="content">
          <p className="eyebrow">Bengaluru Bike Rides</p>
          <h1>Ride destinations ordered by distance</h1>
          <p>
            Explore every destination, view addresses, coordinates, and local
            images. Add a starting point to open a route from your location.
          </p>
        </div>
      </section> */}

      <section className="list-section">
        <DestinationList destinations={destinations} />
      </section>
    </main>
  );
}
