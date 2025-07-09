// This module provides utility functions to work with port data.  

const fs = require('fs');
const path = require('path');
const haversine = require('./haversine');

const ports = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../config/ports.json'), 'utf8')
);

function isWithinRange(lat, lon, radius = 1.0) {
  return ports.some(port => {
    const d = haversine(lat, lon, port.lat, port.lon);
    return d <= radius;
  });
}

function tileToLatLon(z, x, y) {
  console.log('Correct tileToLatLon implementation loaded ✅');

  const n = Math.pow(2, z);
  const lon_deg = x / n * 360.0 - 180.0;
  const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
  const lat_deg = lat_rad * (180.0 / Math.PI);
  return { lat: lat_deg, lon: lon_deg };
}

function latLonToTile(lat, lon, z) {
  const latRad = (lat * Math.PI) / 180.0;
  const n = Math.pow(2, z);
  const x = Math.floor((lon + 180.0) / 360.0 * n);
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}


// This module exports two functions:
// 1. `isWithinRange`: Checks if a given latitude and longitude are within a specified radius of any port defined in the `ports.json` configuration file.
// 2. `tileToLatLon`: Converts tile coordinates (z, x, y) to latitude and longitude.    
module.exports = { isWithinRange, tileToLatLon, latLonToTile };