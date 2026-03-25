import * as SQLite from "expo-sqlite";

export interface DownloadedSermon {
  id: number;
  sermon_id: string;
  title: string;
  speaker: string;
  duration: number;
  thumbnail_url: string | null;
  remote_audio_url: string;
  local_audio_uri: string;
  download_status: "downloading" | "completed" | "failed";
  downloaded_at: string;
  file_size: number | null;
  sermon_json: string;
}

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("downloads.db");
  await initDatabase(db);
  return db;
}

async function initDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sermon_id TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      speaker TEXT,
      duration INTEGER,
      thumbnail_url TEXT,
      remote_audio_url TEXT NOT NULL,
      local_audio_uri TEXT NOT NULL,
      download_status TEXT DEFAULT 'downloading',
      downloaded_at TEXT,
      file_size INTEGER,
      sermon_json TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_sermon_id ON downloads(sermon_id);
    CREATE INDEX IF NOT EXISTS idx_download_status ON downloads(download_status);
  `);
}

export async function insertDownload(
  sermon: Omit<DownloadedSermon, "id">
): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync(
    `INSERT OR REPLACE INTO downloads
    (sermon_id, title, speaker, duration, thumbnail_url, remote_audio_url, local_audio_uri, download_status, downloaded_at, file_size, sermon_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sermon.sermon_id,
      sermon.title,
      sermon.speaker,
      sermon.duration,
      sermon.thumbnail_url,
      sermon.remote_audio_url,
      sermon.local_audio_uri,
      sermon.download_status,
      sermon.downloaded_at,
      sermon.file_size,
      sermon.sermon_json,
    ]
  );
  return result.lastInsertRowId;
}

export async function updateDownloadStatus(
  sermonId: string,
  status: "downloading" | "completed" | "failed",
  localUri?: string,
  fileSize?: number
): Promise<void> {
  const database = await getDatabase();
  if (localUri && fileSize !== undefined) {
    await database.runAsync(
      `UPDATE downloads SET download_status = ?, local_audio_uri = ?, file_size = ?, downloaded_at = ? WHERE sermon_id = ?`,
      [status, localUri, fileSize, new Date().toISOString(), sermonId]
    );
  } else {
    await database.runAsync(
      `UPDATE downloads SET download_status = ? WHERE sermon_id = ?`,
      [status, sermonId]
    );
  }
}

export async function getDownloadBySermonId(
  sermonId: string
): Promise<DownloadedSermon | null> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<DownloadedSermon>(
    `SELECT * FROM downloads WHERE sermon_id = ?`,
    [sermonId]
  );
  return result ?? null;
}

export async function getAllDownloads(): Promise<DownloadedSermon[]> {
  const database = await getDatabase();
  const result = await database.getAllAsync<DownloadedSermon>(
    `SELECT * FROM downloads WHERE download_status = 'completed' ORDER BY downloaded_at DESC`
  );
  return result;
}

export async function searchDownloads(
  query: string
): Promise<DownloadedSermon[]> {
  const database = await getDatabase();
  const searchTerm = `%${query}%`;
  const result = await database.getAllAsync<DownloadedSermon>(
    `SELECT * FROM downloads
     WHERE download_status = 'completed'
     AND (title LIKE ? OR speaker LIKE ?)
     ORDER BY downloaded_at DESC`,
    [searchTerm, searchTerm]
  );
  return result;
}

export async function deleteDownload(sermonId: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(`DELETE FROM downloads WHERE sermon_id = ?`, [
    sermonId,
  ]);
}

export async function isSermonDownloaded(sermonId: string): Promise<boolean> {
  const download = await getDownloadBySermonId(sermonId);
  return download?.download_status === "completed";
}
