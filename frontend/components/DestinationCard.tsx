import Image from "next/image";
import { Destination } from "../types/destination";

export default function DestinationCard({
  destination,
  primaryUrl,
  mapUrl,
  routeUrl,
  routeLabel,
}: {
  destination: Destination;
  primaryUrl: string;
  mapUrl: string;
  routeUrl: string;
  routeLabel: string;
}) {
  const imageUrl = destination?.images?.[0];

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      {/* Image Display Block */}
      <div className="min-h-[200px] bg-slate-100 grid place-items-center">
        {imageUrl && typeof imageUrl === "string" ? (
          // Only render the image if a valid, non-empty string URL is present
          <Image
            src={imageUrl}
            alt={destination.name}
            className="h-full w-full object-cover"
            width="1024"
            height="1024"
          />
        ) : (
          /* Fallback when no images or invalid path */
          <div className="text-sm font-semibold text-slate-500 p-4 text-center">
            {destination?.images?.[1]
              ? "No primary image available"
              : "No destination details found"}
          </div>
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
          {destination.distance_km} km from Bengaluru
        </p>
        {destination.cluster && destination.cluster?.size > 1 && (
          <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            📍 {destination.cluster?.size} places nearby
            {destination.cluster &&
              ` • ${destination.cluster?.name || "Cluster"}`}
          </div>
        )}
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
