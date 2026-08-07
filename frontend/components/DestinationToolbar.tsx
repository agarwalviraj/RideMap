"use client";

export default function DestinationToolbar({
  count,
  startInput,
  startingPoint,
  onStartChange,
  onSetStart,
  searchQuery,
  onSearchChange,
  groupMode,
  onSetGroupMode,
}: {
  count: number;
  startInput: string;
  startingPoint: string | null;
  onStartChange: (value: string) => void;
  onSetStart: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  groupMode: "distance" | "state";
  onSetGroupMode: (value: "distance" | "state") => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-6 mb-6">
      <div className="grid gap-4">
        <p className="text-sm font-semibold text-slate-700">
          {count} destinations loaded
        </p>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          <span>Search destinations</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, place, or state"
            className="min-w-[260px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        {/* <label className="flex flex-col gap-2 text-sm text-slate-700">
          <span>Start from:</span>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={startInput}
              onChange={(event) => onStartChange(event.target.value)}
              placeholder="Enter starting address or city"
              className="min-w-[240px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="button"
              className="rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              onClick={onSetStart}
            >
              Set start
            </button>
          </div>
        </label>
        {startingPoint ? (
          <p className="text-sm text-slate-500">
            Routing from: {startingPoint}
          </p>
        ) : null} */}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
            groupMode === "distance"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
          onClick={() => onSetGroupMode("distance")}
        >
          Group by distance
        </button>

        <button
          type="button"
          className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
            groupMode === "state"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
          onClick={() => onSetGroupMode("state")}
        >
          Group by state
        </button>
      </div>
    </div>
  );
}
