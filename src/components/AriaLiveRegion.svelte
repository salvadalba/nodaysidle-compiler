<script lang="ts">
  import { scrollProgress } from '../stores/scrollProgress';
  import type { Section } from '../content/config';

  export let sections: Section[] = [];

  let announcement = '';
  let prevSectionId: string | null = null;

  // Announce section changes to screen readers
  $: {
    const currentId = $scrollProgress.currentSection;
    if (currentId && currentId !== prevSectionId) {
      const section = sections.find(s => s.id === currentId);
      if (section) {
        const index = sections.findIndex(s => s.id === currentId) + 1;
        announcement = `Section ${index} of ${sections.length}: ${section.title}`;
      }
      prevSectionId = currentId;
    }
  }
</script>

<!-- ARIA Live Region for screen reader announcements -->
<div
  class="sr-only"
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {announcement}
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
