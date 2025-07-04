# ShaderBackground Component

A modern, performant animated background component using WebGL shaders for Astro/React applications.

## Features

- **Three variants**: `dots`, `waves`, and `grid`
- **Mouse interaction**: Responsive to cursor movement
- **Theme-aware**: Supports CSS custom properties
- **Performance optimized**: WebGL-based rendering
- **Responsive**: Automatically adapts to container size
- **Fallback safe**: Graceful degradation for unsupported browsers

## Usage

### Basic Usage

```astro
---
import ShaderBackground from "@/components/Common/ShaderBackground.tsx";
---

<div class="relative">
  <ShaderBackground client:load />
  <div class="relative z-10">
    <!-- Your content here -->
  </div>
</div>
```

### With Props

```astro
<ShaderBackground 
  client:load 
  variant="dots" 
  intensity={0.6}
  color="#ffffff"
  backgroundColor="transparent"
  interactive={true}
  className="opacity-50"
/>
```

### Theme Integration

```astro
<!-- Uses CSS custom properties for theming -->
<ShaderBackground 
  client:load 
  color="var(--primary)"
  backgroundColor="var(--secondary)"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'dots' \| 'waves' \| 'grid'` | `'dots'` | Animation style variant |
| `intensity` | `number` | `0.6` | Animation intensity (0-1) |
| `color` | `string` | `'#ffffff'` | Foreground color (hex or CSS var) |
| `backgroundColor` | `string` | `'transparent'` | Background color |
| `interactive` | `boolean` | `true` | Enable mouse interaction |
| `className` | `string` | `''` | Additional CSS classes |

## Variants

### Dots
A subtle dot grid pattern with gentle pulsing animation and mouse attraction effects.

### Waves  
Flowing wave patterns with distortion effects for a more dynamic look.

### Grid
Geometric grid lines with intersection highlights and structural appeal.

## Performance Notes

- Uses WebGL for hardware acceleration
- Automatically scales with device pixel ratio
- Minimal CPU usage through GPU rendering
- Responsive event listeners (only when interactive)

## Browser Support

- Modern browsers with WebGL support
- Falls back gracefully to transparent background
- No JavaScript errors on unsupported browsers

## Integration with Astro

Must use `client:load` directive since this is a React component with browser APIs:

```astro
<ShaderBackground client:load />
```