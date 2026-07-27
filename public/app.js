const DESTINATIONS_URL = "data/locations.json";
const sortButton = document.getElementById("sortDistance");
const itemCount = document.getElementById("itemCount");
const destinationsContainer = document.getElementById("destinations");
const template = document.getElementById("destinationTemplate");

let destinations = [];
let sortedByDistance = true;

function createDestinationCard(destination) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".destination-card");
  const title = clone.querySelector(".destination-title");
  const meta = clone.querySelector(".destination-meta");
  const address = clone.querySelector(".destination-address");
  const coords = clone.querySelector(".destination-coordinates");
  const media = clone.querySelector(".destination-media");

  title.textContent = destination.name;
  meta.textContent = `${destination.distanceKm} km from Bengaluru`;
  address.textContent = destination.address;
  coords.textContent = `Coordinates: ${destination.lat.toFixed(5)}, ${destination.lng.toFixed(5)}`;

  if (destination.images?.length) {
    const image = document.createElement("img");
    image.src = destination.images[0];
    image.alt = destination.name;
    media.appendChild(image);
  } else {
    media.textContent = "No image available";
    media.style.color = "#64748b";
    media.style.fontWeight = "600";
  }

  return clone;
}

function renderDestinations(items) {
  destinationsContainer.innerHTML = "";
  if (!items.length) {
    destinationsContainer.innerHTML =
      '<div class="empty-state">No destinations available yet. Run enrichment first.</div>';
    itemCount.textContent = "";
    return;
  }

  itemCount.textContent = `${items.length} destinations loaded`;
  const fragment = document.createDocumentFragment();
  items.forEach((destination) =>
    fragment.appendChild(createDestinationCard(destination)),
  );
  destinationsContainer.appendChild(fragment);
}

function sortByDistance() {
  destinations.sort((a, b) => a.distanceKm - b.distanceKm);
  sortedByDistance = true;
  renderDestinations(destinations);
}

async function loadDestinations() {
  try {
    const res = await fetch(DESTINATIONS_URL);
    if (!res.ok) {
      throw new Error(
        "Unable to load data file. Make sure `data/locations.json` exists.",
      );
    }
    destinations = await res.json();
    sortByDistance();
  } catch (error) {
    destinationsContainer.innerHTML = `<div class="empty-state">${error.message}</div>`;
    itemCount.textContent = "";
  }
}

sortButton.addEventListener("click", () => {
  if (!destinations.length) return;
  if (sortedByDistance) {
    destinations.reverse();
    sortedByDistance = false;
    sortButton.textContent = "Sort by shortest distance";
  } else {
    sortByDistance();
    sortButton.textContent = "Sort by furthest distance";
  }
});

loadDestinations();
