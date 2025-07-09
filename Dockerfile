# 1. Use a small Node.js base image
FROM node:20-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first and install
COPY package*.json ./
RUN npm install --omit=dev

# 4. Copy remaining source files
COPY . .

# 5. Expose the port and run the server
EXPOSE 3000
CMD ["node", "server.js"]
