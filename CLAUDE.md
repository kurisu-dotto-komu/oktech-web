# Code

- don't add unnecessary comments
- always use typescript, never javascript
- we are running a dev server in the background so you don't need to run it yourself
- use `@/` imports unless the component is a direct `./` sibling, avoid `../` imports
- we are using daisy ui v5, so always use these components when possible, and use it's theme classes
- prefer Astro components (.astro) over React components (.tsx) unless client-side interactivity is needed
- Astro templates require opening and closing frontmatter fences (---) with TypeScript code in between
- always use astro lucide icons when possible; import { Icon } from "astro-icon/components"
- use icon prefixes: `cib:` for brand icons, `lucide:` for general icons
- for React components, use the `export default function ComponentName` pattern, not named exports
- for internal links, use the Link and LinkReact components as they do prefixing
- import Link from "@/components/Common/Link.astro" for Astro components
- import LinkReact from "@/components/Common/LinkReact" for React components
- follow existing patterns and check neighboring files for style/structure

# Development

- never make git commands like commits unless I explicitly instruct you to
- never use --headed mode for playwright tests, always use the default headless option
- use `npm run typecheck` if editing imports to make sure they're working, this is quick and easy
- run tests with `npm run test` for dev testing,
- use `npm run test:build` very sparingly at the end of a big change
- always prefer editing existing files over creating new ones
- never proactively create documentation files (\*.md) unless explicitly requested
