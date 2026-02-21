# GCR Consulting — Static MVP Website

A clean, minimal, dependency-free static website for GCR Consulting. Built with vanilla HTML5, CSS3, and JavaScript. Ready to deploy on any static host.

## Page Mapping

| Word Document | HTML File | Menu Label | Status |
|---|---|---|---|
| 1 Consulting WEB Home.docx | `index.html` | Home | Full content |
| 2 Consulting WEB About GCR.docx | `page-02.html` | About | Full content |
| 3 Consulting WEB Services.docx | `page-03.html` | Services | Synthesized from Home + doc |
| 4 Consulting WEB Case Studies.docx | `page-04.html` | Case Studies | Placeholder (pending data) |
| 5 Consulting WEB Leadership.docx | `page-05.html` | Leadership | Partial (pending bios) |
| 6 Consulting WEB Readiness Check.docx | `page-06.html` | Readiness Check | Placeholder questions |
| 7 Consulting WEB News.docx | `page-07.html` | News | Placeholder articles |
| 8 Consulting WEB Contact.docx | `page-08.html` | Contact | Full content |
| SPDC WEB Legal.docx | `page-09.html` | Legal | Placeholder (needs legal review) |

## File Structure

```
gcr/
├── index.html              Home page
├── page-02.html             About GCR
├── page-03.html             Services
├── page-04.html             Case Studies
├── page-05.html             Leadership
├── page-06.html             Readiness Check
├── page-07.html             News & Insights
├── page-08.html             Contact
├── page-09.html             Legal (Privacy, Terms, Imprint)
├── redirects.json           Client-side redirect mappings
├── README.md                This file
├── css/
│   └── styles.css           All styles (variables, components, utilities)
├── js/
│   └── main.js              All interactivity (menu, tabs, quiz, forms)
├── assets/
│   ├── images/              Placeholder images (see assets/README.md)
│   └── README.md            Image replacement guide
└── GCR data/                Original Word documents (source content)
```

## Getting Started

1. Clone the repository
2. Open `index.html` in any browser — no build step required
3. For local development with live reload: `npx serve .` or `python3 -m http.server`

## Pending Content Items

The following sections require data from the client before they can be finalized:

- [ ] **Leadership bios** — Partner names, photos, credentials (page-05, and leadership previews on other pages)
- [ ] **Advisory Board** — Names and positions of advisory board members (page-05)
- [ ] **Case Studies** — Featured case content, 3 additional cases with metrics (page-04)
- [ ] **Case Study filters** — Confirmed industry and task type categories (page-04)
- [ ] **Service leadership** — Name, credentials, quote for service lead (page-03)
- [ ] **Related insights** — Real article content for insights sections (page-03, page-07)
- [ ] **Readiness Check questions** — Finalized question bank from scoring documents (page-06)
- [ ] **Legal text** — All legal sections need review by qualified legal counsel (page-09)
- [ ] **High-Level Access details** — Specific institutional memberships and access levels (page-02)

## How to Replace Text

If docx processing was not possible for certain sections, look for placeholder blocks marked with:

```html
<div class="placeholder-block">
  <p class="text-light">PENDING DATA: description...</p>
</div>
```

Replace the entire `<div class="placeholder-block">` with your cleaned HTML content inside the parent `<section>`.

## How to Swap Images

1. See `assets/README.md` for full naming conventions and dimensions
2. Replace `<div data-placeholder-img>` elements with `<img>` tags:
   ```html
   <!-- Before -->
   <div data-placeholder-img class="ratio-16-9">Hero Image</div>
   <!-- After -->
   <img src="assets/images/hero-home.jpg" alt="Description" width="1920" height="1080">
   ```
3. Update `alt` text to describe the actual image content

## How to Change Theme (CSS Variables)

Open `css/styles.css` and edit the `:root` variables at the top:

```css
:root {
  --color-primary: #1B2A4A;    /* Deep navy */
  --color-accent: #C8A951;     /* Gold */
  --font-heading: 'Georgia', serif;
  --font-body: 'Helvetica Neue', sans-serif;
  /* ... more variables */
}
```

All colors, fonts, spacing, and sizes cascade from these variables.

## How to Deploy

### GitHub Pages
1. Go to repo Settings > Pages
2. Set source to "Deploy from a branch" > `main` > `/ (root)`
3. Save — site will be live at `https://shreyashbairi.github.io/gcr/`

### Netlify
1. Connect your GitHub repo at netlify.com
2. Build command: (leave empty)
3. Publish directory: `/`
4. Deploy

### Any Static Host
Upload all files (HTML, CSS, JS, assets) to the host root. No build step needed.

## Accessibility Checklist

### Implemented
- [x] `<html lang="en">` on all pages
- [x] Skip-to-content link on every page
- [x] Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- [x] ARIA attributes (roles, labels, expanded states, selected states)
- [x] One `<h1>` per page, no skipped heading levels
- [x] Descriptive `alt` text on all images
- [x] Visible focus outlines for keyboard navigation
- [x] Form labels linked via `for`/`id`
- [x] `aria-live` regions for dynamic content (quiz results, form success)
- [x] `prefers-reduced-motion` media query
- [x] Keyboard-accessible mobile menu (ESC to close)

### To Verify After Designer Updates
- [ ] Color contrast ratios meet WCAG 2.1 AA (4.5:1 normal text, 3:1 large text)
- [ ] Custom fonts maintain readability at all sizes
- [ ] Interactive elements have sufficient touch target size (44x44px minimum)
- [ ] Images have meaningful alt text (not just "placeholder")
- [ ] Run Lighthouse accessibility audit (target: 90+)
- [ ] Test with screen reader (VoiceOver, NVDA)

---

## Designer Handoff Checklist

### Where to Pull Figma Styles into CSS

1. **Colors**: `css/styles.css` → `:root` variables (line ~20)
2. **Fonts**: `css/styles.css` → `--font-heading` and `--font-body` variables, plus add `@font-face` rules or Google Fonts `<link>` to each HTML `<head>`
3. **Type scale**: `css/styles.css` → `--text-*` variables (line ~45)
4. **Spacing**: `css/styles.css` → `--space-*` variables (line ~60)
5. **Buttons**: `css/styles.css` → search for `.btn` (padding, border-radius, hover states)
6. **Cards**: `css/styles.css` → search for `.card` (shadows, border-radius, padding)
7. **Hero sections**: `css/styles.css` → search for `.hero` (heights, overlays, backgrounds)

### Where to Drop Images

1. **Logos**: Replace `<div data-placeholder-img>LOGO</div>` in every page's `<header>` and `<footer>` with `<img src="assets/images/logo-gcr.svg">`
2. **Hero backgrounds**: Add background-image to `.hero` in CSS or via inline styles
3. **Trust bar logos**: Replace placeholder divs in the trust bar section of `index.html`
4. **Partner photos**: Replace placeholder divs in leadership sections
5. **Service icons**: Replace Unicode symbols in `.card__icon` with `<img>` or inline SVG
6. **Article images**: Replace `<div class="card__image" data-placeholder-img>` with `<img>`

### Search for TODO Comments

All designer swap points are marked with:
```
<!-- TODO: replace by Figma asset -->
```

Search all HTML files for "TODO" to find every replacement point.
