# Image Assets Guide

## Naming Convention

All placeholder images follow this naming scheme:

- **Hero images**: `hero-{page}.jpg` (e.g., `hero-home.jpg`, `hero-about.jpg`)
- **Logo**: `logo-gcr.svg` (dark), `logo-gcr-white.svg` (for dark backgrounds)
- **Trust bar logos**: `trust-{org}.svg` (e.g., `trust-wef.svg`, `trust-un.svg`)
- **Partner photos**: `partner-{name}.jpg` (e.g., `partner-murat.jpg`)
- **Sector images**: `sector-{name}.jpg` (e.g., `sector-energy.jpg`)
- **Service icons**: `icon-service-{number}.svg` (01 through 12)
- **Case study images**: `case-{number}.jpg`
- **Insight/article images**: `insight-{number}.jpg`
- **Open Graph**: `og-image.jpg` (1200x630px)
- **Favicon**: `favicon.ico`

## Recommended Dimensions

| Image Type        | Width  | Height | Format       |
|-------------------|--------|--------|--------------|
| Hero images       | 1920px | 1080px | JPG/WebP     |
| Logo (dark)       | 320px  | 80px   | SVG          |
| Logo (white)      | 320px  | 80px   | SVG          |
| Trust bar logos   | 160px  | auto   | SVG          |
| Partner photos    | 400px  | 500px  | JPG/WebP     |
| Sector images     | 600px  | 400px  | JPG/WebP     |
| Service icons     | 64px   | 64px   | SVG          |
| Case study images | 800px  | 450px  | JPG/WebP     |
| Insight images    | 800px  | 450px  | JPG/WebP     |
| OG image          | 1200px | 630px  | JPG          |
| Favicon           | 32px   | 32px   | ICO/PNG      |

## How to Replace Images

1. Export your image from Figma/Photoshop at the recommended dimensions
2. Optimize: use TinyPNG, Squoosh, or similar tool to reduce file size
3. Name the file using the convention above
4. Place it in this `/assets/images/` directory
5. The HTML already references these filenames — no code changes needed

## Current Placeholders

During development, images are shown as dashed-border boxes with text labels.
These are created via the `[data-placeholder-img]` CSS attribute in `styles.css`.
Once real images are added, simply replace the `<div data-placeholder-img>` elements
with `<img>` tags pointing to the corresponding file.

### Example Replacement

**Before (placeholder):**
```html
<div data-placeholder-img class="ratio-16-9">Hero Image</div>
```

**After (real image):**
```html
<img src="assets/images/hero-home.jpg" alt="Greater Caspian Region aerial view" width="1920" height="1080">
```
