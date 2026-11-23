import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await client.execute(`
  CREATE TABLE IF NOT EXISTS page_visits (
    path TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0,
    last_visited TEXT
  )
`);

console.log("page_visits table ready.");
