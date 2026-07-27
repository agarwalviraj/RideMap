export const distanceGroups = [
  {
    key: "under75",
    label: "Less than 75 km",
    min: 0,
    max: 75,
    defaultOpen: false,
  },
  {
    key: "75to200",
    label: "75 - 200 km",
    min: 75,
    max: 200,
    defaultOpen: false,
  },
  {
    key: "200to400",
    label: "200 - 400 km",
    min: 200,
    max: 400,
    defaultOpen: false,
  },
  {
    key: "over400",
    label: "More than 400 km",
    min: 400,
    max: Infinity,
    defaultOpen: false,
  },
];

export function buildMapUrl(destination) {
  const lat = Number(destination.lat).toFixed(6);
  const lng = Number(destination.lng).toFixed(6);
  const safeName = destination.name
    ? destination.name.replace(/\s+/g, "+").replace(/[^A-Za-z0-9+()\-\._]/g, "")
    : `${lat},${lng}`;

  if (destination.placeId) {
    const query = `place_id:${encodeURIComponent(destination.placeId)}`;
    return `https://www.google.com/maps/place/${safeName}/@${lat},${lng},14z/data=!3m1!4b1?entry=ttu&q=${query}`;
  }

  return `https://www.google.com/maps/place/${safeName}/@${lat},${lng},14z/`;
}

export function buildRouteUrl(destination, origin) {
  const params = new URLSearchParams({ api: "1" });
  const lat = Number(destination.lat).toFixed(6);
  const lng = Number(destination.lng).toFixed(6);
  const destinationLabel = destination.name
    ? `${destination.name} @ ${lat},${lng}`
    : `${lat},${lng}`;

  params.set("destination", destinationLabel);
  if (origin?.trim()) {
    params.set("origin", origin.trim());
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function extractPincode(address) {
  if (!address) return Infinity;
  const match = address.match(/\b(\d{5,6})\b/);
  return match ? Number(match[1]) : Infinity;
}

export function extractState(address) {
  if (!address) return "Unknown";
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) return "Unknown";

  const lastPart = parts[parts.length - 1];
  const pinMatch = lastPart.match(/(\d{5,6})/);
  if (pinMatch) {
    const statePart = lastPart.replace(pinMatch[0], "").trim();
    if (statePart) return statePart;
    return parts.length >= 2 ? parts[parts.length - 2] : "Unknown";
  }

  return parts.length >= 2 ? parts[parts.length - 1] : parts[0];
}
