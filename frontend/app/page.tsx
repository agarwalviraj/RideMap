import { cookies } from "next/headers";
import DestinationList from "../components/DestinationList";
import { createClient } from "../lib/supabase";
import { Destination } from "../types/destination";

const tabs = [
  { key: "destinations", label: "Destinations" },
  { key: "two-day-loops", label: "2 Day Loops" },
  { key: "four-day-loops", label: "4 Day Loops" },
] as const;

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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-4 shadow-sm md:w-72 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between md:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Ride Planner
              </p>
              <h1 className="mt-1 text-lg font-semibold text-slate-900">
                Explore routes
              </h1>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 md:mt-3">
              3 views
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span>{tab.label}</span>
                <span className="text-base text-slate-400">›</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-4 md:p-6 lg:p-8">
          <DestinationList destinations={destinations} />
        </section>
      </div>
    </main>
  );
}
