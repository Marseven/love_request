<script setup>
/**
 * ResponseView — Page 2 : la Valentine répond à la demande
 * - Bouton "Oui" fixe et cliquable
 * - Bouton "Non" positionné à côté du Oui au départ, puis fuyant
 * - Célébration quand Oui est cliqué
 */
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getRequest, updateResponse } from '../services/storage.js'
import { getTheme } from '../themes.js'
import SvgIcon from '../components/SvgIcon.vue'
import HeartConfetti from '../components/HeartConfetti.vue'
import PetalRain from '../components/PetalRain.vue'

const route = useRoute()

// États
const request = ref(null)
const loading = ref(true)
const notFound = ref(false)
const answered = ref(false)
const noAttempts = ref(0)
const hasFled = ref(false)

// Thème dynamique
const activeTheme = ref(null)
const themeStyle = computed(() => {
  if (!activeTheme.value) return {}
  return activeTheme.value.vars
})

// Refs des boutons pour mesurer la position initiale
const btnRowRef = ref(null)
const noBtnRef = ref(null)

// Position du bouton "Non" (utilisée seulement après la 1ère fuite)
const noBtn = reactive({ x: 0, y: 0 })

// Messages taquins quand le bouton fuit
const tauntMessages = [
  'Pas si vite !',
  'Tu croyais ?',
  'Essaie encore...',
  'Raté !',
  'Nope !',
  'Presque !',
  'Trop lent(e) !',
  'Il faut dire Oui !',
  'Non non non !',
  'Ce bouton a des ailes !',
  'Abandonne... dis Oui !',
  'Tu ne m\'attraperas pas !',
  'Je suis trop rapide !',
  'Le Oui est juste là...',
]
const currentTaunt = ref('')
const showTaunt = ref(false)
let tauntTimeout = null

// Le bouton Oui grandit à chaque tentative sur Non
const yesBtnScale = computed(() => {
  return 1 + Math.min(noAttempts.value * 0.06, 0.6)
})

/**
 * Déplace le bouton "Non" à une position aléatoire dans le viewport
 */
function fleeButton() {
  const btnWidth = 140
  const btnHeight = 50
  const margin = 20

  const maxX = window.innerWidth - btnWidth - margin
  const maxY = window.innerHeight - btnHeight - margin

  let newX, newY
  let attempts = 0
  do {
    newX = margin + Math.random() * (maxX - margin)
    newY = margin + Math.random() * (maxY - margin)
    attempts++
  } while (
    attempts < 20 &&
    Math.abs(newX - noBtn.x) < 100 &&
    Math.abs(newY - noBtn.y) < 80
  )

  noBtn.x = newX
  noBtn.y = newY
  hasFled.value = true

  noAttempts.value++
  showTauntMessage()
}

function showTauntMessage() {
  if (tauntTimeout) clearTimeout(tauntTimeout)
  currentTaunt.value = tauntMessages[Math.floor(Math.random() * tauntMessages.length)]
  showTaunt.value = true
  tauntTimeout = setTimeout(() => {
    showTaunt.value = false
  }, 1200)
}

function handleNoHover() {
  fleeButton()
}

function handleNoTouch(e) {
  e.preventDefault()
  fleeButton()
}

async function handleYes() {
  answered.value = true
  await updateResponse(route.params.id, 'yes')
}

// Appliquer le thème au body pour le background gradient
watch(activeTheme, (theme) => {
  if (!theme) return
  const el = document.documentElement
  Object.entries(theme.vars).forEach(([key, val]) => {
    el.style.setProperty(key, val)
  })
}, { immediate: false })

// Charger la demande
onMounted(async () => {
  const id = route.params.id
  await new Promise(r => setTimeout(r, 500))

  try {
    const data = await getRequest(id)
    if (!data) {
      loading.value = false
      notFound.value = true
      return
    }

    request.value = data
    activeTheme.value = getTheme(data.theme || 'rose')
    loading.value = false
  } catch {
    loading.value = false
    notFound.value = true
  }
})

onUnmounted(() => {
  if (tauntTimeout) clearTimeout(tauntTimeout)
  // Nettoyer les variables CSS custom du body
  if (activeTheme.value) {
    const el = document.documentElement
    Object.keys(activeTheme.value.vars).forEach((key) => {
      el.style.removeProperty(key)
    })
  }
})
</script>

<template>
  <!-- Loading -->
  <main v-if="loading" class="response-page">
    <div class="loading-state animate-fade-in">
      <div class="heart-loader">
        <SvgIcon name="love-letter" :size="64" color="var(--rose-500)" />
      </div>
      <p>Chargement de ta surprise...</p>
    </div>
  </main>

  <!-- Not Found -->
  <main v-else-if="notFound" class="response-page">
    <div class="card animate-scale-in">
      <div class="icon-large">
        <SvgIcon name="heart-broken" :size="64" color="var(--rose-400)" />
      </div>
      <h2>Demande introuvable</h2>
      <p>Ce lien n'existe pas ou a expiré.</p>
      <router-link to="/" class="btn btn-primary" style="color: white; text-decoration: none;">
        Créer une Love Request
      </router-link>
    </div>
  </main>

  <!-- Réponse "Oui" — Célébration -->
  <main v-else-if="answered" class="response-page celebration" :style="themeStyle">
    <HeartConfetti :colors="activeTheme?.confetti" />
    <PetalRain :colors="activeTheme?.petals" />

    <div class="celebration-content animate-scale-in">
      <div class="celebration-icon">
        <SvgIcon name="joy" :size="72" color="var(--rose-500)" />
      </div>
      <h1 class="celebration-title">C'est un OUI !</h1>

      <div class="divider">
        <span><SvgIcon name="hearts-double" :size="20" color="var(--rose-400)" /></span>
      </div>

      <div class="personal-message animate-fade-in-up delay-2">
        <p class="message-label">Message de {{ request.senderName }} :</p>
        <blockquote class="message-text">
          « {{ request.personalMessage }} »
        </blockquote>
      </div>

      <div v-if="request.dateInfo" class="detail-card animate-fade-in-up delay-3">
        <SvgIcon name="calendar" :size="18" color="var(--rose-600)" />
        <span>{{ request.dateInfo }}</span>
      </div>

      <div v-if="request.note" class="detail-card animate-fade-in-up delay-4">
        <SvgIcon name="sparkle" :size="18" color="var(--gold)" />
        <span>{{ request.note }}</span>
      </div>

      <p class="celebration-footer animate-fade-in delay-5">
        Passez une merveilleuse Saint-Valentin ensemble !
        <SvgIcon name="heart" :size="16" color="var(--rose-500)" />
      </p>

      <div v-if="noAttempts > 0" class="attempt-counter animate-fade-in delay-6">
        <SvgIcon name="thumb-down" :size="14" color="var(--rose-400)" />
        {{ request.valentineName }} a essayé de dire Non {{ noAttempts }} fois
      </div>
    </div>
  </main>

  <!-- Page de réponse principale -->
  <main v-else class="response-page question-page" :style="themeStyle">
    <div class="question-content">
      <!-- Entête personnalisée -->
      <div class="greeting animate-fade-in-up">
        <span class="greeting-heart">
          <SvgIcon name="heart" :size="40" color="var(--rose-500)" />
        </span>
        <h2 class="greeting-name">{{ request.valentineName }},</h2>
      </div>

      <!-- Question -->
      <div class="question-card card animate-fade-in-up delay-2">
        <p class="from-line">De la part de <strong>{{ request.senderName }}</strong></p>
        <div class="divider">
          <span><SvgIcon name="heart-outline" :size="14" color="var(--rose-400)" /></span>
        </div>
        <h1 class="question-text">
          Veux-tu bien être ma Valentine et m'accompagner à un repas cette Saint-Valentin ?
        </h1>
      </div>

      <!-- Boutons Oui et Non côte à côte -->
      <div ref="btnRowRef" class="btn-row animate-fade-in-up delay-4">
        <button
          class="btn btn-success yes-btn"
          :style="{ transform: `scale(${yesBtnScale})` }"
          @click="handleYes"
        >
          <SvgIcon name="heart" :size="20" color="white" />
          Oui !
        </button>

        <!-- Non : en position statique dans le flow au départ -->
        <button
          v-if="!hasFled"
          class="btn btn-danger no-btn"
          @mouseenter="handleNoHover"
          @touchstart.passive="handleNoTouch"
          @click.prevent="fleeButton"
        >
          Non
          <SvgIcon name="thumb-down" :size="16" color="white" />
        </button>
      </div>

      <!-- Non : en position fixe après la 1ère fuite -->
      <button
        v-if="hasFled"
        ref="noBtnRef"
        class="btn btn-danger no-btn no-btn-fled"
        :style="{
          left: noBtn.x + 'px',
          top: noBtn.y + 'px',
        }"
        @mouseenter="handleNoHover"
        @touchstart.passive="handleNoTouch"
        @click.prevent="fleeButton"
      >
        Non
        <SvgIcon name="thumb-down" :size="16" color="white" />
      </button>

      <!-- Message taquin -->
      <transition name="taunt">
        <div v-if="showTaunt" class="taunt-bubble">
          {{ currentTaunt }}
        </div>
      </transition>

      <!-- Compteur de tentatives -->
      <div v-if="noAttempts > 0" class="attempts-display animate-fade-in">
        <SvgIcon name="sparkle" :size="14" color="var(--rose-500)" />
        Tentatives de fuite du Non : <strong>{{ noAttempts }}</strong>
      </div>
    </div>
  </main>
</template>

<style scoped>
.response-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) var(--space-md);
}

/* Loading */
.loading-state {
  text-align: center;
}

.heart-loader {
  animation: heartbeat 1.2s ease-in-out infinite;
}

.loading-state p {
  margin-top: var(--space-md);
  font-style: italic;
  color: var(--rose-500);
}

/* Not found */
.icon-large {
  margin-bottom: var(--space-md);
}

/* Question Page */
.question-page {
  flex-direction: column;
  gap: var(--space-lg);
}

.question-content {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.greeting {
  text-align: center;
}

.greeting-heart {
  display: block;
  margin-bottom: var(--space-xs);
  animation: heartbeat 2s ease-in-out infinite;
}

.greeting-name {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-style: italic;
  background: linear-gradient(135deg, var(--rose-700), var(--rose-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.question-card {
  text-align: center;
  animation: pulse-glow 4s ease-in-out infinite;
}

.from-line {
  font-size: 0.95rem;
  color: var(--rose-500);
  font-style: italic;
}

.question-text {
  font-size: clamp(1.3rem, 3.5vw, 1.8rem);
  font-style: italic;
  line-height: 1.4;
  color: var(--rose-800);
}

/* Ligne de boutons Oui / Non côte à côte */
.btn-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

/* Bouton Oui */
.yes-btn {
  font-size: 1.4rem;
  padding: 0.9em 2.8em;
  transition: all 0.4s var(--ease-out-back);
  animation: pulse-glow 2.5s ease-in-out infinite;
  background: linear-gradient(135deg, var(--rose-500), var(--rose-700)) !important;
  box-shadow: 0 4px 25px rgba(244, 63, 94, 0.4) !important;
}

.yes-btn:hover {
  transform: scale(1.12) !important;
  box-shadow: 0 8px 40px rgba(244, 63, 94, 0.55) !important;
}

/* Bouton Non (fuyant) */
.no-btn {
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.no-btn-fled {
  position: fixed;
  z-index: 60;
  transition: left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Bulle taquine */
.taunt-bubble {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.6em 1.4em;
  border-radius: 20px;
  font-family: var(--font-accent);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--rose-600);
  box-shadow: 0 4px 20px rgba(244, 63, 94, 0.2);
  z-index: 70;
  pointer-events: none;
}

.taunt-enter-active {
  transition: all 0.3s var(--ease-out-back);
}
.taunt-leave-active {
  transition: all 0.25s ease-in;
}
.taunt-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.7);
}
.taunt-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) translateY(-10px);
}

/* Compteur de tentatives */
.attempts-display {
  text-align: center;
  font-size: 0.9rem;
  color: var(--rose-500);
  padding: 0.5em 1.2em;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.4em;
}

/* ============================================
   CÉLÉBRATION
   ============================================ */
.celebration {
  background: linear-gradient(
    135deg,
    rgba(255, 241, 242, 0.9),
    rgba(254, 205, 211, 0.7),
    rgba(255, 241, 242, 0.9)
  );
}

.celebration-content {
  text-align: center;
  max-width: 520px;
  width: 100%;
  z-index: 10;
  position: relative;
}

.celebration-icon {
  margin-bottom: var(--space-md);
  animation: heartbeat 1.5s ease-in-out infinite;
}

.celebration-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-style: italic;
  background: linear-gradient(135deg, var(--rose-600), var(--rose-500), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
  background-size: 200% auto;
}

.personal-message {
  margin: var(--space-lg) 0;
}

.message-label {
  font-size: 0.9rem;
  color: var(--rose-500);
  margin-bottom: var(--space-sm);
  font-style: italic;
}

.message-text {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-style: italic;
  color: var(--rose-800);
  line-height: 1.6;
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border-left: 4px solid var(--rose-400);
  margin: 0;
}

.detail-card {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 0.7em 1.4em;
  border-radius: 14px;
  font-family: var(--font-accent);
  font-size: 1rem;
  color: var(--noir-soft);
  margin-top: var(--space-sm);
  border: 1px solid rgba(254, 205, 211, 0.5);
}

.celebration-footer {
  margin-top: var(--space-xl);
  font-family: var(--font-accent);
  font-size: 1.1rem;
  color: var(--rose-600);
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
}

.attempt-counter {
  margin-top: var(--space-md);
  font-size: 0.88rem;
  color: var(--rose-400);
  background: rgba(255, 255, 255, 0.5);
  padding: 0.4em 1em;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
}

@media (max-width: 640px) {
  .response-page {
    padding: var(--space-lg) var(--space-sm);
  }

  .question-page {
    align-items: flex-start;
    padding-top: var(--space-lg);
  }

  .question-content {
    gap: var(--space-md);
  }

  .greeting-heart :deep(.svg-icon) {
    width: 32px;
    height: 32px;
  }

  .question-text {
    font-size: 1.15rem;
    line-height: 1.5;
  }

  .btn-row {
    gap: var(--space-md);
    width: 100%;
  }

  .yes-btn {
    font-size: 1.2rem;
    padding: 0.8em 2em;
    flex: 1;
  }

  .no-btn {
    min-height: 48px;
    min-width: 100px;
  }

  .no-btn-fled {
    min-height: 44px;
    min-width: 90px;
  }

  .taunt-bubble {
    font-size: 0.95rem;
    padding: 0.5em 1em;
    max-width: 80vw;
    text-align: center;
  }

  .attempts-display {
    font-size: 0.82rem;
  }

  /* Célébration mobile */
  .celebration-icon :deep(.svg-icon) {
    width: 52px;
    height: 52px;
  }

  .celebration-title {
    font-size: clamp(2rem, 5vw, 3rem);
  }

  .message-text {
    font-size: 1.1rem;
    padding: var(--space-md);
  }

  .detail-card {
    font-size: 0.9rem;
    padding: 0.5em 1em;
  }

  .celebration-footer {
    font-size: 0.95rem;
    flex-wrap: wrap;
  }
}

@media (max-width: 380px) {
  .yes-btn {
    font-size: 1.05rem;
    padding: 0.7em 1.5em;
  }

  .question-card {
    padding: var(--space-md);
  }
}
</style>
