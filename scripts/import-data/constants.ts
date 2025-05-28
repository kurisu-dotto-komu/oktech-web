import path from "node:path";

export const EVENTS_URL = "https://owddm.com/public/events.json";
export const PHOTOS_URL = "https://owddm.com/public/photos.json";
export const PUBLIC_BASE = "https://owddm.com/public/";
export const CONTENT_DIR = path.join("content");
export const EVENTS_BASE_DIR = path.join(CONTENT_DIR, "events");

// Toggle: If true, photos without an explicit event id will be matched by timestamp to the most
// recent past event. If false, such photo batches are ignored.
export const INFER_EVENTS = true;
