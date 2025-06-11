## Content Schema

The `content/` directory contains three main content types, each with its own schema and structure:

### Events (`/content/events/`)

Each event is stored in a directory named `{meetupId}-{slug}/` containing:

- `event.md` - Event details with frontmatter:
  ```yaml
  title: string                    # Event title
  dateTime: "YYYY-MM-DD HH:MM"     # JST timezone
  duration: number                 # Duration in minutes
  cover: "./filename.webp"         # Cover image path
  topics: [string, ...]            # Optional topic tags
  meetupId: number                 # Meetup.com event ID
  group: number                    # Group ID (15632202 or 36450361)
  venue: number                    # Optional venue ID reference
  devOnly: boolean                 # Show only in dev mode (default: false)
  ```
- Cover image (`.webp` format)
- `gallery/` - Optional event photos with `.yaml` metadata files

### Speakers (`/content/speakers/`)

Each speaker is stored in a directory named `{firstname-lastname}/` containing:

- `speaker.md` - Speaker information with frontmatter:
  ```yaml
  name: string                     # Full name
  skills: [string, ...]            # Optional skills/expertise
  events: [number, ...]            # Event meetupIds they spoke at
  avatar: string                   # Optional avatar path
  theme: string                    # Optional UI theme (auto-generated if not set)
  ```

### Venues (`/content/venues/`)

Each venue is stored in a directory named `{meetupId}-{slug}/` containing:

- `venue.md` - Venue details with frontmatter:
  ```yaml
  title: string                    # Venue name
  city: string                     # Optional city
  country: string                  # Optional country code
  address: string                  # Optional full address
  state: string                    # Optional state/prefecture
  postalCode: string               # Optional postal code
  url: string                      # Optional venue website
  gmaps: string                    # Optional Google Maps URL
  coordinates:                     # Optional GPS coordinates
    lat: number
    lng: number
  meetupId: number                 # Meetup.com venue ID
  hasPage: boolean                 # Generate a page for this venue
  ```
- `map.jpg` - Static map image

### Relationships

- **Events → Venues**: Events reference venues by their `meetupId`
- **Speakers → Events**: Speakers list the event `meetupId`s they participated in
- **Events → Gallery**: Gallery images are automatically associated with their parent event

### Notes

- All event times are in JST and converted to UTC internally
- Images should be in WebP format for events and JPG for venue maps
- Content with `devOnly: true` only appears in development mode

## TODO

Reduce confusion with slug/id definition

Members: with hasPage: true.

## AI Disclosure

This project was created with the assistance of the Cursor IDE, including various LLMs such as Claude, Gemini, GPT, etc. It can be assumed that all of Cursor's default models were used from time to time since the start of this project in April 2025.
