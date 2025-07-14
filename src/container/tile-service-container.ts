import { TileService } from '../services/tile-service';
import { MemoryCache } from '../services/memory-cache';
import { TileCache } from '../services/tile-cache';
import { TileClient } from '../client/tile-client';

// Dependency Injection - create concrete implementations and wire them up
const tileService = new TileService(
  new MemoryCache(),
  new TileCache(),
  new TileClient()
);
/**
 * Export the tile service instance for use in other parts of the application
 * This allows us to use the same instance across the application,
 * ensuring consistent caching and tile fetching behavior.
 */
export default tileService;
