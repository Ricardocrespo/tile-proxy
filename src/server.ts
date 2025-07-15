// server.ts
// This file is the entry point for the tile proxy server
import dotenv from 'dotenv';
import app from './app';

// Load environment variables from .env file
dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
  console.log(`Tile proxy running on port ${PORT}`);
});