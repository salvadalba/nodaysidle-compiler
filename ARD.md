# Architecture Requirements Document

## 🧱 System Overview
THE_ARCHITECT_LOG is a static portfolio website featuring a split-screen narrative experience where scrolling through code on the left panel triggers synchronized visual generation on the right panel. Built with Astro 5 using islands architecture for zero-JS-by-default with selective hydration for interactive typing animations and scroll-triggered effects.

## 🏗 Architecture Style
Static Site Generation (SSG) with Islands Architecture - Astro 5 generates static HTML at build time with isolated interactive islands (React or Svelte components) hydrated only where needed for typing animations and scroll synchronization.

## 🎨 Frontend Architecture
- **Framework:** Astro 5 with optional React/Svelte islands for interactive components
- **State Management:** Minimal client-side state using Nano Stores for scroll position synchronization between panels; most state derived from scroll position via Intersection Observer
- **Routing:** Astro file-based routing with View Transitions API for smooth section navigation
- **Build Tooling:** Astro built-in Vite bundler with Tailwind CSS 4 integration, automatic image optimization via astro:assets

## 🧠 Backend Architecture
- **Approach:** Static Site Generation (SSG) - all pages pre-rendered at build time with no runtime server
- **API Style:** None - fully static site with no API endpoints required
- **Services:**
_None_

## 🗄 Data Layer
- **Primary Store:** Astro Content Collections with MDX files for project narratives and code examples
- **Relationships:** Flat content structure - each portfolio project is a standalone MDX file with frontmatter metadata defining project details, code snippets, and UI mockup references
- **Migrations:** Not applicable - content versioned in Git alongside source code

## ☁️ Infrastructure
- **Hosting:** Static hosting on Netlify, Vercel, or Cloudflare Pages with global CDN distribution
- **Scaling Strategy:** CDN-based - static assets cached at edge locations worldwide; no origin server scaling required
- **CI/CD:** Git-based deployment - push to main triggers build and deploy on hosting platform; Lighthouse CI in pipeline for performance regression checks

## ⚖️ Key Trade-offs
- Islands architecture adds complexity for scroll synchronization but ensures zero JS for non-interactive content
- Pre-rendered UI mockups instead of actual compilation limits dynamic possibilities but guarantees performance and Lighthouse scores
- Desktop-focused split-screen prioritizes the core experience over mobile responsiveness
- MDX content requires rebuild for updates but eliminates need for CMS infrastructure
- Fixed typing animation speed simplifies implementation; user control deferred to future iteration

## 📐 Non-Functional Requirements
- Lighthouse scores: Performance >= 95, Accessibility = 100, Best Practices = 100, SEO = 100
- First Contentful Paint < 1.5 seconds on standard 4G connection
- Zero JavaScript loaded by default; islands hydrate only on interaction or viewport entry
- Reduced motion media query support for typing animations (prefers-reduced-motion)
- Semantic HTML with ARIA labels for screen reader navigation of split-screen layout
- Open Graph and Twitter Card meta tags for social sharing previews
- Keyboard-accessible navigation through all interactive elements