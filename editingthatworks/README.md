Editing That Works — README

Project overview

This is a small static website "Editing that Works" (Caroline Jarrett). It contains a home page and nine technique pages, an About page, CSS, and supporting images. The project is intentionally JavaScript-free and intended to be served as static HTML.

Project files (important)

- index.html — Home page
- about.html — About page
- step1.html … step9.html — Technique pages
- nav.html — (fragment) navigation markup (kept for reference)
- footer.html — (fragment) footer markup (kept for reference)
- cj.css — Main stylesheet (modernized and responsible)
- Images: various GIF/JPG/PNG files in the project root (referenced from pages)

Recent changes and goals

Recent work focused on:
- Modernizing markup to HTML5 + UTF-8.
- Improving accessibility basics (skip link, alt attributes, focus outlines).
- Consolidating navigation/footer concepts (no JS-based runtime includes — nav/footer are inlined so the site works without JavaScript).
- Making responsiveness robust: detect device characteristics (pointer/hover) in CSS rather than relying only on CSS pixel width, and keep a width-based fallback.
- Making the desktop layout full-bleed (100% browser width) while keeping flexible, readable content.

Key CSS features (what's new in cj.css)

The stylesheet has been cleaned and modernized. Key features you should know:

1) CSS variables
- Colours and font families are defined with custom properties at the top of the file for easy changes:
  - --bg, --brand, --accent, --muted, --link, --font-sans

2) Full-width layout on desktop
- The main layout (.layout) now spans the full browser width (width: 100%; max-width: none; margin: 0). This yields a full-bleed desktop layout.

3) Flexbox three-column layout for desktop
- On sufficiently wide viewports the layout is a three-column flexbox:
  - nav { flex: 0 0 220px }
  - main { flex: 1 1 60% }
  - aside { flex: 0 0 220px }
- Items are aligned to the top with align-items: flex-start.

4) Device-driven responsive behavior (no JavaScript)
- The site uses feature queries that detect interaction type instead of only width:
  - @media (pointer: coarse), (hover: none) { ... }
    - Targets touch-first devices (phones and many tablets).
    - On these devices the layout collapses to a single column and the visual aside is ordered between nav and content.
- Fallback width-based rule:
  - @media (max-width: 800px) { ... }
    - Ensures the same stacked behavior for narrow desktop viewports and for older browsers that do not support pointer/hover queries.

5) Image behavior
- aside images (and other images) use max-width: 100% and height: auto by default.
- On stacked layouts (touch or narrow view) aside images expand to 100% of the page width so they appear large and useful for mobile readers.
- There is a placeholder media query for high-resolution devices (@media (min-resolution: 2dppx)) so you can add high‑DPI image handling or swap assets via srcset later.

6) Accessibility improvements in CSS
- Skip link (.skip-link) visible on keyboard focus.
- Focus outlines for a:focus, button:focus, input:focus etc. to improve keyboard navigation.

No-JavaScript policy

- The site is intentionally JS-free. All behavior, layout, and includes are static HTML + CSS.
- Navigation and footer are inlined into each HTML file to avoid runtime includes that require JavaScript. If you later prefer single-source maintenance, use either server-side includes (SSI) or a small deploy-time expansion script — both options are documented in earlier notes but were not implemented to keep the site JS-free.

How to preview locally (mobile on same Wi‑Fi)

1) Start a simple HTTP server from the project root so your phone can reach the site:
   - python3 -m http.server 8000 --bind 0.0.0.0
   (or simply python3 -m http.server 8000 if your Python binds all interfaces by default)

2) Find your development machine IP and open the site on your phone (connected to same network):
   - hostname -I | awk '{print $1}'  # or ip addr show …
   - Open http://<DEV_IP>:8000/ in your phone browser
   - Or open a specific page, e.g. http://<DEV_IP>:8000/step3.html

Validation & troubleshooting commands

- Quick HTML parse check (xmllint):
  xmllint --noout --html <file.html>

- Check all pages from the project root (UNIX shell):
  for f in *.html; do xmllint --noout --html "$f" 2>&1 || true; done

- Run a local Python HTTP server for testing:
  python3 -m http.server 8000 --bind 0.0.0.0

Recommendations / next steps

- Accessibility audit: run Lighthouse/axe and fix any high-priority issues (contrast, headings, skipped link effectiveness, table semantics).
- Image optimization: create WebP/AVIF and add srcset + sizes for the large poster images in the aside so high-DPI devices get sharp images while mobile gets smaller files.
- Consider a tiny deploy-time include script (bash/perl) if you want single-source nav/footer while still publishing static, JS-free files. This is a minimal build step (not a full SSG) and is reversible.
- Add a basic CI step to run xmllint or an HTML linter so accidental markup regressions are caught during updates.

Contact / Notes

If you want me to:
- Add responsive srcset entries for the aside images,
- Create a tiny deploy-time include script and run it to produce final HTML,
- Or produce a small Accessibility report (auto-run): tell me which and I’ll proceed.

-- End of README
