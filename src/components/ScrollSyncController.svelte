<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { scrollProgress, type SectionInfo } from '../stores/scrollProgress';

  export let containerSelector: string = '.narrative-panel__content';
  export let sectionSelector: string = '[data-section-id]';
  export let threshold: number = 0.1;

  let container: HTMLElement | null = null;
  let sections: SectionInfo[] = [];
  let observer: IntersectionObserver | null = null;
  let lastScrollY = 0;
  let isBrowser = false;
  let updateTimeout: ReturnType<typeof setTimeout> | null = null;

  function updateSectionInfo() {
    if (!isBrowser || !container) return;

    const sectionElements = container.querySelectorAll(sectionSelector);
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    sections = Array.from(sectionElements).map((el, index) => {
      const element = el as HTMLElement;
      const rect = element.getBoundingClientRect();

      return {
        id: element.dataset.sectionId || `section-${index}`,
        index,
        element,
        top: rect.top + scrollTop,
        height: rect.height,
      };
    });

    // Sort sections by their vertical position to ensure correct order
    sections.sort((a, b) => a.top - b.top);
  }

  function calculateProgress() {
    if (!isBrowser || !container || sections.length === 0) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    // Use a point 30% from the top of the viewport for better section detection
    const viewportTrigger = scrollTop + windowHeight * 0.3;

    const direction = scrollTop > lastScrollY ? 'down' : scrollTop < lastScrollY ? 'up' : null;
    lastScrollY = scrollTop;

    let currentSection: SectionInfo | null = null;
    let sectionProgress = 0;

    // Find the section that contains the trigger point
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.top;
      const sectionBottom = sectionTop + section.height;

      if (viewportTrigger >= sectionTop && viewportTrigger < sectionBottom) {
        currentSection = section;
        sectionProgress = (viewportTrigger - sectionTop) / section.height;
        break;
      }
    }

    // Handle edge cases: before first section or after last section
    if (!currentSection && sections.length > 0) {
      if (viewportTrigger < sections[0].top) {
        currentSection = sections[0];
        sectionProgress = 0;
      } else {
        currentSection = sections[sections.length - 1];
        sectionProgress = 1;
      }
    }

    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const globalProgress = documentHeight > 0 ? scrollTop / documentHeight : 0;

    if (currentSection) {
      scrollProgress.updateFromScroll(
        currentSection.id,
        sectionProgress,
        globalProgress,
        direction
      );
    }
  }

  function handleScroll() {
    if (isBrowser) {
      requestAnimationFrame(calculateProgress);
    }
  }

  function handleResize() {
    updateSectionInfo();
    calculateProgress();
  }

  function scheduleUpdate() {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
      updateSectionInfo();
      calculateProgress();
    }, 100);
  }

  onMount(() => {
    isBrowser = true;
    container = document.querySelector(containerSelector);

    if (!container) {
      console.warn(`ScrollSyncController: Container not found: ${containerSelector}`);
      return;
    }

    // Initial update
    updateSectionInfo();
    calculateProgress();

    // Schedule additional updates to catch layout changes after fonts/images load
    setTimeout(() => {
      updateSectionInfo();
      calculateProgress();
    }, 100);

    setTimeout(() => {
      updateSectionInfo();
      calculateProgress();
    }, 500);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Use IntersectionObserver to track when sections become visible
    // and recalculate positions
    observer = new IntersectionObserver(
      (entries) => {
        let needsUpdate = false;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            needsUpdate = true;
          }
        });
        if (needsUpdate) {
          scheduleUpdate();
        }
      },
      {
        threshold: [0, threshold, 0.5, 1],
        rootMargin: '0px 0px 0px 0px',
      }
    );

    // Observe all section elements
    const sectionElements = container.querySelectorAll(sectionSelector);
    sectionElements.forEach((el) => {
      if (observer) {
        observer.observe(el);
      }
    });
  });

  onDestroy(() => {
    if (isBrowser) {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (observer) {
        observer.disconnect();
      }

      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
    }

    scrollProgress.reset();
  });
</script>

<slot />
