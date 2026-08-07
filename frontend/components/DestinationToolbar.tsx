"use client";

export default function DestinationToolbar({
  count,
  startInput,
  startingPoint,
  onStartChange,
  onSetStart,
  sortAsc,
  onToggleSort,
}: {
  count: number;
  startInput: string;
  startingPoint: string | null;
  onStartChange: (value: string) => void;
  onSetStart: () => void;
  sortAsc: boolean;
  onToggleSort: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-6 mb-6">
      <div className="grid gap-4">
        <p className="text-sm font-semibold text-slate-700">
          {count} destinations loaded
        </p>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
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
        ) : null}
      </div>

      <button
        type="button"
        className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        onClick={onToggleSort}
      >
        Sort by distance: {sortAsc ? "nearest first" : "furthest first"}
      </button>
    </div>
  );
}
