<script setup>
/**
 * SvgIcon — Icônes SVG inline pour remplacer tous les emojis
 * Chaque icône est un path SVG dessiné à la main, style Valentine
 */
defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 24 },
  color: { type: String, default: 'currentColor' },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="svg-icon"
    :class="'icon-' + name"
    aria-hidden="true"
  >
    <!-- Coeur plein -->
    <template v-if="name === 'heart'">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        :fill="color"
      />
    </template>

    <!-- Coeur contour -->
    <template v-else-if="name === 'heart-outline'">
      <path
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05z"
        :fill="color"
      />
    </template>

    <!-- Lettre d'amour / enveloppe -->
    <template v-else-if="name === 'love-letter'">
      <path
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        :fill="color"
      />
      <path
        d="M12 13.5l-1.2-1.1C8.4 10.4 7 9.2 7 7.8 7 6.7 7.8 5.8 8.9 5.8c.6 0 1.2.3 1.6.7L12 7.8l1.5-1.3c.4-.4 1-.7 1.6-.7 1.1 0 1.9.9 1.9 2 0 1.4-1.4 2.6-3.8 4.6L12 13.5z"
        fill="none"
      />
    </template>

    <!-- Coeur avec flèche -->
    <template v-else-if="name === 'heart-arrow'">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        :fill="color"
      />
      <line x1="2" y1="2" x2="22" y2="12" stroke="white" stroke-width="1.8" stroke-linecap="round" />
      <polygon points="22,12 18,14 18.5,10" fill="white" />
    </template>

    <!-- Etoiles / Sparkle -->
    <template v-else-if="name === 'sparkle'">
      <path
        d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"
        :fill="color"
      />
    </template>

    <!-- Double sparkle / célébration -->
    <template v-else-if="name === 'celebrate'">
      <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z" :fill="color" />
      <path d="M18 10l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" :fill="color" opacity="0.7" />
      <path d="M6 16l.7 2 2 .7-2 .7L6 21.3l-.7-2-2-.7 2-.7L6 16z" :fill="color" opacity="0.5" />
    </template>

    <!-- Copier / Clipboard -->
    <template v-else-if="name === 'clipboard'">
      <path
        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
        :fill="color"
      />
    </template>

    <!-- Check / Validé -->
    <template v-else-if="name === 'check'">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        :fill="color"
      />
    </template>

    <!-- Calendrier -->
    <template v-else-if="name === 'calendar'">
      <path
        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"
        :fill="color"
      />
    </template>

    <!-- Note / étoile -->
    <template v-else-if="name === 'star'">
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        :fill="color"
      />
    </template>

    <!-- Coeur brisé -->
    <template v-else-if="name === 'heart-broken'">
      <path
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"
        :fill="color"
      />
      <path d="M12 5l-1.5 4 3-1-2 5 1.5-4-3 1 2-5z" fill="white" />
    </template>

    <!-- Succès / joie visage -->
    <template v-else-if="name === 'joy'">
      <circle cx="12" cy="12" r="10" :fill="color" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <path d="M9 9.5c0 .8-.4 1.5-1 1.5s-1-.7-1-1.5.4-1.5 1-1.5 1 .7 1 1.5z" fill="white" />
      <path d="M17 9.5c0 .8-.4 1.5-1 1.5s-1-.7-1-1.5.4-1.5 1-1.5 1 .7 1 1.5z" fill="white" />
      <!-- Petits coeurs sur les joues -->
      <path d="M6.5 12.2l-.2-.2c-.3-.3-.8-.3-.9.1 0 .3.2.6.6.9l.5.4.5-.4c.4-.3.6-.6.6-.9-.1-.4-.6-.4-.9-.1l-.2.2z" fill="white" opacity="0.7" />
      <path d="M17.5 12.2l-.2-.2c-.3-.3-.8-.3-.9.1 0 .3.2.6.6.9l.5.4.5-.4c.4-.3.6-.6.6-.9-.1-.4-.6-.4-.9-.1l-.2.2z" fill="white" opacity="0.7" />
    </template>

    <!-- Flèche retour -->
    <template v-else-if="name === 'arrow-left'">
      <path
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        :fill="color"
      />
    </template>

    <!-- Thumbs down (pour le bouton Non) -->
    <template v-else-if="name === 'thumb-down'">
      <path
        d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
        :fill="color"
      />
    </template>

    <!-- Fleur -->
    <template v-else-if="name === 'flower'">
      <circle cx="12" cy="12" r="3" :fill="color" />
      <ellipse cx="12" cy="6" rx="2.5" ry="3.5" :fill="color" opacity="0.6" />
      <ellipse cx="12" cy="18" rx="2.5" ry="3.5" :fill="color" opacity="0.6" />
      <ellipse cx="6" cy="12" rx="3.5" ry="2.5" :fill="color" opacity="0.6" />
      <ellipse cx="18" cy="12" rx="3.5" ry="2.5" :fill="color" opacity="0.6" />
      <ellipse cx="7.8" cy="7.8" rx="2.5" ry="3.5" transform="rotate(-45 7.8 7.8)" :fill="color" opacity="0.5" />
      <ellipse cx="16.2" cy="16.2" rx="2.5" ry="3.5" transform="rotate(-45 16.2 16.2)" :fill="color" opacity="0.5" />
      <ellipse cx="16.2" cy="7.8" rx="2.5" ry="3.5" transform="rotate(45 16.2 7.8)" :fill="color" opacity="0.5" />
      <ellipse cx="7.8" cy="16.2" rx="2.5" ry="3.5" transform="rotate(45 7.8 16.2)" :fill="color" opacity="0.5" />
    </template>

    <!-- Double coeur -->
    <template v-else-if="name === 'hearts-double'">
      <path
        d="M16.5 3c-1.2 0-2.3.5-3.1 1.3L12 5.7l-1.4-1.4C9.8 3.5 8.7 3 7.5 3 5.6 3 4 4.6 4 6.5c0 2.5 2.3 4.5 5.7 7.6l2.3 2.1 2.3-2.1C17.7 11 20 9 20 6.5 20 4.6 18.4 3 16.5 3z"
        :fill="color"
      />
      <path
        d="M19 13.5c-.7 0-1.4.3-1.9.8l-.8.9-.9-.9c-.4-.5-1.1-.8-1.9-.8-1.1 0-2 1-2 2.2 0 1.5 1.4 2.7 3.4 4.5l1.4 1.3 1.4-1.3c2.1-1.8 3.4-3 3.4-4.5-.1-1.2-1-2.2-2.1-2.2z"
        :fill="color"
        opacity="0.65"
      />
    </template>

    <!-- Envoi / Share -->
    <template v-else-if="name === 'send'">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" :fill="color" />
    </template>
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
