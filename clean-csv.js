import fs from "fs";

let content = fs.readFileSync("data/locations.csv", "utf8");

// Remove BOM if present
if (content.charCodeAt(0) === 0xfeff) {
  content = content.slice(1);
}

// Replace the header line to remove quotes
const lines = content.split("\r\n");
const headers = lines[0]
  .split(",")
  .map((h) => h.trim().replace(/^"|"$/g, ""))
  .join(",");

lines[0] = headers;
const cleaned = lines.join("\r\n");

fs.writeFileSync("data/locations.csv", cleaned, "utf8");
console.log("CSV cleaned - BOM removed and headers fixed");
