<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { scrollProgress, shouldAnimate, typingProgress } from '../stores/scrollProgress';
  import TypingAnimation from './TypingAnimation.svelte';
  import CodeTypingAnimation from './CodeTypingAnimation.svelte';
  import { highlightCode, linesToColoredChars, type ColoredChar } from '../lib/highlighter';
  import type { Section, VisualState } from '../content/config';

  export let sections: Section[] = [];
  export let className: string = '';

  let mounted = false;
  let currentSectionData: Section | null = null;
  let highlightedChars: ColoredChar[] = [];
  let visualHighlightedChars: ColoredChar[] = [];

  // Find section data based on current section ID
  $: {
    if ($scrollProgress.currentSection) {
      currentSectionData = sections.find(s => s.id === $scrollProgress.currentSection) || null;
    }
  }

  // Get visual content for current section
  $: currentVisual = currentSectionData?.visual || null;
  $: currentCode = currentSectionData?.codeBlock || null;

  // Highlight code when section changes
  $: if (currentCode) {
    highlightCode(currentCode.code.trim(), currentCode.language).then(lines => {
      highlightedChars = linesToColoredChars(lines);
    });
  } else {
    highlightedChars = [];
  }

  // Highlight visual code content
  $: if (currentVisual?.type === 'code') {
    highlightCode(currentVisual.content, 'typescript').then(lines => {
      visualHighlightedChars = linesToColoredChars(lines);
    });
  } else {
    visualHighlightedChars = [];
  }

  // Animation state
  $: showContent = mounted && currentSectionData !== null;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="visual-generator {className}">
  {#if showContent && currentSectionData}
    <div
      class="visual-generator__content"
      class:animate={$shouldAnimate}
      in:fade={{ duration: $shouldAnimate ? 300 : 0 }}
    >
      <!-- Section indicator -->
      <div class="visual-generator__header">
        <span class="visual-generator__section-label">
          Section {(sections.findIndex(s => s.id === currentSectionData?.id) ?? 0) + 1} of {sections.length}
        </span>
        <span class="visual-generator__section-title">{currentSectionData.title}</span>
      </div>

      <!-- Code display with typing animation -->
      {#if currentCode}
        <div class="visual-generator__code-container">
          {#if currentCode.filename}
            <div class="visual-generator__code-header">
              <span class="visual-generator__filename">{currentCode.filename}</span>
              <span class="visual-generator__language">{currentCode.language}</span>
            </div>
          {/if}
          <div class="visual-generator__code">
            <CodeTypingAnimation
              code={currentCode.code.trim()}
              language={currentCode.language}
              progress={$typingProgress}
              showCursor={true}
              highlightedChars={highlightedChars}
            />
          </div>
        </div>
      {/if}

      <!-- Visual state display -->
      {#if currentVisual}
        <div class="visual-generator__visual">
          {#if currentVisual.type === 'code'}
            <div class="visual-generator__visual-code">
              <CodeTypingAnimation
                code={currentVisual.content}
                language="typescript"
                progress={$typingProgress}
                highlightedChars={visualHighlightedChars}
              />
            </div>
          {:else if currentVisual.type === 'terminal'}
            <div class="visual-generator__terminal">
              <span class="visual-generator__prompt">$</span>
              <TypingAnimation
                text={currentVisual.content}
                progress={$typingProgress}
              />
            </div>
          {:else if currentVisual.type === 'ui' || currentVisual.type === 'diagram'}
            <div
              class="visual-generator__preview"
              class:reveal={$typingProgress > 0.5}
            >
              <div class="visual-generator__preview-label">{currentVisual.content}</div>
              <div class="visual-generator__preview-placeholder">
                <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                  <rect x="0" y="0" width="120" height="80" rx="4" stroke="currentColor" stroke-opacity="0.3"/>
                  <rect x="8" y="8" width="40" height="6" rx="2" fill="currentColor" fill-opacity="0.3"/>
                  <rect x="8" y="20" width="104" height="4" rx="1" fill="currentColor" fill-opacity="0.15"/>
                  <rect x="8" y="28" width="80" height="4" rx="1" fill="currentColor" fill-opacity="0.15"/>
                  <rect x="8" y="40" width="50" height="32" rx="2" stroke="currentColor" stroke-opacity="0.2"/>
                  <rect x="64" y="40" width="48" height="14" rx="2" fill="currentColor" fill-opacity="0.2"/>
                  <rect x="64" y="58" width="48" height="14" rx="2" stroke="currentColor" stroke-opacity="0.2"/>
                </svg>
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Progress indicator -->
      <div class="visual-generator__progress">
        <div
          class="visual-generator__progress-bar"
          style="width: {$scrollProgress.progress * 100}%"
        />
      </div>
    </div>
  {:else}
    <div class="visual-generator__empty">
      <div class="visual-generator__empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="4 17 10 11 4 5"/>
          <line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
      </div>
      <p class="visual-generator__empty-text">
        <span class="visual-generator__prompt">$</span>
        awaiting input...
      </p>
    </div>
  {/if}
</div>

<style>
  .visual-generator {
    height: 100%;
    display: flex;
    flex-direction: column;
    color: var(--color-text-code);
  }

  .visual-generator__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow: auto;
  }

  .visual-generator__header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border-secondary);
  }

  .visual-generator__section-label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .visual-generator__section-title {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-terminal-green);
  }

  /* Code Container */
  .visual-generator__code-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-terminal);
    overflow: hidden;
  }

  .visual-generator__code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: var(--color-bg-panel);
    border-bottom: 1px solid var(--color-border-secondary);
  }

  .visual-generator__filename {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .visual-generator__language {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-terminal-green-dim);
    text-transform: uppercase;
  }

  .visual-generator__code {
    flex: 1;
    margin: 0;
    padding: 1rem;
    overflow: auto;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: var(--leading-code);
  }

  /* Visual State */
  .visual-generator__visual {
    padding: 1rem;
    background-color: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-terminal);
  }

  .visual-generator__visual-code {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-syntax-function);
  }

  .visual-generator__terminal {
    display: flex;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  .visual-generator__prompt {
    color: var(--color-terminal-green);
  }

  .visual-generator__preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    opacity: 0;
    transform: scale(0.95);
    transition: opacity var(--duration-normal) var(--ease-out),
                transform var(--duration-normal) var(--ease-out);
  }

  .visual-generator__preview.reveal {
    opacity: 1;
    transform: scale(1);
  }

  .visual-generator__preview-label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .visual-generator__preview-placeholder {
    color: var(--color-text-muted);
  }

  /* Progress Bar */
  .visual-generator__progress {
    height: 2px;
    background-color: var(--color-border-secondary);
    border-radius: 1px;
    overflow: hidden;
  }

  .visual-generator__progress-bar {
    height: 100%;
    background-color: var(--color-terminal-green);
    transition: width 0.1s linear;
  }

  /* Empty State */
  .visual-generator__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--color-text-muted);
  }

  .visual-generator__empty-icon {
    opacity: 0.5;
  }

  .visual-generator__empty-text {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .visual-generator__preview {
      opacity: 1;
      transform: none;
      transition: none;
    }

    .visual-generator__progress-bar {
      transition: none;
    }
  }
</style>
