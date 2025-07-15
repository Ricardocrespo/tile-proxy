#!/bin/bash
# This script builds the Docker image for the tile-proxy and runs it in a container.
# Ensure the script exits on error
set -e

docker build --no-cache -t tile-proxy . &&
docker stop tile-proxy-dev 2>/dev/null && docker rm tile-proxy-dev 2>/dev/null
docker run --env-file .env -p 3000:3000 --name tile-proxy-dev tile-proxy