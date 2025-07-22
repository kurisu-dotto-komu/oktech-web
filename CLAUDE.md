## Agent Behavior

- **Never assume missing context** - ask questions if uncertain
- **Never hallucinate libraries or functions** - only use verified packages from package.json
- **Always confirm file paths and module names** exist before referencing them
- **Use the `context7` MCP tool** for unfamiliar or updated libraries
- **Never make git commands** unless explicitly instructed
- **Do what has been asked; nothing more, nothing less**
- **Always prefer editing existing files** over creating new ones
- **Never create files unless absolutely necessary**
- **Never proactively create documentation files** (\*.md) unless explicitly requested
- **Clean up after yourself** - remove unused imports, variables, functions, and components
- **Actively identify and remove dead code** - if code isn't being used, delete it

## Development Workflow

- **We are running a dev server in the background** - don't start your own
- **Use TDD for new features** - create failing tests first, then implement
- **Update existing tests** when logic changes
- **Never use `--headed` or `--debug`** with playwright tests - use default headless mode
- **Use `npm run checks`** frequently to verify imports (it's cheap)
- **Use `npm run test`** sparingly during development (it's expensive)
- **Use `npm run test:build`** rarely for big changes
- **The build step might take a long time**, so don't timeout early

## Testing Guidelines

- **All tests go in the `/test` directory** - never create test files outside this location
- **E2E tests go in `/test/e2e`** - for testing user flows, navigation, and feature interactions
- **Visual tests go in `/test/visuals`** - for UI consistency, theme switching, and layout verification
- **Use descriptive test names** that clearly indicate what is being tested
- **Follow existing test patterns** in each directory for consistency
- **Test helpers go in `/test/helpers`** - reusable utilities for tests
- **Visual test screenshots are stored in `/test/screenshots`** - reference images for visual regression

## Code Structure & Modularity

- **Never create a file longer than 150 lines of code** - refactor into modules or helper files
- **Use consistent naming conventions, file structure, and architecture patterns**
- **Organize code into clearly separated modules**, grouped by feature or responsibility
- **Use `@/` imports** unless the component is a direct `./` sibling, avoid `../` imports
- **For React components, use `export default function ComponentName`** pattern, not named exports
- **Prefer React components (.tsx) over Astro components (.tsx)**, save Astro components for pages and layouts
- **Follow existing patterns** and check neighboring files for style/structure

## Style & Conventions

- **Always use TypeScript**, never JavaScript
- **Follow the DRY principle** - avoid duplication
- **Keep comments minimal** - only for important or unintuitive nuances, use `// Reason:` for complex logic
- **Never use `any`, `// eslint-disable-next-line`**, or similar type shortcuts
- **Astro templates require opening and closing frontmatter fences (---)** with TypeScript code in between
- **We are using daisy ui v5**, so always use these components when possible, and use its theme classes
- **Use Tailwind classes instead of inline styles** - prefer `className="text-[2vw]"` over `style={{ fontSize: '2vw' }}`

## Icons & Components

- **Icon libraries**: Use `lucide:` for Astro and `lu` for React for general icons, and `cib` for brand icons
- **For Astro components**: use astro-icon - `import { Icon } from "astro-icon/components"` with `<Icon name="lucide:home" />`
- **For React components**: use react-icons - `import { Home } from "react-icons/lu"`

## Internal Links

- **Use LinkAstro and LinkReact components** as they handle URL prefixing
- **Import for Astro**: `import Link from "@/components/Common/LinkAstro.astro"`
- **Import for React**: `import Link from "@/components/Common/LinkReact"`
