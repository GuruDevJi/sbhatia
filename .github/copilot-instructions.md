# Copilot Instructions for sb1 Portfolio Site

## Project Overview
This is a personal portfolio website built with **Eleventy (11ty) v3.1.2**, a static site generator. The site showcases professional experience and contact information. Builds output to `_site/` directory; development source is in `src/`.

## Architecture & Key Patterns

### Template System (Nunjucks)
- All pages are `.njk` (Nunjucks) templates in `src/` root or subdirectories
- **Layout inheritance**: Pages use `layout: base.njk` frontmatter to inherit from `src/_includes/base.njk`
- **Global data**: `var.json` in `src/_data/` provides site-wide variables (siteTitle, currentYear, siteName) accessible as `{{ var.* }}` in templates
- **Content rendering**: Use `{{ content | safe }}` in layouts to inject page content

### File Organization
```
src/                          # Source templates (input directory)
├── contact.njk              # Contact form page
├── profile.njk             # Profile page with modular sections: Experience, Education, Licenses, Volunteering, Honors & Awards
├── index.njk                # Homepage
├── speaker-gallery.njk      # Speaker gallery page
├── specializations.njk      # Specializations page
├── _includes/
│   └── base.njk             # Master layout template
├── _data/
│   ├── experience.json      # Array of work experience objects
│   ├── education.json       # Array of education records
│   ├── licenses.json        # Array of certifications and licenses
│   ├── volunteering.json    # Array of volunteer experiences
│   ├── awards.json          # Array of honors and awards
│   ├── journey.json         # Array of journey map data
│   └── var.json             # Site-wide config variables
└── assets/                  # Static files (CSS, JS) - passed through unchanged
    ├── css/main.css         # (currently empty)
    ├── css/main.css.backup  # (backup of previous styles)
    └── js/main.js
```

### Data Flow
- **experience.json**: Array of job records with `id`, `company`, `location`, `title`, `dates`, `duration`, `type`, `description`, `achievements[]` fields
- **education.json**: Array of degree records with `id`, `school`, `degree`, `field`, `dates`, `activities[]` fields
- **licenses.json**: Array of certification records with `id`, `title`, `issuer`, `issuedDate`, `credentialId`, `skills[]` fields
- **volunteering.json**: Array of volunteer roles with `id`, `title`, `organization`, `category`, `startDate`, `endDate`, `duration`, `responsibilities[]` fields
- **awards.json**: Array of honors/awards with `id`, `title`, `issuer`, `issuedDate`, `organization` fields
- All data is passed to templates via Eleventy's global data context, accessible as `experience`, `education`, `licenses`, `volunteering`, `awards`
- Static assets in `src/assets/` are copied to `_site/assets/` via `.eleventy.js` passthrough copy

## Critical Developer Workflows

### Build & Development
```bash
npm run build   # Compile site to _site/ (production build)
npm run serve   # Development server with live reload on changes
```

### Key Configuration (`.eleventy.js`)
- **Pass-through copy**: `src/assets` → `_site/assets` (images, CSS, JS) 
- **Global data**: Loads `src/_data/var.json` and injects as `var` in all templates
- **Input/Output**: `src/` (input) → `_site/` (output)

## Project-Specific Conventions

### Template Frontmatter Requirements
Every `.njk` page must include frontmatter:
```yaml
---
layout: base.njk
title: Page Title
---
```
The `title` is displayed in browser tab and referenced in base layout.

### Contact Form Integration
`contact.njk` uses **Formspree** (https://formspree.io/) for form submission. Action URL: `https://formspree.io/f/mkogaebe`. No backend validation needed—Formspree handles it.

### Styling & Scripts
- Single CSS file: `src/assets/css/main.css` (currently empty, linked in base layout)
- Single JS file: `src/assets/js/main.js` (loaded at end of body in base layout)
- Add styles/scripts here; they're served from `/assets/css/` and `/assets/js/` routes

## Profile Page Architecture

The profile page (`profile.njk`) and the specializations page (`specializations.njk`) both feature a sticky sidebar navigation. The sidebar provides quick links to each major section and highlights the active section as the user scrolls. Main content is organized into modular sections (Journey, Experience, Education, Licenses, Volunteering, Honors & Awards for profile; domain expertise for specializations).

### Sticky Sidebar Implementation
- Add a sidebar navigation `<nav>` element with anchor links to each major section (use section IDs for targets).
- Use CSS `position: sticky` or `position: fixed` to keep the sidebar visible while scrolling.
- Highlight the active section link using JavaScript in `main.js` (detect scroll position and update sidebar link classes).
- Ensure sidebar is accessible and responsive: stack vertically on desktop, collapse or reposition on mobile.
- Sidebar markup and logic should be included in both `profile.njk` and `specializations.njk`.

## Common Tasks

- **Add new page**: Create `.njk` file in `src/` with frontmatter, include content, reference `base.njk` layout
- **Update experience data**: Edit `src/_data/experience.json` (array of employment records)
- **Modify site branding**: Update `src/_data/var.json` (siteTitle, siteName, currentYear)
- **Add page-specific styles**: Edit `src/assets/css/main.css` or add inline `<style>` in page `.njk`
- **Deploy**: Built site in `_site/` is ready for hosting; CNAME file enables GitHub Pages custom domain

## Dependencies & Integrations
- **@11ty/eleventy** (v3.1.2): Static site generator
- **Formspree**: Third-party form submission service (contact form)
- **GitHub Pages**: Hosting platform (CNAME file present for custom domain)

## Git Conventions
- Built output `_site/` is generated and ignored; never edit directly
- `node_modules/` is ignored; run `npm install` after cloning
