// This module provides utility functions to work with tile center data.  

import * as fs from 'fs';
import * as path from 'path';
import haversineDistance from './haversine';

interface TileCenter {
  name: string;
  lat: number;
  lon: number;
}

const tileCenters: TileCenter[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../config/tile-centers.json'), 'utf8')
);

// Function to check if a given latitude and longitude are within a specified radius of any tile center
function isWithinRange(lat: number, lon: number, radius: number = 2.0): boolean {
  return tileCenters.some((center: TileCenter) => {
    const distance = haversineDistance(lat, lon, center.lat, center.lon);
    return distance <= radius;
  });
}

function tileToLatLon(z: number, x: number, y: number): { lat: number; lon: number } {
  const n = Math.pow(2, z);
  const lon_deg = (x / n) * 360.0 - 180.0;
  const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  const lat_deg = (lat_rad * 180.0) / Math.PI;
  return { lat: lat_deg, lon: lon_deg };
}

function latLonToTile(lat: number, lon: number, z: number): { x: number; y: number } {
  const latRad = (lat * Math.PI) / 180.0;
  const n = Math.pow(2, z);
  const x = Math.floor(((lon + 180.0) / 360.0) * n);
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y };
}

// This module exports two functions:
// 1. `isWithinRange`: Checks if a given latitude and longitude are within a specified radius of any tile center defined in the `tileCenters.json` configuration file.
// 2. `tileToLatLon`: Converts tile coordinates (z, x, y) to latitude and longitude.
// 3. `latLonToTile`: Converts latitude and longitude to tile coordinates (x, y) at a given zoom level (z).
export { isWithinRange, tileToLatLon, latLonToTile };