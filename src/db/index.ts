import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "node:path";
import fs from "node:fs";

const url = process.env.DATABASE_FILE ?? "./data/elumen.db";
const dir = path.dirname(path.resolve(process.cwd(), url));
fs.mkdirSync(dir, { recursive: true });

const sqlite = new Database(path.resolve(process.cwd(), url));
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
export { schema };
