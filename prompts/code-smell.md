# Code Smell Detection Prompt

Analyze this Astro/TypeScript project and identify code smells. Output findings to `SMELL.md` as a simple list.

## Areas to Check

### Dead Code

- Unused functions, variables, components, types
- Unused imports and exports
- Orphaned files not referenced anywhere
- Commented-out code blocks
- Unused assets (images, fonts, etc.)

### Comment Issues

- Useless comments that restate obvious code
- Verbose/repetitive comments
- Outdated comments that don't match current code
- Old TODO/FIXME items that should be addressed or removed

### Astro-Specific Issues

- Missing frontmatter fences (`---`)
- React patterns incorrectly used in Astro components
- Unnecessary `client:*` directives
- Components written as functions instead of proper Astro syntax

### General Code Smells

- Large monolithic components (>200 lines)
- Duplicate logic that could be abstracted
- Hard-coded values without explanation
- `any` types instead of proper TypeScript typing
- Circular dependencies
- Deep import paths that need aliases

## Output Format

Create `SMELL.md` with this simple format:

```
# Code Smell Report

## Dead Code
- [ ] Remove unused function `validateUser` in src/utils/auth.ts:45
- [ ] Delete orphaned component src/components/OldButton.astro

## Comments
- [ ] Remove useless comment in src/pages/index.astro:12
- [ ] Address TODO from 2023 in src/utils/data.ts:89

## Other Issues
- [ ] Add proper TypeScript types to props in src/components/Header.astro
- [ ] Split large component src/pages/events/[id].astro (350 lines)
```

Focus on actionable items that can be quickly addressed. No explanations needed - just the location and what to fix.
