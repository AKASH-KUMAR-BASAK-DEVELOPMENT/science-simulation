import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "visits.json");

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function recordVisit(route) {
  const data = readData();
  const entry = data[route] || { count: 0, last_visited: null };
  entry.count += 1;
  entry.last_visited = new Date().toISOString();
  data[route] = entry;
  writeData(data);
}

export async function getVisitStats() {
  const data = readData();
  const pages = Object.entries(data).map(([route, entry]) => ({
    route,
    count: entry.count,
    last_visited: entry.last_visited,
  }));
  const total = pages.reduce((sum, p) => sum + p.count, 0);
  return { total, pages };
}
