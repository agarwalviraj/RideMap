import { cookies } from "next/headers";
import DestinationList from "../../components/DestinationList";
import SuggestionSheet from "../../components/SuggestionSheet";
import { createClient } from "../../lib/supabase";

export default async function Destinations() {
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

  return (
    <section className="flex-1 p-4 md:p-6 lg:p-8">
      <DestinationList destinations={destinations} />
    </section>
  );
}
