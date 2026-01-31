<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { scrollProgress } from '../stores/scrollProgress';

  export let sectionSelector: string = '[data-section-id]';
  export let enabled: boolean = true;

  let sections: HTMLElement[] = [];
  let isBrowser = false;

  function getSections(): HTMLElement[] {
    if (!isBrowser) return [];
    return Array.from(document.querySelectorAll(sectionSelector));
  }

  function getCurrentSectionIndex(): number {
    const currentId = scrollProgress.getCurrentSection();
    if (!currentId) return 0;
    return sections.findIndex(s => s.dataset.sectionId === currentId);
  }

  function scrollToSection(index: number) {
    if (!isBrowser || !sections[index]) return;

    const section = sections[index];
    const headerOffset = 80; // Account for sticky header
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Focus the section for accessibility
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!enabled || !isBrowser) return;

    // Only handle keys when not in an interactive element
    const target = event.target as HTMLElement;
    const isInteractive = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName);
    if (isInteractive) return;

    sections = getSections();
    const currentIndex = getCurrentSectionIndex();

    switch (event.key) {
      case 'ArrowDown':
      case 'j': // Vim-style
        event.preventDefault();
        if (currentIndex < sections.length - 1) {
          scrollToSection(currentIndex + 1);
        }
        break;

      case 'ArrowUp':
      case 'k': // Vim-style
        event.preventDefault();
        if (currentIndex > 0) {
          scrollToSection(currentIndex - 1);
        }
        break;

      case 'Home':
        event.preventDefault();
        scrollToSection(0);
        break;

      case 'End':
        event.preventDefault();
        scrollToSection(sections.length - 1);
        break;

      case 'PageDown':
        event.preventDefault();
        const nextPage = Math.min(currentIndex + 3, sections.length - 1);
        scrollToSection(nextPage);
        break;

      case 'PageUp':
        event.preventDefault();
        const prevPage = Math.max(currentIndex - 3, 0);
        scrollToSection(prevPage);
        break;
    }
  }

  onMount(() => {
    isBrowser = true;
    sections = getSections();
    window.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    if (isBrowser) {
      window.removeEventListener('keydown', handleKeyDown);
    }
  });
</script>

<slot />
