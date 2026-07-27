import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream";
import { promisify } from "util";
import csvParser from "csv-parser";
import process from "process";

const streamPipeline = promisify(pipeline);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_CSV = path.join(__dirname, "..", "data", "locations.csv");
const OUTPUT_JSON = path.join(
  __dirname,
  "..",
  "frontend",
  "public",
  "data",
  "locations.json",
);
const IMAGE_DIR = path.join(
  __dirname,
  "..",
  "frontend",
  "public",
  "assets",
  "images",
);
const PROGRESS_FILE = path.join(__dirname, "enrich-progress.json");
const BENGALURU = { lat: 12.9715987, lng: 77.5945627 };

const apiKey =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.npm_package_config_google_maps_api_key;
if (!apiKey) {
  console.error(
    "Missing Google Maps API key. Create a .env file or set GOOGLE_MAPS_API_KEY.",
  );
  process.exit(1);
}

// Parse DMS coordinates like "12°28'21.1"N 78°15'49.1"E" to decimal degrees
function parseDmsCoordinate(dmsStr) {
  const match = dmsStr.match(
    /(\d+)°(\d+)'([\d.]+)"([NSEW])\s+(\d+)°(\d+)'([\d.]+)"([NSEW])/,
  );
  if (!match) return null;

  const [, latD, latM, latS, latDir, lngD, lngM, lngS, lngDir] = match;
  let lat = parseInt(latD) + parseInt(latM) / 60 + parseFloat(latS) / 3600;
  let lng = parseInt(lngD) + parseInt(lngM) / 60 + parseFloat(lngS) / 3600;

  if (latDir === "S") lat = -lat;
  if (lngDir === "W") lng = -lng;

  return { lat, lng };
}

async function reverseGeocodeCoordinate(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const data = await fetchJson(url);

  if (data.status === "ERROR") {
    console.log(`  Reverse geocode API error for ${lat},${lng}: ${data.error}`);
    return null;
  }

  if (data.status !== "OK" || !data.results?.length) {
    console.log(
      `  Reverse geocode no results for ${lat},${lng} (status: ${data.status})`,
    );
    return null;
  }

  const result = data.results[0];
  return {
    name:
      result.address_components.find(
        (c) =>
          c.types.includes("natural_feature") ||
          c.types.includes("point_of_interest"),
      )?.long_name || result.formatted_address.split(",")[0],
    address: result.formatted_address,
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (degrees) => degrees * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching ${url}`);
    }
    return res.json();
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    return { status: "ERROR", error: error.message };
  }
}

async function downloadImage(url, destination) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image ${url} (${res.status})`);
  }
  await streamPipeline(res.body, fs.createWriteStream(destination));
}

async function geocodeLocation(name) {
  // First try with just the location name and India
  const encoded = encodeURIComponent(`${name}, India`);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;
  const data = await fetchJson(url);

  if (data.status === "ERROR") {
    console.warn(`  Geocode API error for "${name}": ${data.error}`);
    return null;
  }

  if (data.status !== "OK" || !data.results?.length) {
    console.log(`  Geocode no results for "${name}" (status: ${data.status})`);
    return null;
  }

  const result = data.results[0];
  return {
    name,
    address: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    photos: [],
  };
}

async function findPlace(name) {
  // First try searching
  const query = encodeURIComponent(name);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=name,formatted_address,geometry,photos,place_id&key=${apiKey}`;
  const data = await fetchJson(url);

  if (data.status === "ERROR") {
    console.log(`  FindPlace API error for "${name}": ${data.error}`);
    return null;
  }

  if (data.status !== "OK" || !data.candidates?.length) {
    console.log(
      `  FindPlace no results for "${name}" (status: ${data.status})`,
    );
    return null;
  }

  const place = data.candidates[0];
  return {
    name: place.name || name,
    address: place.formatted_address || name,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    photos: place.photos?.map((photo) => photo.photo_reference) || [],
    placeId: place.place_id,
  };
}

function buildPhotoUrl(photoReference, maxWidth = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
}

async function processLocation(location, index) {
  // CSV columns: Name, Address, Note, Phone, Has Address, Success
  const queryText = (
    location.Name ||
    location.name ||
    location.location ||
    ""
  ).trim();

  if (
    !queryText ||
    queryText.includes("Dropped pin") ||
    queryText.includes("No address found")
  ) {
    console.warn(`Skipping row ${index + 1}: invalid or placeholder name.`);
    return null;
  }

  let record = null;

  // Check if the name is coordinates in DMS format
  const dmsCoords = parseDmsCoordinate(queryText);
  if (dmsCoords) {
    console.log(
      `Parsed coordinates from name: ${queryText} => ${dmsCoords.lat.toFixed(4)}, ${dmsCoords.lng.toFixed(4)}`,
    );
    const reverseResult = await reverseGeocodeCoordinate(
      dmsCoords.lat,
      dmsCoords.lng,
    );
    if (reverseResult) {
      record = {
        name: reverseResult.name,
        address: reverseResult.address,
        lat: dmsCoords.lat,
        lng: dmsCoords.lng,
        photos: [],
      };
    }
  }

  // If we didn't find a location from coordinates, try normal lookup
  if (!record) {
    record = await findPlace(queryText);
  }

  if (!record) {
    record = await geocodeLocation(queryText);
  }

  if (!record) {
    console.warn(`Unable to resolve location: ${queryText}`);
    return null;
  }

  const slug = slugify(record.name || queryText);
  const imagePaths = [];
  for (let i = 0; i < Math.min(3, record.photos.length); i += 1) {
    const photoReference = record.photos[i];
    if (!photoReference) {
      continue;
    }
    const localName = `${slug}-${i + 1}.jpg`;
    const outputPath = path.join(IMAGE_DIR, localName);
    const photoUrl = buildPhotoUrl(photoReference, 800);
    try {
      await downloadImage(photoUrl, outputPath);
      imagePaths.push(`assets/images/${localName}`);
    } catch (error) {
      console.warn(`Image download failed for ${queryText}: ${error.message}`);
    }
  }

  const distance = haversineDistance(
    BENGALURU.lat,
    BENGALURU.lng,
    record.lat,
    record.lng,
  );
  return {
    id: `dest-${index + 1}`,
    sourceName: queryText,
    name: record.name,
    address: record.address,
    lat: record.lat,
    lng: record.lng,
    distanceKm: Number(distance.toFixed(1)),
    images: imagePaths,
    placeId: record.placeId || null,
  };
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return { lastIndex: -1 };
  }

  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
  } catch (error) {
    console.warn(`Unable to read resume progress: ${error.message}`);
    return { lastIndex: -1 };
  }
}

function saveProgress(index) {
  fs.writeFileSync(
    PROGRESS_FILE,
    JSON.stringify({ lastIndex: index }, null, 2),
    "utf-8",
  );
}

async function readCsv(filePath) {
  const rows = [];
  const stream = fs.createReadStream(filePath).pipe(csvParser());
  for await (const row of stream) {
    rows.push(row);
  }
  return rows;
}

async function main() {
  if (!fs.existsSync(DATA_CSV)) {
    console.error(`Missing CSV file: ${DATA_CSV}`);
    process.exit(1);
  }

  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }
  const outputDir = path.dirname(OUTPUT_JSON);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const rows = await readCsv(DATA_CSV);
  const progress = loadProgress();
  const resumeFrom =
    typeof progress.lastIndex === "number" && progress.lastIndex >= 0
      ? progress.lastIndex + 1
      : 0;

  let existingResults = [];
  if (fs.existsSync(OUTPUT_JSON)) {
    try {
      existingResults = JSON.parse(fs.readFileSync(OUTPUT_JSON, "utf-8"));
    } catch (error) {
      console.warn(`Unable to read existing output file: ${error.message}`);
    }
  }

  if (resumeFrom > 0) {
    console.log(
      `Resuming from row ${resumeFrom + 1} (already completed ${resumeFrom} rows)`,
    );
  }

  const results = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const displayName = row.Name || row.name || "unknown";

    if (index < resumeFrom) {
      if (existingResults[index]) {
        results.push(existingResults[index]);
      }
      continue;
    }

    console.log(`Processing ${index + 1}/${rows.length}: ${displayName}`);
    const item = await processLocation(row, index);
    if (item) {
      results.push(item);
    }
    saveProgress(index);
  }

  results.sort((a, b) => a.distanceKm - b.distanceKm);
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2), "utf-8");
  console.log(
    `Enrichment complete. Wrote ${results.length} items to ${OUTPUT_JSON}`,
  );
}

main().catch((error) => {
  console.error("Failed to enrich locations:", error);
  process.exit(1);
});
