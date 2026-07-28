import DestinationList from "../components/DestinationList";

let cachedDestinations = null;

async function getDestinations() {
  if (cachedDestinations) {
    return cachedDestinations;
  }

  const privateUrl = process.env.LOCATIONS_DATA_URL;
  if (!privateUrl) {
    throw new Error(
      "LOCATIONS_DATA_URL is required to fetch destination data from private storage.",
    );
  }

  const headers = {};
  if (process.env.LOCATIONS_DATA_TOKEN) {
    headers.Authorization = `Bearer ${process.env.LOCATIONS_DATA_TOKEN}`;
  }

  const response = await fetch(privateUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch private locations data: ${response.status} ${response.statusText}`,
    );
  }

  cachedDestinations = await response.json();
  return cachedDestinations;
}

export default async function Page() {
  const destinations = await getDestinations();

  return (
    <main className="page-shell">
      {/* <section className="hero">
        <div className="content">
          <p className="eyebrow">Bengaluru Bike Rides</p>
          <h1>Ride destinations ordered by distance</h1>
          <p>
            Explore every destination, view addresses, coordinates, and local
            images. Add a starting point to open a route from your location.
          </p>
        </div>
      </section> */}

      <section className="list-section">
        <DestinationList destinations={destinations} />
      </section>
    </main>
  );
}
