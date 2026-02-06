<script setup>
/**
 * PetalRain — Pluie de pétales de roses
 * Adapté pour mobile : moins de pétales pour la performance
 */
import { ref, onMounted } from 'vue'

const props = defineProps({
  colors: {
    type: Array,
    default: () => ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#e11d48', '#f87171', '#fbbf24'],
  },
})

const petals = ref([])

onMounted(() => {
  const isMobile = window.innerWidth < 640
  const count = isMobile ? 15 : 30
  const petalColors = props.colors

  for (let i = 0; i < count; i++) {
    petals.value.push({
      id: i,
      left: Math.random() * 100,
      size: (isMobile ? 6 : 8) + Math.random() * (isMobile ? 12 : 16),
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 4,
      rotation: Math.random() * 360,
      swayAmount: (isMobile ? 10 : 20) + Math.random() * (isMobile ? 30 : 60),
    })
  }
})
</script>

<template>
  <div class="petal-rain" aria-hidden="true">
    <div
      v-for="p in petals"
      :key="p.id"
      class="petal"
      :style="{
        left: p.left + '%',
        width: p.size + 'px',
        height: p.size * 1.3 + 'px',
        backgroundColor: p.color,
        animationDuration: p.duration + 's',
        animationDelay: p.delay + 's',
        '--rotation': p.rotation + 'deg',
        '--sway': p.swayAmount + 'px',
      }"
    />
  </div>
</template>

<style scoped>
.petal-rain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.petal {
  position: absolute;
  top: -20px;
  border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
  opacity: 0.8;
  animation: petal-cascade linear infinite;
  will-change: transform;
  filter: blur(0.3px);
  box-shadow: inset 1px 1px 3px rgba(255, 255, 255, 0.4);
}

@keyframes petal-cascade {
  0% {
    transform: translateY(-5vh) translateX(0) rotate(var(--rotation)) scale(1);
    opacity: 0.9;
  }
  25% {
    transform: translateY(25vh) translateX(var(--sway)) rotate(calc(var(--rotation) + 90deg)) scale(0.95);
  }
  50% {
    transform: translateY(50vh) translateX(calc(var(--sway) * -0.5)) rotate(calc(var(--rotation) + 180deg)) scale(0.9);
  }
  75% {
    transform: translateY(75vh) translateX(calc(var(--sway) * 0.7)) rotate(calc(var(--rotation) + 270deg)) scale(0.7);
  }
  100% {
    transform: translateY(105vh) translateX(0) rotate(calc(var(--rotation) + 360deg)) scale(0.3);
    opacity: 0;
  }
}
</style>
