# 1. Use a small Node.js base image
FROM node:20-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# 4. Copy remaining source files
COPY . .

# 5. Compile TypeScript to JavaScript
RUN npm install --save-dev typescript
RUN npx tsc
RUN cp -r src/config dist/config

# 6. Expose the port and run the compiled server
EXPOSE 3000
CMD ["node", "dist/server.js"]