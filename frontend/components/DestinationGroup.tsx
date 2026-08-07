import { useEffect, useMemo, useState } from "react";
import DestinationCard from "./DestinationCard";
import { buildMapUrl, buildRouteUrl, extractState } from "./destination-utils";
import { Destination } from "../types/destination";

const hasStateSubgroups = (groupKey: string) =>
  groupKey === "200to400" || groupKey === "over400";

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

  const stateGroups = useMemo(() => {
    if (!hasStateSubgroups(group.key)) return null;

    const buckets = new Map();
    group.items.forEach((destination: Destination) => {
      const state = extractState(destination.address);
      const list = buckets.get(state) ?? [];
      list.push(destination);
      buckets.set(state, list);
    });

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([state, items]) => ({ state, items }));
  }, [group.items, group.key]);

  const [openStateGroups, setOpenStateGroups] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!stateGroups) return;
    setOpenStateGroups((prev: Record<string, boolean>) => {
      const next: Record<string, boolean> = {};
      stateGroups.forEach(({ state }) => {
        next[state] = prev[state] ?? false;
      });
      return next;
    });
  }, [stateGroups]);

  const renderCards = (destinations: Destination[]) => {
    const unique = [];

    const seen = new Set();

    for (const destination of destinations) {
      const key = destination.cluster_id || destination.id;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(destination);
      }
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
          {stateGroups ? (
            stateGroups.map((stateGroup) => (
              <section
                key={stateGroup.state}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                  onClick={() =>
                    setOpenStateGroups((prev: Record<string, boolean>) => ({
                      ...prev,
                      [stateGroup.state]: !prev[stateGroup.state],
                    }))
                  }
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {stateGroup.state}
                    </p>
                    <p className="text-xs text-slate-600">
                      {stateGroup.items.length} destinations
                    </p>
                  </div>
                  <span className="text-xl font-bold text-emerald-600">
                    {openStateGroups[stateGroup.state] ? "−" : "+"}
                  </span>
                </button>

                {openStateGroups[stateGroup.state] && (
                  <div className="space-y-4 p-4">
                    {stateGroup.items.length > 0 ? (
                      renderCards(stateGroup.items)
                    ) : (
                      <div className="rounded-3xl bg-white p-6 text-sm text-slate-600">
                        No destinations in this state.
                      </div>
                    )}
                  </div>
                )}
              </section>
            ))
          ) : group.items.length > 0 ? (
            renderCards(group.items)
          ) : (
            <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">
              No destinations in this range.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
