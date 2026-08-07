import DestinationCard from "./DestinationCard";
import { buildMapUrl, buildRouteUrl } from "./destination-utils";
import { Destination } from "../types/destination";

export default function DestinationGroup({
  group,
  isOpen,
  onToggle,
  startingPoint,
}: {
  group: any;
  isOpen: boolean;
  onToggle: (key: string) => void;
  startingPoint: string;
}) {
  const routeLabel = startingPoint
    ? `Route from ${startingPoint}`
    : "Directions from current location";

  const renderCards = (destinations: Destination[]) => {
    const unique: Destination[] = [];
    const seen = new Set<string>();

    for (const destination of destinations) {
      const key = destination.cluster_id || destination.id;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(destination);
      }
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {unique.map((destination) => {
          const mapUrl = buildMapUrl(destination);
          const routeUrl = buildRouteUrl(destination, startingPoint);
          const primaryUrl = startingPoint ? routeUrl : mapUrl;

          return (
            <DestinationCard
              key={destination.cluster_id || destination.id}
              destination={destination}
              mapUrl={mapUrl}
              routeUrl={routeUrl}
              primaryUrl={primaryUrl}
              routeLabel={routeLabel}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 bg-slate-50 px-5 py-4 text-left transition hover:bg-slate-100"
        onClick={() => onToggle(group.key)}
      >
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {group.label}
          </h3>
          <p className="text-sm text-slate-600">
            {group.items.length} destinations
          </p>
        </div>
        <span className="text-xl font-bold text-emerald-600">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="space-y-4 px-5 pb-5 pt-4">
          {group.items.length > 0 ? (
            renderCards(group.items)
          ) : (
            <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">
              No destinations in this group.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
