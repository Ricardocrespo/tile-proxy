# Tile Proxy

This Tile Proxy is a lightweight service for fetching, caching, and serving map tiles from various sources when you know in advance which areas your application will access given a predictable URL structure. It acts as a middle layer between map clients and tile providers, improving performance, reducing bandwidth usage, and giving you greater control over how and when tiles are served.

## Features

- Fetches map tiles from remote providers
- Caches tiles locally for faster subsequent access
- Supports configurable cache expiration
- Simple REST API for tile requests
- Easy to deploy and configure

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm 
- Docker

### Installation

```bash
git clone https://github.com/your-username/tile-proxy.git
cd tile-proxy
npm install
```

### Configuration

Create a `tile-centers.json` file within `config` folder based on the provided `config/tile-centers.example.json`. This file defines the geographical center points (latitude and longitude) that your application will frequently request tiles around. These should reflect known, fixed regions such as specific cities, border crossings, or landmarks where tile access is consistently needed.

Each entry includes:

* The lat and lon coordinates of a target area
* A descriptive name (for documentation/debugging)

The server uses these points to determine whether incoming tile requests are within an allowed radius. Requests outside these configured zones will be rejected to control costs and prevent abuse.

### Running the Server

```bash
./dev.sh
```

The server will start and listen for tile requests.

## Usage

Request tiles using the following URL pattern:

```
{host}:PORT/tiles/{z}/{x}/{y}.png
```

- `z`: Zoom level
- `x`: Tile X coordinate
- `y`: Tile Y coordinate

## 🧪 Running Tests

This project uses **jest** for Unit Testing, and **Cucumber.js** and **Supertest** for behavior-driven integration testing.

### Run Unit Tests

```bash
npm run test
```

### Run all integration tests

```bash
npm run test:features
```

### Run integration tests by tag

Run a specific group of tests using tag filters:

```bash
npm run test:features -- --tags "@cache"
```

### ✅ Available Tags

- **@happy** – Standard successful requests  
- **@cache** – Tests tile caching behavior  
- **@invalidCoords** – Tests input validation  
- **@outOfBounds** – Tests geo-restriction logic  
- **@unsupportedZoom** – Tests unsupported zoom levels

### 🛠 Setup Notes

- Tests automatically load environment variables from `.env.test`
- A temporary tile cache is created during `@cache` tests and cleaned up afterward
- Make sure `config/tile-centers.json` is correctly configured if your tests depend on geographic filtering or the proximity check logic will give you false positives.
