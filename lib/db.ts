"use client";

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { ReadingRecord } from "@/types/analysis";

const DB_NAME = "academic-reading-desk";
const DB_VERSION = 1;
const STORE_NAME = "records";

interface ReadingDeskDB extends DBSchema {
  records: {
    key: string;
    value: ReadingRecord;
    indexes: {
      "by-updated-at": string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<ReadingDeskDB>> | null = null;

function getDatabase() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser.");
  }

  if (!dbPromise) {
    dbPromise = openDB<ReadingDeskDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by-updated-at", "updatedAt");
      }
    });
  }

  return dbPromise;
}

export async function saveRecord(record: ReadingRecord) {
  const db = await getDatabase();
  await db.put(STORE_NAME, record);
  return record;
}

export async function getRecord(id: string) {
  const db = await getDatabase();
  return db.get(STORE_NAME, id);
}

export async function listRecords() {
  const db = await getDatabase();
  const records = await db.getAll(STORE_NAME);
  return records.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function deleteRecord(id: string) {
  const db = await getDatabase();
  await db.delete(STORE_NAME, id);
}

export async function clearAllRecords() {
  const db = await getDatabase();
  await db.clear(STORE_NAME);
}
