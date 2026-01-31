# Tasks Plan — THE_ARCHITECT_LOG

## 📌 Global Assumptions
- Developer has Node.js 18+ and npm installed
- Developer has basic familiarity with Astro and Svelte
- Content for portfolio projects (Synapse Notes, MemoryKeeper) exists and can be adapted
- Svelte is the chosen island framework for smaller bundle size
- Mobile layout will be stacked single-column (simplified narrative)
- Typing animation syncs to scroll position (not section enter)
- Initial launch includes 2 portfolio projects
- No analytics at launch (privacy consideration)

## ⚠️ Risks
- [object Object]
- [object Object]
- [object Object]
- [object Object]

## 🧩 Epics
## Project Foundation
**Goal:** Establish the Astro 5 project with essential configuration, tooling, and base structure

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Initialize Astro 5 project (S)

Create new Astro 5 project using the official CLI with TypeScript, Tailwind CSS 4, and the preferred island framework (Svelte recommended for smaller bundle size)

**Acceptance Criteria**
- Astro 5 project created with `npm create astro@latest`
- TypeScript configured with strict mode
- Tailwind CSS 4 integrated via @astrojs/tailwind
- Svelte integration added via @astrojs/svelte
- Project builds successfully with `npm run build`

**Dependencies**
_None_

### ✅ Configure Tailwind CSS 4 design tokens (S)

Set up Tailwind configuration with custom color palette, typography scale, and spacing system for the terminal/code aesthetic

**Acceptance Criteria**
- Custom color palette defined (dark theme with terminal green, amber accents)
- Monospace and sans-serif font families configured
- Custom spacing scale for split-screen layouts
- CSS variables exported for use in animations

**Dependencies**
- Initialize Astro 5 project

### ✅ Set up Content Collections with Zod schemas (S)

Define Content Collection schemas for portfolio projects with Zod validation for type-safe content

**Acceptance Criteria**
- Content Collection defined in src/content/config.ts
- Zod schema validates: title, description, slug, sections array, visual assets
- Schema enforces required fields and correct types
- Build fails with descriptive error on invalid content

**Dependencies**
- Initialize Astro 5 project

### ✅ Create base layout component (S)

Build the main Layout.astro component with HTML document structure, meta defaults, and global styles

**Acceptance Criteria**
- Layout includes proper HTML5 document structure
- Global CSS reset and base styles applied
- Slot for page content
- Dark theme applied by default

**Dependencies**
- Configure Tailwind CSS 4 design tokens

### ✅ Implement SEO meta component (S)

Create reusable SEOMeta.astro component for Open Graph, Twitter cards, and standard meta tags

**Acceptance Criteria**
- Component accepts title, description, image, url props
- Generates valid Open Graph tags
- Generates Twitter card meta tags
- Includes canonical URL
- Default fallbacks for missing props

**Dependencies**
- Create base layout component

## Split-Screen Layout System
**Goal:** Build the core split-screen layout with left content panel and right visual panel

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Create SplitScreenLayout component (M)

Build the main split-screen container using CSS Grid with fixed positioning for the right panel

**Acceptance Criteria**
- Two-column layout: left scrollable, right fixed
- Left panel takes 50% width on desktop
- Right panel takes 50% width, position: sticky
- Clean separation with no layout shift during scroll
- Proper z-index stacking

**Dependencies**
- Create base layout component

### ✅ Implement mobile responsive layout (S)

Create stacked single-column layout for mobile viewports with the visual panel becoming a sticky header or inline element

**Acceptance Criteria**
- Breakpoint at 768px switches to single column
- Content flows naturally in reading order
- Visual elements appear inline within narrative
- No horizontal scroll on any viewport size

**Dependencies**
- Create SplitScreenLayout component

### ✅ Build left panel narrative container (S)

Create the scrollable left panel component that renders MDX content with section markers

**Acceptance Criteria**
- Renders MDX content with proper typography
- Section markers use data attributes for scroll tracking
- Smooth scroll behavior enabled
- Proper padding and max-width for readability

**Dependencies**
- Create SplitScreenLayout component

### ✅ Build right panel visual container (S)

Create the fixed right panel component that displays generated UI visuals with terminal aesthetic

**Acceptance Criteria**
- Terminal-style container with border and header
- Dark background with monospace font styling
- Slot for dynamic visual content
- Centered content with proper padding

**Dependencies**
- Create SplitScreenLayout component

## Scroll Synchronization
**Goal:** Implement scroll-triggered visual updates connecting left panel scroll to right panel state

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Create ScrollSyncController Svelte island (M)

Build a Svelte component that tracks scroll position and emits progress events using Intersection Observer

**Acceptance Criteria**
- Uses Intersection Observer API for section detection
- Calculates normalized progress (0-1) for current section
- Exposes current section ID and progress via store
- Respects prefers-reduced-motion media query
- Hydrates only when in viewport (client:visible)

**Dependencies**
- Build left panel narrative container

### ✅ Define section-to-visual mapping schema (S)

Extend Content Collection schema to map narrative sections to visual states with timing metadata

**Acceptance Criteria**
- Each section has unique ID
- Section maps to visual component or state
- Optional animation delay and duration per section
- Schema validates mapping completeness

**Dependencies**
- Set up Content Collections with Zod schemas

### ✅ Implement scroll progress store (S)

Create a Svelte store that holds current scroll state and broadcasts to visual components

**Acceptance Criteria**
- Store holds: currentSection, progress, previousSection
- Derived store for animation triggers
- Reset capability for navigation events
- TypeScript types for store values

**Dependencies**
- Create ScrollSyncController Svelte island

### ✅ Connect scroll events to visual panel (M)

Wire up the ScrollSyncController output to trigger state changes in the VisualGeneratorPanel

**Acceptance Criteria**
- Visual panel subscribes to scroll store
- Section changes trigger visual transitions
- Progress value controls typing animation percentage
- Smooth interpolation between states

**Dependencies**
- Implement scroll progress store
- Build right panel visual container

## Typing Animation System
**Goal:** Create the terminal-style typing effect that generates UI visuals character by character

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Build TypingAnimation Svelte component (M)

Create core typing animation component that reveals text character by character based on progress prop

**Acceptance Criteria**
- Accepts text content and progress (0-1) props
- Reveals characters proportionally to progress
- Blinking cursor at current position
- Supports multiline text with preserved formatting
- Respects prefers-reduced-motion (instant reveal)

**Dependencies**
- Initialize Astro 5 project

### ✅ Implement code syntax highlighting for typing (M)

Add syntax highlighting to typed code blocks using a lightweight highlighter compatible with character-by-character reveal

**Acceptance Criteria**
- Syntax highlighting applied to revealed characters only
- Supports JSX, CSS, TypeScript languages
- Colors match terminal theme
- No flash of unstyled content

**Dependencies**
- Build TypingAnimation Svelte component

### ✅ Create visual element reveal animations (S)

Build CSS animations for UI elements that appear as code finishes typing (fade in, slide, scale)

**Acceptance Criteria**
- CSS-only animations (no JS runtime)
- Triggered by class toggle
- Multiple animation presets: fade, slide-up, scale
- Respects prefers-reduced-motion
- Smooth 60fps performance

**Dependencies**
- Configure Tailwind CSS 4 design tokens

### ✅ Build VisualGeneratorPanel component (L)

Create the composite visual panel that orchestrates typing animations and element reveals based on scroll progress

**Acceptance Criteria**
- Receives scroll progress from store
- Sequences typing animations for current section
- Triggers element reveals at appropriate progress points
- Handles section transitions gracefully
- Falls back to static display if JS fails

**Dependencies**
- Build TypingAnimation Svelte component
- Create visual element reveal animations
- Connect scroll events to visual panel

## Content & Project Pages
**Goal:** Create the content structure and project narrative pages using MDX

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Create sample project MDX template (S)

Build a template MDX file structure for portfolio projects with sections, code blocks, and visual mappings

**Acceptance Criteria**
- Template includes frontmatter with required fields
- Section structure with headings and narrative text
- Code blocks with visual mapping metadata
- Documentation comments explaining each section

**Dependencies**
- Define section-to-visual mapping schema

### ✅ Write Synapse Notes project content (M)

Create the MDX content file for the Synapse Notes portfolio project with narrative and code sections

**Acceptance Criteria**
- Complete narrative arc from concept to implementation
- 5-7 sections with scroll-triggered visuals
- Authentic code snippets from the project
- Visual state definitions for each section

**Dependencies**
- Create sample project MDX template

### ✅ Write MemoryKeeper project content (M)

Create the MDX content file for the MemoryKeeper portfolio project with narrative and code sections

**Acceptance Criteria**
- Complete narrative arc from concept to implementation
- 5-7 sections with scroll-triggered visuals
- Authentic code snippets from the project
- Visual state definitions for each section

**Dependencies**
- Create sample project MDX template

### ✅ Build dynamic project page route (M)

Create the [slug].astro dynamic route that renders project pages from Content Collections

**Acceptance Criteria**
- Generates static pages for all projects at build time
- Fetches content from Content Collection
- Renders within SplitScreenLayout
- Passes section data to visual components
- SEO meta populated from frontmatter

**Dependencies**
- Create SplitScreenLayout component
- Implement SEO meta component
- Set up Content Collections with Zod schemas

### ✅ Create ProjectNarrativeRenderer component (M)

Build the component that renders MDX content with custom components for code blocks and section markers

**Acceptance Criteria**
- Custom MDX components for headings, code, sections
- Data attributes added for scroll tracking
- Proper typography and spacing
- Accessible heading hierarchy

**Dependencies**
- Build dynamic project page route

## Navigation & View Transitions
**Goal:** Implement site navigation with Astro View Transitions for smooth page changes

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Create navigation component (M)

Build the site header navigation with project links and smooth transitions

**Acceptance Criteria**
- Sticky header with site title and project links
- Active state for current project
- Mobile hamburger menu
- Accessible keyboard navigation
- Skip-to-content link

**Dependencies**
- Create base layout component

### ✅ Implement View Transitions (M)

Add Astro View Transitions API for smooth animated navigation between project pages

**Acceptance Criteria**
- ViewTransitions component added to layout
- Crossfade transition between pages
- Visual panel maintains position during transition
- Respects prefers-reduced-motion
- Fallback to standard navigation if unsupported

**Dependencies**
- Create navigation component
- Build dynamic project page route

### ✅ Create index/landing page (M)

Build the landing page with project list and introduction to the portfolio experience

**Acceptance Criteria**
- Hero section with portfolio concept explanation
- Grid or list of project cards
- Smooth scroll hint to first project
- SEO optimized with unique meta

**Dependencies**
- Create navigation component
- Implement SEO meta component

### ✅ Create 404 error page (S)

Build a custom 404 page that matches the terminal aesthetic

**Acceptance Criteria**
- Terminal-style error message
- Navigation back to home
- Maintains site layout consistency
- Proper 404 status code

**Dependencies**
- Create base layout component

## Accessibility & Reduced Motion
**Goal:** Ensure full accessibility compliance and graceful degradation for motion preferences

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Implement reduced motion mode (M)

Create alternative experience for users with prefers-reduced-motion enabled

**Acceptance Criteria**
- Typing animations show instant text
- Reveal animations are instant or subtle fades
- Scroll sync still functions for content
- No flickering or jarring state changes
- Tested with system preference toggle

**Dependencies**
- Build TypingAnimation Svelte component
- Create visual element reveal animations

### ✅ Add keyboard navigation support (S)

Ensure all interactive elements are keyboard accessible with visible focus states

**Acceptance Criteria**
- Tab order follows logical reading order
- Custom focus styles visible in both themes
- Escape key closes mobile menu
- Arrow keys navigate between projects
- Focus trapped in mobile menu when open

**Dependencies**
- Create navigation component

### ✅ Add ARIA labels and roles (S)

Implement proper ARIA attributes for dynamic content and live regions

**Acceptance Criteria**
- Live region announces section changes
- Navigation has proper landmark roles
- Images have alt text
- Decorative elements hidden from AT
- Code blocks have proper labeling

**Dependencies**
- Build VisualGeneratorPanel component

### ✅ Run accessibility audit and fixes (M)

Perform comprehensive accessibility audit using axe-core and fix all violations

**Acceptance Criteria**
- Zero axe-core violations
- Color contrast ratios meet WCAG AA
- Screen reader testing completed
- Lighthouse Accessibility score = 100

**Dependencies**
- Implement reduced motion mode
- Add keyboard navigation support
- Add ARIA labels and roles

## Testing & Quality
**Goal:** Implement testing strategy to ensure reliability and performance

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Set up Vitest for unit testing (S)

Configure Vitest with Astro and Svelte component testing support

**Acceptance Criteria**
- Vitest installed and configured
- Svelte component testing working
- Test scripts added to package.json
- Sample test passing

**Dependencies**
- Initialize Astro 5 project

### ✅ Write Content Collection schema tests (S)

Create unit tests for Zod schema validation of Content Collections

**Acceptance Criteria**
- Tests for valid content pass
- Tests for missing required fields fail appropriately
- Tests for invalid types fail appropriately
- Tests for section mapping validation

**Dependencies**
- Set up Vitest for unit testing
- Set up Content Collections with Zod schemas

### ✅ Write TypingAnimation component tests (S)

Create unit tests for the typing animation component behavior

**Acceptance Criteria**
- Progress 0 shows no characters
- Progress 1 shows all characters
- Progress 0.5 shows half characters
- Reduced motion shows all instantly
- Cursor position is correct

**Dependencies**
- Set up Vitest for unit testing
- Build TypingAnimation Svelte component

### ✅ Write ScrollSyncController tests (S)

Create unit tests for scroll progress calculation logic

**Acceptance Criteria**
- Correct progress for section boundaries
- Correct section detection from scroll position
- Edge cases handled (top, bottom, rapid scroll)

**Dependencies**
- Set up Vitest for unit testing
- Create ScrollSyncController Svelte island

### ✅ Set up Playwright for E2E testing (S)

Configure Playwright for end-to-end testing of the full user flow

**Acceptance Criteria**
- Playwright installed and configured
- Test scripts added to package.json
- Base configuration for headless testing
- Sample navigation test passing

**Dependencies**
- Initialize Astro 5 project

### ✅ Write E2E scroll-to-visual tests (M)

Create end-to-end tests verifying scroll triggers visual changes

**Acceptance Criteria**
- Scrolling through sections triggers visual updates
- All sections in a project are testable
- Visual state matches expected at each section
- Tests pass in CI environment

**Dependencies**
- Set up Playwright for E2E testing
- Build VisualGeneratorPanel component

### ✅ Set up Lighthouse CI (S)

Configure Lighthouse CI to run performance audits in the build pipeline

**Acceptance Criteria**
- Lighthouse CI configured with budget assertions
- Performance >= 95 assertion
- Accessibility = 100 assertion
- Best Practices >= 95 assertion
- SEO >= 95 assertion

**Dependencies**
- Initialize Astro 5 project

## Build & Deployment
**Goal:** Configure production build and deploy to static hosting

### User Stories
_None_

### Acceptance Criteria
_None_

### ✅ Configure production build optimization (S)

Set up Astro build configuration for optimal static output

**Acceptance Criteria**
- HTML minification enabled
- CSS purging configured
- Image optimization configured
- Build output in dist/ directory
- Build completes without errors

**Dependencies**
- Initialize Astro 5 project

### ✅ Set up deployment to Vercel/Netlify (S)

Configure deployment pipeline to chosen static hosting platform

**Acceptance Criteria**
- Repository connected to hosting platform
- Build command configured correctly
- Deploy previews for pull requests
- Production deployment on main branch
- Custom domain configured (if applicable)

**Dependencies**
- Configure production build optimization

### ✅ Configure CI/CD pipeline (M)

Set up GitHub Actions for automated testing and deployment

**Acceptance Criteria**
- Runs on pull request and push to main
- Executes unit tests
- Executes E2E tests
- Runs Lighthouse CI
- Blocks merge on test failure

**Dependencies**
- Set up Vitest for unit testing
- Set up Playwright for E2E testing
- Set up Lighthouse CI

### ✅ Generate Open Graph images (S)

Create or configure automatic OG image generation for social sharing

**Acceptance Criteria**
- Default OG image for site
- Project-specific OG images
- Correct dimensions (1200x630)
- Text readable when scaled down
- Images optimized for web

**Dependencies**
- Write Synapse Notes project content
- Write MemoryKeeper project content

## ❓ Open Questions
- Should the visual panel show a miniature app preview or code being written?
- What should happen when user scrolls backwards - reverse animation or instant state?
- Should there be a progress indicator showing position in the narrative?
- Is there a need for a project index/gallery view or direct navigation only?
- Should the terminal visual have interactive elements or be purely display?