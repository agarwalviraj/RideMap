"use client";

import { useMemo, useState } from "react";
import DestinationToolbar from "./DestinationToolbar";
import DestinationGroup from "./DestinationGroup";
import { distanceGroups, extractPincode } from "./destination-utils";
import { Destination } from "../types/destination";

export default function DestinationList({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [sortAsc, setSortAsc] = useState(true);
  const [startInput, setStartInput] = useState("");
  const [startingPoint, setStartingPoint] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    distanceGroups.reduce((state: Record<string, boolean>, group) => {
      state[group.key] = group.defaultOpen;
      return state;
    }, {}),
  );

  const sorted = useMemo(
    () =>
      [...destinations].sort((a, b) =>
        sortAsc ? a.distance_km - b.distance_km : b.distance_km - a.distance_km,
      ),
    [destinations, sortAsc],
  );

  const groups = useMemo(
    () =>
      distanceGroups.map((group) => ({
        ...group,
        items: sorted
          .filter(
            (destination) =>
              destination.distance_km >= group.min &&
              destination.distance_km < group.max,
          )
          .sort((a, b) => {
            const pinA = extractPincode(a.address);
            const pinB = extractPincode(b.address);
            if (pinA !== pinB) return pinA - pinB;
            return a.name.localeCompare(b.name);
          }),
      })),
    [sorted],
  );

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
        sortAsc={sortAsc}
        onToggleSort={() => setSortAsc((prev) => !prev)}
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
