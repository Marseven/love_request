<script setup>
/**
 * FloatingHearts — Cœurs SVG flottants en arrière-plan
 * Crée une ambiance romantique subtile avec des cœurs qui dérivent
 */
import { ref, onMounted, onUnmounted } from 'vue'

const hearts = ref([])
let interval = null

const colors = [
  'rgba(244, 63, 94, 0.12)',
  'rgba(251, 113, 133, 0.1)',
  'rgba(253, 164, 175, 0.15)',
  'rgba(190, 18, 60, 0.08)',
  'rgba(212, 165, 116, 0.12)',
]

const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
const maxHearts = isMobile ? 8 : 15
const spawnInterval = isMobile ? 4000 : 2500

function spawnHeart() {
  if (hearts.value.length > maxHearts) {
    hearts.value.shift()
  }
  hearts.value.push({
    id: Date.now() + Math.random(),
    color: colors[Math.floor(Math.random() * colors.length)],
    left: Math.random() * 100,
    size: (isMobile ? 10 : 14) + Math.random() * (isMobile ? 14 : 22),
    duration: 8 + Math.random() * 12,
    swayDuration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
    variant: Math.random() > 0.5 ? 'filled' : 'outline',
  })
}

onMounted(() => {
  const initialCount = isMobile ? 3 : 6
  for (let i = 0; i < initialCount; i++) {
    setTimeout(spawnHeart, i * 400)
  }
  interval = setInterval(spawnHeart, spawnInterval)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="floating-hearts" aria-hidden="true">
    <svg
      v-for="h in hearts"
      :key="h.id"
      class="heart"
      :width="h.size"
      :height="h.size"
      viewBox="0 0 24 24"
      :style="{
        left: h.left + '%',
        animationDuration: h.duration + 's, ' + h.swayDuration + 's',
        animationDelay: h.delay + 's',
      }"
    >
      <!-- Coeur plein -->
      <path
        v-if="h.variant === 'filled'"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        :fill="h.color"
      />
      <!-- Coeur contour -->
      <path
        v-else
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05z"
        :fill="h.color"
      />
    </svg>
  </div>
</template>

<style scoped>
.floating-hearts {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.heart {
  position: absolute;
  top: -30px;
  animation: petal-fall linear infinite, sway ease-in-out infinite;
  will-change: transform;
  filter: blur(0.5px);
}
</style>
