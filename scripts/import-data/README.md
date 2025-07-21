# Import Data Script

This script imports event and venue data from external JSON sources and processes them into the local content structure for the OKTech website.

## Overview

The import script (`npm run import`) fetches data from external URLs and creates/updates local event and venue files with associated metadata and images.

## Data Sources

The script fetches data from two external URLs (defined in `constants.ts`):
- **Events and Venues**: `https://owddm.com/public/events_w_venues.json`
- **Photos**: `https://owddm.com/public/photos.json`

## Key Features

### 1. Event Processing
- Creates event directories under `/content/events/` with slugified names
- Generates `event.md` files with frontmatter containing event metadata
- Downloads and saves venue maps when `overwriteMaps` is true
- Processes photo galleries for each event

### 2. Photo Assignment and Distribution

The script assigns photos to events using multiple strategies:

#### Explicit Assignment
Photos with an explicit `event` field in the JSON are directly assigned to that event.

#### Timestamp-based Inference
When `INFER_EVENTS` is enabled (default: true):
- Photos without explicit event IDs are assigned to the event whose start time is closest *before* the photo timestamp
- This assumes photos are typically uploaded after the event they document

#### Photo Batch Redistribution (NEW)
When multiple photo batches are assigned to the same event:
1. The script identifies events with multiple batches and events without any photos
2. It keeps the LATEST batch (by upload order) with the original event
3. Earlier batches are redistributed to earlier events that don't have photos
4. Redistribution maintains chronological order - only assigns to events that occurred before the original event

Example scenario:
```
Event A (July 20): 2 photo batches → keeps the latest batch (batch 2)
Event B (July 19): 0 photo batches → receives the earlier batch (batch 1)
```

This ensures that when multiple batches are uploaded for the same event, they are distributed in order to fill up nearby events without photos.

### 3. Gallery Management

#### Photo Download
- Downloads images from remote URLs to local gallery directories
- Preserves original filenames
- Creates YAML metadata files for photos with captions

#### Cleanup Process
The script maintains clean gallery directories by:
- Removing photos that are no longer assigned to an event
- Deleting associated `.yaml` metadata files for removed photos
- Removing empty gallery directories
- Logging all deletions as warnings

This ensures that if photos are reassigned between events (either manually or through redistribution), the old locations are properly cleaned up.

### 4. Venue Processing
- Creates venue directories under `/content/venues/`
- Generates `venue.md` files with venue metadata
- Downloads and caches venue maps (when enabled)

## Statistics Tracking

The script tracks various statistics during import:
- Total events and venues processed
- Images downloaded, cached, and deleted
- Metadata files created, unchanged, or not applicable
- Errors encountered

## Configuration

Key constants in `constants.ts`:
- `INFER_EVENTS`: Enable timestamp-based photo assignment (default: true)
- `EVENTS_URL`: Source URL for events data
- `PHOTOS_URL`: Source URL for photos data
- `EVENTS_BASE_DIR`: Local directory for event content
- `VENUES_BASE_DIR`: Local directory for venue content

## Usage

```bash
# Run the import with default settings
npm run import

# Run with map downloads enabled
npm run import:maps
```

## Photo JSON Structure

The photos.json file contains:
```json
{
  "groups": {
    "groupId": {
      "content": "Description",
      "event": "eventId", // Optional explicit assignment
      "timestamp": 1234567890,
      "photos": [
        {
          "file": "https://example.com/photo.jpg",
          "caption": "Optional caption",
          "res": [[width, height]],
          "corners": ["#color1", "#color2", "#color3", "#color4"]
        }
      ]
    }
  }
}
```

## Error Handling

- Failed image downloads are logged but don't stop the import
- The script continues processing even if individual operations fail
- Unmatched cities (not found in cityMap) are reported at the end
- Photos that can't be assigned to any event are logged as warnings

## Important Notes

1. **Idempotent Operation**: Running the script multiple times is safe. It will:
   - Skip downloading images that already exist
   - Update metadata only when changed
   - Clean up stale files automatically

2. **Photo Reassignment**: When photos are reassigned (manually or through redistribution):
   - Old gallery locations are automatically cleaned
   - Empty directories are removed
   - All changes are logged

3. **Manual Photo Management**: Photos manually placed in gallery folders will be preserved unless they conflict with imported photos. However, if the import assigns different photos to that event, manual photos may be removed during cleanup.