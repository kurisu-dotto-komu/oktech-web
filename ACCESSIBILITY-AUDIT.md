# Accessibility and Web Standards Audit

## Executive Summary

This audit identifies accessibility issues and web standards compliance concerns in the OKTech Web codebase. The review focused on semantic HTML usage, ARIA labels, keyboard navigation, color contrast, form labels, alt text, and focus management.

## Critical Issues Found

### 1. Form Accessibility Issues

#### Missing Labels for Form Inputs
- **File**: `/src/components/Common/SearchBox.astro`
  - The search input lacks an associated label
  - The button lacks accessible text (only has an icon)
  ```astro
  <input
    type="text"
    placeholder={placeholder}
    class="input input-bordered input-lg join-item w-full"
  />
  <button class="btn btn-primary btn-lg join-item">
    <Icon name="lucide:search" size={20} />
  </button>
  ```
  **Fix**: Add aria-label or screen reader text

#### Deprecated tabindex Attribute
- **File**: `/src/components/Layout/TopBar.astro`
  - Uses deprecated `tabindex` instead of `tabIndex` in lines 44 and 48
  ```astro
  <label tabindex="0" class="btn btn-ghost bg-base-100/10">
  ```
  **Fix**: Change to `tabIndex` for React/JSX compatibility

### 2. Missing Alt Text

#### Empty Alt Text for Gallery Images
- **File**: `/src/components/Event/EventGalleryImages.astro`
  - Uses empty alt text when caption is null: `alt={img.data.caption ?? ""}`
  - Should provide meaningful alt text even without captions
  **Fix**: Provide descriptive alt text like "Event gallery image" or similar

### 3. Button Accessibility

#### Icon-Only Buttons Without Labels
- **File**: `/src/components/Common/ThemePicker.astro`
  - Theme picker button only has icon, no accessible text
  ```astro
  <button class="btn btn-circle" onclick="theme_modal.showModal()">
    <Icon name="lucide:palette" size={18} />
  </button>
  ```
  **Fix**: Add aria-label="Open theme picker"

### 4. Navigation and Landmarks

#### Proper Landmark Usage
- **Good**: The main layout (`PageLayout.astro`) properly uses semantic landmarks:
  - `<header>`, `<main>`, and `<footer>` tags
  - This provides good page structure for screen readers

### 5. Keyboard Navigation

#### Missing Keyboard Support
- **File**: `/src/components/Layout/TopBar.astro`
  - Mobile dropdown menu may have keyboard navigation issues
  - Using `tabindex="0"` on non-interactive elements (label)

## Moderate Issues

### 1. Heading Hierarchy

#### Potential Heading Structure Issues
- Multiple components use `<h1>` and `<h2>` tags without clear hierarchy context
- **Files affected**:
  - `/src/components/Landing/Hero.astro` - Uses `<h1>`
  - `/src/components/Common/Section.astro` - Uses `<h2>`
  - Various other components use headings
- **Recommendation**: Ensure only one `<h1>` per page and proper nesting

### 2. Color Contrast

#### Theme-Based Contrast Concerns
- The app uses DaisyUI themes which should handle contrast, but custom theme colors need verification
- Components like `PersonImage.astro` use `bg-primary text-primary-content`
- **Recommendation**: Test all theme combinations for WCAG AA compliance

### 3. Focus Management

#### Dialog Focus Management
- **File**: `/src/components/Common/ThemePicker.astro`
  - Uses native `<dialog>` element which handles focus trapping
  - However, no explicit focus management when dialog opens/closes

## Good Practices Found

### 1. ARIA Labels
- **Good examples**:
  - `/src/components/EventsFilter/EventsSearchInput.tsx` - Clear button has `aria-label="Clear search"`
  - `/src/components/Common/Fullscreen.tsx` - Dynamic aria-label based on state

### 2. Semantic HTML
- Proper use of semantic elements in most components
- Good page structure with landmarks in `PageLayout.astro`

### 3. Image Handling
- Most images have alt text (e.g., `PersonImage.astro`)
- Using Astro's Image component for optimization

## Recommendations

### Immediate Actions
1. Add aria-labels to all icon-only buttons
2. Fix `tabindex` to `tabIndex` in Astro components
3. Add labels or aria-labels to all form inputs
4. Provide meaningful alt text for all images

### Short-term Improvements
1. Implement skip navigation links
2. Add focus visible styles for keyboard navigation
3. Test and fix color contrast for all themes
4. Ensure proper heading hierarchy across pages

### Long-term Enhancements
1. Implement comprehensive keyboard navigation testing
2. Add automated accessibility testing (e.g., axe-core)
3. Create accessibility guidelines for the project
4. Regular accessibility audits

## Testing Recommendations

1. Use screen reader testing (NVDA, JAWS, VoiceOver)
2. Keyboard-only navigation testing
3. Color contrast analyzers for all theme combinations
4. Automated tools like axe DevTools or Lighthouse

## Conclusion

While the codebase shows some good accessibility practices (semantic HTML, some ARIA labels), there are several critical issues that need immediate attention, particularly around form accessibility and button labeling. The use of DaisyUI components provides a good foundation, but custom implementations need careful accessibility consideration.