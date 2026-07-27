# Ride Destinations

A small bike ride destination website for Bengaluru that reads a CSV of locations, enriches each location with Google Maps data, downloads local images, and displays a sortable list by distance from Bengaluru.

## Setup

1. Copy `.env.example` to `.env` and add your Google Maps API key:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies from the repository root:

   ```bash
   npm install
   ```

3. Place your source CSV in `data/locations.csv`.

4. Enrich the data. This generates `frontend/public/data/locations.json` and downloads images to `frontend/public/assets/images`:

   ```bash
   npm run enrich
   ```

5. Run the Next.js frontend locally:

   ```bash
   npm run frontend:dev
   ```

6. Open `http://localhost:3000` in your browser.

## CSV format

The importer expects a CSV with a header containing `name` or `location`.

Example:

```csv
name
Nandi Hills
Savandurga
Mekedatu
```
