export default function DestinationCard({
  destination,
  primaryUrl,
  mapUrl,
  routeUrl,
  routeLabel,
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="min-h-[200px] bg-slate-100 grid place-items-center">
        {destination.images?.length ? (
          <img
            src={destination.images[0]}
            alt={destination.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-sm font-semibold text-slate-500">No image</div>
        )}
      </div>

      <div className="grid gap-3 p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-600"
          >
            {destination.name}
          </a>
        </h2>
        <p className="text-sm font-semibold text-emerald-600">
          {destination.distanceKm} km from Bengaluru
        </p>
        <p className="text-sm text-slate-600">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-600"
          >
            {destination.address}
          </a>
        </p>
        <p className="text-sm text-slate-600">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-600"
          >
            {destination.lat.toFixed(5)}, {destination.lng.toFixed(5)}
          </a>
        </p>
        <div className="grid gap-2 pt-2">
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Open location in Google Maps
          </a>
          <a
            href={routeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            {routeLabel}
          </a>
        </div>
      </div>
    </article>
  );
}
