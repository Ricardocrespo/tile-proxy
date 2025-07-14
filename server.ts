// server.ts
// This file is the entry point for the tile proxy server
import app from './src/app';

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
  console.log(`Tile proxy running on port ${PORT}`);
});