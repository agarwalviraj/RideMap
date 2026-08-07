import Link from "next/link";

const tabs = [
  { key: "destinations", label: "Destinations" },
  { key: "two-day-loops", label: "2 Day Loops" },
  { key: "four-day-loops", label: "4 Day Loops" },
] as const;

const Toolbar = () => {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 shadow-sm md:w-72 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between md:block">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Ride Map
          </p>
          <h1 className="mt-1 text-lg font-semibold text-slate-900">
            Explore routes
          </h1>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {tabs.map((tab) => (
          <Link
            href={`/${tab.key}`}
            key={tab.key}
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>{tab.label}</span>
            <span className="text-base text-slate-400">›</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Toolbar;
