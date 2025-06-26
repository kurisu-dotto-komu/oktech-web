# TypeScript Type Checking and Error Resolution

Your task is to run type checking and systematically fix all TypeScript errors and warnings in this codebase.

## Process Overview

1. **Run Initial Type Check**: Start by running `npm run typecheck`
2. **Analyze Complete Output**: Read the ENTIRE output, not just the summary
3. **Fix Issues Systematically**: Address errors and warnings one by one
4. **Iterate Until Clean**: Keep running typecheck after each fix until no issues remain

## Important Notes

⚠️ **Critical**: The summary line (e.g., "Found 0 errors, 0 warnings") **DOES NOT** include `.astro` files. You must examine the complete output to catch all issues, including:

- TypeScript errors in `.ts` and `.tsx` files
- Type errors within `.astro` file frontmatter
- Import/export issues
- Any other type-related problems

## Step-by-Step Instructions

### Step 1: Initial Assessment

```bash
npm run typecheck
```

- Read the **complete output**, line by line
- Don't rely on the summary counts alone
- Look for any error messages, even if summary shows "0 errors"

### Step 2: Categorize Issues

Group the issues you find:

- **Critical Errors**: Type errors that prevent compilation
- **Import/Export Issues**: Missing imports, incorrect paths
- **Type Definition Problems**: Missing types, incorrect type annotations
- **Astro-specific Issues**: Problems in .astro file frontmatter

### Step 3: Fix Issues Systematically

- Start with critical errors first
- Fix one issue at a time
- After each fix, run `npm run typecheck` again
- Verify that your fix didn't introduce new issues

### Step 4: Iterate Until Clean

```bash
npm run typecheck
```

Repeat this command after each fix until:

- The complete output shows no error messages
- No warnings are displayed
- The summary confirms 0 errors and 0 warnings
- **Most importantly**: No issues appear anywhere in the full output

## Common Issues and Solutions

### Import Issues

- Missing imports: Add the required import statements
- Incorrect paths: Fix relative/absolute import paths
- Default vs named imports: Ensure correct import syntax

### Type Definition Issues

- Missing type annotations: Add explicit types where needed
- Incorrect generic usage: Fix generic type parameters
- Interface/type mismatches: Align implementations with definitions

### Astro-Specific Issues

- Frontmatter type errors: Fix TypeScript code in `---` blocks
- Component prop types: Ensure proper prop type definitions
- Missing client directives: Add `client:*` when needed for interactivity

## Verification Checklist

Before considering the task complete, ensure:

- [ ] `npm run typecheck` shows no error messages in the complete output
- [ ] Summary shows "Found 0 errors, 0 warnings"
- [ ] No `.astro` file issues are present
- [ ] All imports resolve correctly
- [ ] All type annotations are accurate
- [ ] The codebase compiles without any type-related issues

## Best Practices

1. **Read Every Line**: Don't skip any part of the typecheck output
2. **Fix Incrementally**: Make small, focused changes
3. **Test After Each Fix**: Run typecheck after every change
4. **Preserve Functionality**: Ensure fixes don't break existing functionality
5. **Follow Project Patterns**: Use existing code patterns and conventions

## Final Step

Once you believe all issues are resolved:

1. Run `npm run typecheck` one final time
2. Confirm the complete output is clean
3. Report the final status with the exact output

Remember: **Success is only when the complete typecheck output is entirely clean, not just when the summary shows 0 errors.**
