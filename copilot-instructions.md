# Copilot Instructions — York University IT Innovation Team Website

## What this repo is
A static marketing/informational website for the York University IT Innovation Team. No build tools, no frameworks, no package managers — vanilla HTML, CSS, and JavaScript only.

## Tech stack
- Pure HTML5 (`index.html` — single page, all sections in one file)
- Vanilla CSS (`css/styles.css` — all styles, no preprocessor)
- Vanilla JavaScript (`js/main.js` — all interactivity)
- Font Awesome 6.5 loaded via CDN for icons
- No npm, no bundler, no transpiler — what you see is what the browser runs

## File structure
```
index.html        — Single-page site, all sections in one file
css/
  styles.css      — All styles (layout, components, animations, responsive)
js/
  main.js         — All interactivity (nav toggle, scroll animations, stats counter, project filter, contact form)
README.md
```

## Page sections (in order in index.html)
1. **Header / Navbar** — responsive with hamburger menu on mobile (`nav-toggle`, `nav-menu`)
2. **Hero** — headline, CTA buttons, animated icon grid (`hero-shape` elements)
3. **Stats Banner** — animated counters (`data-target` attribute drives the count-up animation)
4. **About** — mission/vision cards with `.reveal` scroll animation
5. **Services** — 6-card grid with `.reveal` scroll animation
6. **Projects** — filterable grid (`data-category` attribute, filter buttons with `data-filter`)
7. **Team** — cards with avatar icons and social links
8. **Contact** — form with client-side validation (`#contact-form`) and success message (`#form-success`)
9. **Footer** — links, social icons, dynamic copyright year (`#footer-year`)

## JavaScript behaviour (js/main.js)
- **Nav toggle**: hamburger button toggles `nav-menu--open` class on `#nav-menu`
- **Scroll reveal**: IntersectionObserver adds `revealed` class to elements with `.reveal` class
- **Stats counter**: counts up from 0 to `data-target` value when stat enters viewport
- **Project filter**: clicking `.filter-btn` filters `.project-card` by `data-category`, toggling `hidden` class
- **Contact form**: validates name, email (format), message fields; shows per-field errors via `.form-error` spans; shows `#form-success` on valid submit

## CSS patterns and conventions
- BEM-style class naming: `.block`, `.block__element`, `.block--modifier`
- CSS custom properties (variables) defined on `:root` for colours, spacing, typography
- Mobile-first responsive — base styles for mobile, `@media (min-width: ...)` for larger screens
- Animations use `transition` and `@keyframes` — no JS-driven inline styles for animation
- York University brand colours should be used: primary red `#8B1538`, white `#FFFFFF`, dark `#1a1a2e`

## Conventions to follow
- No external JS libraries — keep it vanilla, no jQuery, no frameworks
- No build step — all files must work by opening `index.html` directly in a browser
- Accessibility: all interactive elements need `aria-*` attributes; images/icons need `aria-label` or `aria-hidden="true"`
- New sections follow the existing pattern: `<section class="section" id="section-name">` with a `.container` wrapper
- New cards/components use the `.reveal` class so they animate in on scroll automatically
- Icons come from Font Awesome — search at fontawesome.com for the class name
- Do not add `<script>` or `<style>` tags inline in HTML — all JS goes in `js/main.js`, all CSS in `css/styles.css`
