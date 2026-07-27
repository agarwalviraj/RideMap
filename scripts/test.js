import "dotenv/config";

const key = process.env.GOOGLE_MAPS_API_KEY;

const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Mysore Palace&inputtype=textquery&fields=name,formatted_address,geometry&key=${key}`;

const res = await fetch(url);
console.log(await res.json());
