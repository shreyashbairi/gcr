# CSS Optimization Instructions for `css/styles.css`

> **Goal:** Reduce `css/styles.css` from ~6,900 lines to ~5,000 lines with zero visual or behavioral changes.
> **Rule:** If any transformation creates a detectable visual difference, revert it. Do not change specificity, cascade ordering, or runtime dynamic class behavior.

---

## Phase 1: Delete Unused About Page v1 Components (~800 lines)

The About page (`page-02.html`) uses **exclusively v2 classes**. No v1 about-classes exist in any HTML file across the entire project (verified via grep across all 41 HTML files). Delete every rule block whose selector starts with these v1 prefixes:

**Delete all rules for these selectors and their BEM children:**

- `about-market` (NOT `about-market-v2`) — includes `about-market__text`, `about-market__stats`, `about-market__formerly`
- `about-stat` (NOT `about-stat-v2`) — includes `about-stat__value`, `about-stat__label`, `about-stat__desc`
- `about-reality` (NOT `about-reality-v2`) — includes `about-reality__grid`, `about-reality__intro`, `about-reality__friction-title`, `about-reality__cards`, `about-reality__card`, `about-reality__card h4`, `about-reality__card p`, `about-reality__right`, `about-reality__right img`
- `about-value-prop` — includes `about-value-prop__label`, `about-value-prop p:last-child`
- `about-sectors` (NOT `about-sectors-v2`) — includes `about-sectors__intro`, `about-sectors__grid`
- `about-sector-card` (NOT `about-sector-v2`) — includes `about-sector-card__icon`, `about-sector-card__icon img`, `about-sector-card h3`, `about-sector-card p`
- `about-access` — includes `about-access__subtitle`, `about-access__quote`, `about-access__author`, `about-access__image`, `about-access__image img`
- `about-leader` (NOT `about-leader-v2`) — includes `about-leader__image-wrap`, `about-leader__bg-image`, `about-leader__profile-card`, `about-leader__profile-photo`, `about-leader__profile-card h3`, `about-leader__profile-role`, `about-leader__profile-bio`, `about-leader__profile-link`, `about-leader__content h2`, `about-leader__content p`
- `about-deploy-section`, `about-deploy` (NOT `about-deploy-v2`) — includes `about-deploy__intro`, `about-deploy__value-strip`, `about-deploy__value-strip p`, `about-deploy__value-strip strong`, `about-deploy__features`, `about-deploy__feature`, `about-deploy__feature-icon`, `about-deploy__feature h4`, `about-deploy__feature p`, `about-deploy__process`, `about-deploy__process h3`, `about-deploy__process-steps`, `about-deploy__process-step`, `about-deploy__process-num`, `about-deploy__process-arrow`, `about-deploy__ownership`, `about-deploy__ownership strong`
- `about-start` (NOT `about-start-v2`) — includes `about-start__title`, `about-start__title span`, `about-start__options`, `about-start__option`, `about-start__option-icon`, `about-start__option h4`, `about-start__option p`, `about-start__option-tag`
- `about-phase` — includes `about-phase__image`, `about-phase__image img`, `about-phase__badge`, `about-phase__content`, `about-phase__content h3`, `about-phase__tagline`, `about-phase__content ul`, `about-phase__content li`, `about-phase__deliverable`, `about-phase--reverse`
- `about-roadmap__intro`

**Also delete any `@media` blocks that ONLY contain rules for the above selectors.**

**Keep:** `about-hero` (used), `about-cta-section`, `about-cta-buttons` (used), `about-timeline` (used), and ALL `*-v2` variants.

---

## Phase 2: Merge Section 11 Enhancements Into Original Definitions (~400 lines)

Section 11 (labeled "HARK-INSPIRED ENHANCEMENTS") contains override blocks that add `transition` and `:hover` effects to components defined earlier. Instead of two layers, merge the final computed values into the original definitions and delete the section 11 override blocks.

**For each subsection below, merge the enhancement INTO the original, then delete the enhancement block:**

### 11e — Enhanced Card Hovers (merge, then delete)
| Enhancement Selector | What to merge into original | Properties to add |
|---|---|---|
| `.service-card` (11e) | Merge into `.service-card` (section 10f) | `transition: box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease;` |
| `.service-card:hover` (11e) | Merge into `.service-card:hover` (section 10f) | `transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(200, 169, 81, 0.2);` |
| `.card:hover` (11e) | Place directly after the `.card` block in section 4d | Keep as-is (there was no original hover — this IS the definition now) |
| `.sector-morph-card` (11e) | Merge into `.sector-morph-card` (section 13) | `transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;` |
| `.sector-morph-card:hover` (11e) | Place after `.sector-morph-card` in section 13 | Keep as-is (new hover) |

### 11p — Enhanced Card Hovers for All Page Types (merge, then delete)
| Enhancement Selector | What to merge into original |
|---|---|
| `.case-study-grid__card` + `:hover` | Place near `.case-study-grid` section — these are NEW selectors, move them there |
| `.news-grid__card` + `:hover` | Merge transition into `.news-grid__card` definition in section 11 |
| `.news-grid__card:hover` | Place after `.news-grid__card` |
| `.news-grid__read-more` + hover gap | Merge into existing `.news-grid__read-more` |
| `.morph-card` transition | Merge into `.morph-card` (section 11) |
| `.morph-card:hover` box-shadow | Place after `.morph-card` |
| `.insight-card` transition | Merge into `.insight-card` definition |
| `.insight-card:hover` | Place after `.insight-card` |
| `.next-step-card` transition | Merge into `.next-step-card` definition |
| `.next-step-card:hover` box-shadow/transform | Merge into existing `.next-step-card:hover` |
| `.spotlight-card` + `:hover` | Merge into `.spotlight-card` definition |
| `.blog-related-card` transition | Merge into `.blog-related-card` definition |
| `.blog-related-card:hover` | Place after `.blog-related-card` |
| `.card--case` + `:hover` | Keep near `.card` section — new selectors |
| `.featured-case__metric` + `:hover` | Place near `.featured-case` section |
| `.card__metric` + hover text-shadow | Place near `.card` section |

### 11q — Methodology & Timeline Enhancements (merge, then delete)
| Enhancement Selector | Merge into |
|---|---|
| `.methodology-flow__step` transition + `:hover` | Merge into `.methodology-flow__step` in service page section |
| `.timeline__phase` transition + `:hover` | Merge into `.timeline__phase` in section 4h |
| `.deliver-phase__title` transition | Merge into `.deliver-phase__title` |

### 11r — Leader Page Enhancements (merge, then delete)
Move `.leader-hero__photo` transition and hover effect into the leader page section (section 12). Move `.leader-hero__name`/`__title` animation and `.leader-sidebar` transitions into section 12 as well.

### 11s — Blog Page Enhancements (merge, then delete)
Move `.blog-hero` transition, `.blog-article__title`/`__date` animations, and `.blog-article__body blockquote` transition into section 13 (blog page section).

### 11t — Partner Note Slide-in (merge, then delete)
Merge transition and hover into original `.partner-note` definition in section 4s.

### 11u — Section Image Parallax-lite (merge, then delete)
Move `.section img` transition/hover into section 3 (layout) after `.section` definitions.

### 11v — Contact Form Enhancements (DELETE ENTIRELY)
This block is a **pure restatement** of existing rules — the exact same `transition` and `:focus` box-shadow properties already exist in section 4i. Delete the entire 11v block.

### 11w — Case Filter Button Enhancements (merge, then delete)
Merge transition override and hover `translateY(-2px)` + `box-shadow` into `.case-filter__btn` in section 4t.

### DO NOT merge these sections — they contain genuinely new selectors/features:
- **11a** (Preloader) — entirely new component
- **11b** (Scroll Reveal) — new `[data-hero-anim]`, `.reveal-*` classes
- **11c** (Typography Refinements) — new `h1`/`h2`/`.hero__headline` overrides
- **11d** (Button Hover Micro-interactions) — new `.btn:hover` scale, arrow slide, footer underline
- **11f** (Nav Hover Dimming) — new `:has()` selectors
- **11g** (Trust Bar Marquee) — entirely new component
- **11h** (Section Gradient Dividers) — new pseudo-elements
- **11i** (Dark Section Enhancements) — new positioning + shimmer animation
- **11j** (Hero Cursor Glow) — entirely new component
- **11k** (Hero Parallax) — mobile media query override
- **11l** (Metrics Counter Animation) — new `.is-counting` state
- **11m** (Footer Reveal) — single property addition
- **11n** (Page Clip-Path Reveal) — new animation
- **11o** (Smooth Scroll / Lenis) — library support
- **11x** (Section Transitions) — new gradient dividers

After merging, these "keep" sections should remain in place but the section "11" wrapper heading can be renamed to something like "Animations & Effects" for clarity.

---

## Phase 3: Deduplicate Button Sweep Animation (~60 lines)

These four selectors have **100% identical** `::before` pseudo-element and hover `width: 250%` animation:

1. `.btn::before` + `.btn:hover::before` (the original, keep this one)
2. `.footer-cta__btn::before` + `.footer-cta__btn:hover::before` (delete)
3. `.readiness-start-btn::before` + `.readiness-start-btn:hover::before` (delete)
4. `.readiness-btn::before` + `.readiness-btn:hover::before` (delete)

**Replace** by making the duplicate selectors inherit from `.btn::before`:
```css
.footer-cta__btn::before,
.readiness-start-btn::before,
.readiness-btn::before {
  content: "";
  position: absolute;
  left: -50px;
  top: 0;
  width: 0;
  height: 100%;
  background-color: var(--color-accent);
  transform: skewX(45deg);
  z-index: -1;
  transition: width 800ms;
}

.footer-cta__btn:hover::before,
.readiness-start-btn:hover::before,
.readiness-btn:hover::before {
  width: 250%;
}
```

This replaces 4 separate blocks (each ~15 lines) with 2 grouped blocks (~18 lines total).

The base button properties these elements need (position: relative, overflow: hidden, z-index: 1) are already set on each element individually — verify this is still the case after merging.

---

## Phase 4: Verification Checklist

After all changes, run these checks:

1. **Brace balance:** Parse the file and confirm `{` count equals `}` count (ignoring those inside comments).
2. **Comment balance:** Confirm `/*` count equals `*/` count.
3. **Selector preservation:** Extract all selectors from the old and new files. Every selector in the new file should have existed in the old file. The only selectors that should be MISSING are the v1 about-page ones listed in Phase 1.
4. **Visual test:** Open every page type in a browser and confirm no visual changes:
   - `index.html` (home)
   - `page-02.html` (about)
   - `page-03.html` (services)
   - `page-05.html` (case studies)
   - `page-06.html` (leadership)
   - `page-07.html` (news)
   - `page-08.html` (contact)
   - `page-09.html` (readiness check)
   - Any `service-*.html` page
   - Any `leader-*.html` page
   - Any `blog-*.html` page
   - `legal.html`

---

## Expected Result

| Phase | Lines Saved |
|-------|------------|
| Phase 1: Delete v1 about components | ~800 |
| Phase 2: Merge section 11 into originals | ~400 |
| Phase 3: Deduplicate button sweep | ~60 |
| **Total** | **~1,260 lines** |

Final file size: **~5,600 lines** (down from 6,883)
