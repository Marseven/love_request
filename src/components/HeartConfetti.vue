<script setup>
/**
 * HeartConfetti — Explosion de confettis
 * Accepte des couleurs dynamiques via props pour s'adapter au thème
 */
import { onMounted } from 'vue'
import confetti from 'canvas-confetti'

const props = defineProps({
  colors: {
    type: Array,
    default: () => ['#f43f5e', '#fb7185', '#fda4af', '#be123c', '#fecdd3', '#d4a574'],
  },
})

function launchConfetti() {
  const duration = 6000
  const end = Date.now() + duration
  const colors = props.colors

  function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.6 },
      colors,
      shapes: ['circle'],
      scalar: 1.2,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.6 },
      colors,
      shapes: ['circle'],
      scalar: 1.2,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  confetti({
    particleCount: 80,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors,
    scalar: 1.5,
    shapes: ['circle', 'square'],
    ticks: 300,
  })

  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 120,
      origin: { x: 0.5, y: 0.3 },
      colors,
      scalar: 1.8,
      shapes: ['circle'],
      ticks: 250,
    })
  }, 400)

  frame()
}

onMounted(() => {
  launchConfetti()
  setTimeout(launchConfetti, 2000)
})
</script>

<template>
  <div class="heart-confetti" aria-hidden="true"></div>
</template>

<style scoped>
.heart-confetti {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}
</style>
