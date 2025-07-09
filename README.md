# Tile Proxy

Tile Proxy is a lightweight service for fetching, caching, and serving map tiles from various sources. It acts as a middle layer between map clients and tile providers, improving performance and reducing bandwidth usage.

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

### Installation

```bash
git clone https://github.com/your-username/tile-proxy.git
cd tile-proxy
npm install
```

### Configuration

Edit `config.json` to set your tile provider URLs, cache settings, and server options.

### Running the Server

```bash
npm start
```

The server will start and listen for tile requests.

## Usage

Request tiles using the following URL pattern:

```
http://localhost:PORT/tiles/{z}/{x}/{y}.png
```

- `z`: Zoom level
- `x`: Tile X coordinate
- `y`: Tile Y coordinate