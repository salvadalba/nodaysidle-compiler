# THE_ARCHITECT_LOG

## 🎯 Product Vision
A portfolio experience that demonstrates the craft of building software by showing code transforming into visual products in real-time, positioning the creator as someone who turns raw syntax into polished applications.

## ❓ Problem Statement
Traditional developer portfolios fail to convey the visceral experience of building software. Static screenshots and bullet points don't communicate the creative process of transforming code into working products. Visitors cannot feel the craftsmanship involved in software development.

## 🎯 Goals
- Create a split-screen narrative where scrolling through code on the left generates corresponding UI on the right
- Implement terminal-style typing effects that simulate real-time code compilation into visuals
- Showcase portfolio projects (Synapse Notes, MemoryKeeper, etc.) through interactive code-to-product demonstrations
- Achieve perfect Lighthouse scores while maintaining rich interactivity
- Deliver a memorable, differentiated portfolio experience that communicates builder identity

## 🚫 Non-Goals
- Building a CMS or admin interface for content management
- Supporting real-time collaboration or multi-user features
- Creating a template or framework for others to use
- Implementing actual code compilation or execution
- Building mobile-first responsive design (desktop-focused split-screen experience)

## 👥 Target Users
- Potential employers or clients viewing the portfolio
- Technical recruiters evaluating developer capabilities
- Fellow developers interested in creative portfolio approaches
- Design-minded technologists who appreciate craft

## 🧩 Core Features
- Split-screen layout with synchronized scroll between code narrative (left) and generated UI (right)
- Terminal-style typing animation effect for code display using Astro islands
- Progressive UI generation on the right panel triggered by scroll position
- Project showcase sections for Synapse Notes, MemoryKeeper, and other portfolio pieces
- Smooth View Transitions between project sections
- MDX-powered content with custom components for code blocks and UI mockups
- Static site generation with selective hydration for interactive elements

## ⚙️ Non-Functional Requirements
- Perfect or near-perfect Lighthouse scores (100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO)
- Zero JavaScript by default with islands architecture for interactive components
- Sub-second initial page load on standard connections
- Accessible keyboard navigation and screen reader support
- SEO-optimized with Open Graph meta tags for social sharing
- Deploy-ready for Netlify, Vercel, or Cloudflare Pages

## 📊 Success Metrics
- Lighthouse Performance score >= 95
- Time to First Contentful Paint < 1.5 seconds
- Average session duration > 2 minutes (indicating engagement with scroll narrative)
- Scroll depth > 75% for majority of visitors
- Portfolio inquiry or contact rate improvement over previous portfolio

## 📌 Assumptions
- Users will view the site primarily on desktop devices with sufficient screen width for split-screen
- The typing animation effect will not cause accessibility issues for users with motion sensitivity (reduced motion support required)
- Astro Content Collections can handle the structured data needs for project showcases
- The visual generation effect can be achieved with CSS animations and pre-rendered content rather than actual compilation

## ❓ Open Questions
- What is the graceful degradation strategy for mobile or narrow viewports?
- Should the typing speed be user-controllable or fixed?
- How many portfolio projects will be featured in the initial launch?
- What visual style should the generated UI mockups follow?
- Should there be a way to skip animations for returning visitors?