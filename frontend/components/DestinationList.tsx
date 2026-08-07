"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DestinationToolbar from "./DestinationToolbar";
import DestinationGroup from "./DestinationGroup";
import { distanceGroups, extractPincode } from "./destination-utils";
import { Destination } from "../types/destination";

type GroupMode = "distance" | "state";

export default function DestinationList({
  destinations,
}: {
  destinations: Destination[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [groupMode, setGroupMode] = useState<GroupMode>("distance");
  const [startInput, setStartInput] = useState("");
  const [startingPoint, setStartingPoint] = useState("");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") ?? "",
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const sorted = useMemo(
    () => [...destinations].sort((a, b) => a.distance_km - b.distance_km),
    [destinations],
  );

  useEffect(() => {
    setSearchQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const nextQuery = searchQuery.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery) {
      params.set("search", nextQuery);
    } else {
      params.delete("search");
    }

    const next = params.toString();
    const target = next ? `${pathname}?${next}` : pathname;
    const current = searchParams.toString();

    if (current !== next) {
      router.replace(target, { scroll: false });
    }
  }, [pathname, router, searchParams, searchQuery]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return sorted;

    return sorted.filter((destination) => {
      const haystack = [
        destination.name,
        destination.address,
        destination.state ?? "",
        destination.source_name,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, sorted]);

  const groups = useMemo(() => {
    const sortedFiltered = [...filtered].sort(
      (a, b) => a.distance_km - b.distance_km,
    );

    if (normalizedQuery) {
      return [
        {
          key: "search-results",
          label: "Search results",
          items: sortedFiltered,
        },
      ];
    }

    if (groupMode === "state") {
      const buckets = new Map<string, Destination[]>();
      sortedFiltered.forEach((destination) => {
        const state = destination.state?.trim() || "Unknown";
        const list = buckets.get(state) ?? [];
        list.push(destination);
        buckets.set(state, list);
      });

      return Array.from(buckets.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([state, items]) => ({
          key: `state-${state}`,
          label: state,
          items,
        }));
    }

    return distanceGroups.map((group) => ({
      ...group,
      items: sortedFiltered.filter(
        (destination) =>
          destination.distance_km >= group.min &&
          destination.distance_km < group.max,
      ),
    }));
  }, [filtered, groupMode, normalizedQuery]);

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      groups.forEach((group) => {
        if (!(group.key in next)) {
          next[group.key] = false;
        }
      });
      return next;
    });
  }, [groups]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev: Record<string, boolean>) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <DestinationToolbar
        count={sorted.length}
        startInput={startInput}
        startingPoint={startingPoint}
        onStartChange={setStartInput}
        onSetStart={() => setStartingPoint(startInput.trim())}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        groupMode={groupMode}
        onSetGroupMode={setGroupMode}
      />

      <div className="space-y-5">
        {groups.map((group) => (
          <DestinationGroup
            key={group.key}
            group={group}
            isOpen={openGroups[group.key]}
            onToggle={toggleGroup}
            startingPoint={startingPoint}
          />
        ))}
      </div>
    </div>
  );
}
