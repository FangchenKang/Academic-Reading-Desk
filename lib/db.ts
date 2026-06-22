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
  const records = await db.getAll(STORE_NAME);
  const duplicate = records.find(
    (item) =>
      item.id !== record.id &&
      getRecordFingerprint(item) === getRecordFingerprint(record)
  );
  const recordToSave = duplicate
    ? {
        ...record,
        id: duplicate.id,
        createdAt: duplicate.createdAt,
        syncedToGithub: record.syncedToGithub ?? duplicate.syncedToGithub,
        githubPath: record.githubPath ?? duplicate.githubPath
      }
    : record;

  await db.put(STORE_NAME, recordToSave);
  if (duplicate) {
    await db.delete(STORE_NAME, record.id);
  }
  return recordToSave;
}

export async function getRecord(id: string) {
  const db = await getDatabase();
  return db.get(STORE_NAME, id);
}

export async function listRecords() {
  const db = await getDatabase();
  const records = await db.getAll(STORE_NAME);
  const sorted = records.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return dedupeRecords(sorted);
}

export async function deleteRecord(id: string) {
  const db = await getDatabase();
  const record = await db.get(STORE_NAME, id);
  if (!record) {
    await db.delete(STORE_NAME, id);
    return;
  }

  const fingerprint = getRecordFingerprint(record);
  const records = await db.getAll(STORE_NAME);
  const idsToDelete = records
    .filter((item) => getRecordFingerprint(item) === fingerprint)
    .map((item) => item.id);

  await Promise.all(idsToDelete.map((recordId) => db.delete(STORE_NAME, recordId)));
}

export async function clearAllRecords() {
  const db = await getDatabase();
  await db.clear(STORE_NAME);
}

function dedupeRecords(records: ReadingRecord[]) {
  const seen = new Set<string>();
  return records.filter((record) => {
    const fingerprint = getRecordFingerprint(record);
    if (seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });
}

function getRecordFingerprint(record: ReadingRecord) {
  const originalText = normalizeRecordText(record.originalText);
  const title = normalizeRecordText(record.title);
  const citation = normalizeRecordText(record.citation);

  if (!originalText && !title && !citation) {
    return record.id;
  }

  return [title, citation, originalText].join("\n");
}

function normalizeRecordText(value: string | undefined) {
  return (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}
