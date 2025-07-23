import path from "node:path";

// TODO use the repo and fetch hash etc.

export const PUBLIC_BASE = "https://owddm.com/public/";
export const EVENTS_URL = `${PUBLIC_BASE}events.json`;
export const PHOTOS_URL = `${PUBLIC_BASE}photos.json`;
export const CONTENT_DIR = path.join("content");
export const EVENTS_BASE_DIR = path.join(CONTENT_DIR, "events");
export const VENUES_BASE_DIR = path.join(CONTENT_DIR, "venues");

// Toggle: If true, photos without an explicit event id will be matched by timestamp to the most
// recent past event. If false, such photo batches are ignored.
export const INFER_EVENTS = true;
