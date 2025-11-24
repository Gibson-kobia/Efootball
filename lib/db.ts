import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'database', 'tournament.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

