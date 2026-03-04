import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

function createDb() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new Pool({
    connectionString,
    max: 5,
  });
  return drizzle(pool, { schema });
}

declare global {
  // eslint-disable-next-line no-var
  var __prelaunchDb: ReturnType<typeof createDb> | undefined;
}

/** Returns the Drizzle db client, or null if DATABASE_URL is not set. */
export function getDb() {
  if (!connectionString) {
    return null;
  }
  if (!global.__prelaunchDb) {
    global.__prelaunchDb = createDb();
  }
  return global.__prelaunchDb;
}

export { schema };
