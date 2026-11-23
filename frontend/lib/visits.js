import { getTurso } from "./turso";

export async function recordVisit(path) {
  const turso = getTurso();
  await turso.execute({
    sql: `
      INSERT INTO page_visits (path, count, last_visited)
      VALUES (?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(path) DO UPDATE SET
        count = count + 1,
        last_visited = CURRENT_TIMESTAMP
    `,
    args: [path],
  });
}

export async function getVisitStats() {
  const turso = getTurso();
  const result = await turso.execute(
    "SELECT path, count, last_visited FROM page_visits ORDER BY count DESC"
  );
  const rows = result.rows.map((r) => ({
    path: r.path,
    count: Number(r.count),
    last_visited: r.last_visited,
  }));
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  return { total, pages: rows };
}
