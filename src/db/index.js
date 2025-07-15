// src/db/index.js
import { drizzle } from "drizzle-orm/node-postgres"; // Or your specific driver, e.g., 'drizzle-orm/postgres-js'
import { Pool } from "pg"; // The PostgreSQL client library you installed
import * as schema from "./schema/index.js"; // Assuming you have an index.js that exports all tables
import "dotenv/config";

// Make sure your DATABASE_URL environment variable is set
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: connectionString,
});

// Initialize Drizzle ORM instance
const db = drizzle(pool, { schema });

export default db; // Export the initialized Drizzle DB instance
