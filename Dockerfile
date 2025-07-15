# Stage 1: Build Stage
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies (including dev dependencies)
COPY package*.json ./
RUN npm install

# Copy the rest of the source files
COPY . .

# Compile TypeScript to JavaScript (including static assets)
RUN npx tsc

# Stage 2: Production Stage
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JavaScript and assets from the build stage
COPY --from=build /app/dist ./dist

# Expose the application port
EXPOSE 3000

# Run the compiled server
CMD ["node", "dist/server.js"]