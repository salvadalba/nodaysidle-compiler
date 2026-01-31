module.exports = {
  ci: {
    collect: {
      // Use static server for built files
      staticDistDir: './dist',
      // URLs to test
      url: [
        'http://localhost/index.html',
        'http://localhost/projects/synapse-notes/index.html',
        'http://localhost/404.html',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Performance budgets
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.9 }],

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],

        // Accessibility specific
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-description': 'error',
        'meta-viewport': 'error',
        'bypass': 'warn',
        'link-name': 'warn',
        'button-name': 'warn',
      },
    },
    upload: {
      // Use temporary public storage for CI (no server required)
      target: 'temporary-public-storage',
    },
  },
};
