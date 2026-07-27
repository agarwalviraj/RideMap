import fs from "fs/promises";
import path from "path";
import DestinationList from "../components/DestinationList";

async function getDestinations() {
  const filePath = path.join(process.cwd(), "public", "data", "locations.json");
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
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
