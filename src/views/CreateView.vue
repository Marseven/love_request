<script setup>
/**
 * CreateView — Page 1 : le Valentin crée sa demande
 * Formulaire élégant avec génération de lien unique
 */
import { ref, computed } from 'vue'
import { createRequest } from '../services/storage.js'
import { themeList } from '../themes.js'
import SvgIcon from '../components/SvgIcon.vue'
import PetalRain from '../components/PetalRain.vue'

const senderName = ref('')
const valentineName = ref('')
const personalMessage = ref('')
const dateInfo = ref('')
const note = ref('')
const selectedTheme = ref('rose')

const generatedLink = ref(null)
const copied = ref(false)
const isSubmitting = ref(false)
const showPetals = ref(true)

const isFormValid = computed(() => {
  return senderName.value.trim() && valentineName.value.trim() && personalMessage.value.trim()
})

const submitError = ref(false)

async function handleSubmit() {
  if (!isFormValid.value) return
  isSubmitting.value = true
  submitError.value = false

  try {
    const id = await createRequest({
      senderName: senderName.value.trim(),
      valentineName: valentineName.value.trim(),
      personalMessage: personalMessage.value.trim(),
      dateInfo: dateInfo.value.trim(),
      note: note.value.trim(),
      theme: selectedTheme.value,
    })

    generatedLink.value = `${window.location.origin}/d/${id}`
  } catch {
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}

function copyLink() {
  if (!generatedLink.value) return
  navigator.clipboard.writeText(generatedLink.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  })
}

// Texte de partage
const shareText = computed(() => {
  if (!valentineName.value) return ''
  return `${valentineName.value}, j'ai quelque chose à te demander... Ouvre ce lien !`
})

// URLs de partage par plateforme
const shareUrls = computed(() => {
  if (!generatedLink.value) return {}
  const text = encodeURIComponent(shareText.value)
  const url = encodeURIComponent(generatedLink.value)
  const full = encodeURIComponent(`${shareText.value} ${generatedLink.value}`)
  return {
    whatsapp: `https://wa.me/?text=${full}`,
    sms: `sms:?&body=${full}`,
    messenger: `fb-messenger://share/?link=${url}`,
    x: `https://x.com/intent/tweet?text=${text}&url=${url}`,
    snapchat: `https://www.snapchat.com/scan?attachmentUrl=${url}`,
  }
})

// Web Share API natif (fonctionne sur mobile)
const canNativeShare = ref(false)
if (typeof navigator !== 'undefined' && navigator.share) {
  canNativeShare.value = true
}

async function nativeShare() {
  if (!generatedLink.value) return
  try {
    await navigator.share({
      title: 'Love Request',
      text: shareText.value,
      url: generatedLink.value,
    })
  } catch {
    // L'utilisateur a annulé, rien à faire
  }
}

function reset() {
  senderName.value = ''
  valentineName.value = ''
  personalMessage.value = ''
  dateInfo.value = ''
  note.value = ''
  generatedLink.value = null
  copied.value = false
  selectedTheme.value = 'rose'
}
</script>

<template>
  <main class="create-page">
    <!-- Pluie de pétales en arrière-plan -->
    <PetalRain v-if="showPetals" />

    <div class="page-content">
      <!-- Header -->
      <header class="hero animate-fade-in-up">
        <div class="hero-icon">
          <SvgIcon name="love-letter" :size="56" color="var(--rose-500)" />
        </div>
        <h1>Love Request</h1>
        <p class="subtitle">
          Crée ta demande de Saint-Valentin<br />et partage-la avec ton/ta Valentine
        </p>
      </header>

      <!-- Formulaire -->
      <section v-if="!generatedLink" class="card animate-fade-in-up delay-2">
        <form @submit.prevent="handleSubmit">
          <div class="form-group animate-fade-in-up delay-3">
            <label for="sender">Ton prénom (ou pseudo)</label>
            <input
              id="sender"
              v-model="senderName"
              type="text"
              placeholder="Ex : Roméo"
              maxlength="50"
              required
            />
          </div>

          <div class="form-group animate-fade-in-up delay-4">
            <label for="valentine">Prénom de ta Valentine</label>
            <input
              id="valentine"
              v-model="valentineName"
              type="text"
              placeholder="Ex : Juliette"
              maxlength="50"
              required
            />
          </div>

          <div class="form-group animate-fade-in-up delay-5">
            <label for="message">Ton message personnalisé</label>
            <textarea
              id="message"
              v-model="personalMessage"
              placeholder="Ce message s'affichera quand elle dira Oui... Fais-le romantique !"
              maxlength="500"
              required
            ></textarea>
            <span class="char-count">{{ personalMessage.length }}/500</span>
          </div>

          <div class="divider animate-fade-in delay-5">
            <span><SvgIcon name="heart-outline" :size="16" color="var(--rose-400)" /></span>
          </div>

          <!-- Sélecteur de thème couleur -->
          <div class="form-group animate-fade-in-up delay-5">
            <label>
              <SvgIcon name="flower" :size="16" color="var(--rose-600)" />
              Couleur de la page
            </label>
            <div class="theme-picker">
              <button
                v-for="t in themeList"
                :key="t.id"
                type="button"
                class="theme-swatch"
                :class="{ active: selectedTheme === t.id }"
                :style="{
                  '--swatch-color': t.preview,
                  '--swatch-light': t.previewLight,
                }"
                :title="t.label"
                @click="selectedTheme = t.id"
              >
                <span class="swatch-inner"></span>
                <span class="swatch-check" v-if="selectedTheme === t.id">
                  <SvgIcon name="check" :size="14" color="white" />
                </span>
              </button>
            </div>
            <span class="theme-label">{{ themeList.find(t => t.id === selectedTheme)?.label }}</span>
          </div>

          <div class="form-group animate-fade-in-up delay-6">
            <label for="date">
              <SvgIcon name="calendar" :size="16" color="var(--rose-600)" />
              Date & lieu du repas <span class="optional">— optionnel</span>
            </label>
            <input
              id="date"
              v-model="dateInfo"
              type="text"
              placeholder="Ex : Le 14 février, 20h, Chez Luigi"
              maxlength="100"
            />
          </div>

          <div class="form-group animate-fade-in-up delay-6">
            <label for="note">
              <SvgIcon name="sparkle" :size="16" color="var(--rose-600)" />
              Petite note romantique <span class="optional">— optionnel</span>
            </label>
            <input
              id="note"
              v-model="note"
              type="text"
              placeholder="Ex : Mets ta plus belle robe"
              maxlength="150"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary submit-btn animate-fade-in-up delay-7"
            :class="{ 'is-loading': isSubmitting }"
            :disabled="!isFormValid || isSubmitting"
          >
            <span v-if="!isSubmitting">
              Générer ma Love Request
              <SvgIcon name="heart-arrow" :size="20" color="white" />
            </span>
            <span v-else class="loader">Création en cours...</span>
          </button>

          <p v-if="submitError" class="error-msg">
            Une erreur est survenue. Réessaie !
          </p>
        </form>
      </section>

      <!-- Résultat : lien généré -->
      <section v-else class="card result-card animate-scale-in">
        <div class="success-icon">
          <SvgIcon name="celebrate" :size="56" color="var(--rose-500)" />
        </div>
        <h2>Ta Love Request est prête !</h2>
        <p class="result-desc">
          Envoie-la à <strong>{{ valentineName }}</strong> !
        </p>

        <!-- Bouton partage natif (prioritaire sur mobile) -->
        <button
          v-if="canNativeShare"
          class="btn btn-primary share-native-btn animate-fade-in-up delay-1"
          @click="nativeShare"
        >
          <SvgIcon name="share" :size="20" color="white" />
          Partager
        </button>

        <!-- Grille de boutons de partage rapide -->
        <div class="share-grid animate-fade-in-up delay-2">
          <a
            :href="shareUrls.whatsapp"
            target="_blank"
            rel="noopener"
            class="share-btn share-whatsapp"
          >
            <SvgIcon name="whatsapp" :size="22" color="white" />
            <span>WhatsApp</span>
          </a>

          <a
            :href="shareUrls.sms"
            class="share-btn share-sms"
          >
            <SvgIcon name="sms" :size="22" color="white" />
            <span>Messages</span>
          </a>

          <a
            :href="shareUrls.messenger"
            target="_blank"
            rel="noopener"
            class="share-btn share-messenger"
          >
            <SvgIcon name="messenger" :size="22" color="white" />
            <span>Messenger</span>
          </a>

          <a
            :href="shareUrls.x"
            target="_blank"
            rel="noopener"
            class="share-btn share-x"
          >
            <SvgIcon name="x" :size="20" color="white" />
            <span>X</span>
          </a>

          <a
            :href="shareUrls.snapchat"
            target="_blank"
            rel="noopener"
            class="share-btn share-snap"
          >
            <SvgIcon name="snapchat" :size="22" color="white" />
            <span>Snap</span>
          </a>

          <button
            class="share-btn share-copy"
            @click="copyLink"
          >
            <SvgIcon name="clipboard" :size="20" :color="copied ? '#059669' : 'white'" />
            <span>{{ copied ? 'Copié !' : 'Copier' }}</span>
          </button>
        </div>

        <!-- Lien en clair (repliable) -->
        <div class="link-box animate-fade-in delay-3">
          <code class="link-text">{{ generatedLink }}</code>
        </div>

        <div class="divider">
          <span><SvgIcon name="heart-outline" :size="16" color="var(--rose-400)" /></span>
        </div>

        <button class="btn btn-secondary" @click="reset">
          Créer une autre demande
        </button>
      </section>

      <!-- Footer -->
      <footer class="footer animate-fade-in delay-7">
        <p>
          Fait avec
          <SvgIcon name="heart" :size="14" color="var(--rose-500)" />
          par Codeur X pour la Saint-Valentin
        </p>
        <p class="footer-copyright">Tous Droits Réservés - 2026</p>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.create-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) var(--space-md);
}

.page-content {
  width: 100%;
  max-width: 540px;
  position: relative;
  z-index: 2;
}

/* Hero */
.hero {
  margin-bottom: var(--space-xl);
}

.hero-icon {
  margin-bottom: var(--space-sm);
  animation: float 3s ease-in-out infinite;
}

.hero h1 {
  font-style: italic;
  background: linear-gradient(135deg, var(--rose-700), var(--rose-500), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-sm);
}

.subtitle {
  font-family: var(--font-accent);
  font-size: 1.1rem;
  color: var(--rose-600);
  font-style: italic;
  line-height: 1.6;
}

/* Formulaire */
form {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.35em;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.78rem;
  color: var(--rose-400);
  margin-top: var(--space-xs);
  font-family: var(--font-body);
}

.submit-btn {
  margin-top: var(--space-md);
  width: 100%;
  font-size: 1.1rem;
  padding: 1em 2em;
  animation: pulse-glow 3s ease-in-out infinite;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  animation: none;
}

.submit-btn.is-loading {
  pointer-events: none;
  opacity: 0.7;
}

.loader {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}

.loader::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-msg {
  text-align: center;
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: var(--space-sm);
  font-style: italic;
}

/* Theme picker */
.theme-picker {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: var(--space-xs);
}

.theme-swatch {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 3px solid transparent;
  background: var(--swatch-light);
  cursor: pointer;
  padding: 0;
  transition: all 0.3s var(--ease-out-back);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-swatch:hover {
  transform: scale(1.15);
  border-color: var(--swatch-color);
}

.theme-swatch.active {
  border-color: var(--swatch-color);
  box-shadow: 0 0 0 3px rgba(0,0,0,0.05), 0 2px 12px color-mix(in srgb, var(--swatch-color) 40%, transparent);
  transform: scale(1.1);
}

.swatch-inner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--swatch-color);
  display: block;
}

.swatch-check {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--swatch-color);
  border-radius: 50%;
  animation: scaleIn 0.25s var(--ease-out-back);
}

.theme-label {
  display: block;
  font-size: 0.82rem;
  color: var(--rose-500);
  margin-top: 0.35rem;
  font-style: italic;
  font-family: var(--font-accent);
}

/* Résultat */
.result-card {
  text-align: center;
}

.success-icon {
  margin-bottom: var(--space-sm);
  animation: heartbeat 1.5s ease-in-out infinite;
}

.result-card h2 {
  margin-bottom: var(--space-sm);
}

.result-desc {
  margin-bottom: var(--space-lg);
}

/* Bouton partage natif */
.share-native-btn {
  width: 100%;
  font-size: 1.15rem;
  padding: 0.9em 2em;
  margin-bottom: var(--space-md);
  animation: pulse-glow 3s ease-in-out infinite;
}

/* Grille de partage rapide */
.share-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  margin-bottom: var(--space-lg);
  width: 100%;
}

.share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.75em 0.5em;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-family: var(--font-accent);
  font-size: 0.78rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s var(--ease-out-expo);
  min-height: 64px;
}

.share-btn:hover {
  transform: translateY(-2px) scale(1.04);
  filter: brightness(1.1);
}

.share-btn:active {
  transform: scale(0.96);
}

.share-whatsapp { background: #25D366; }
.share-sms { background: linear-gradient(135deg, #34C759, #30B350); }
.share-messenger { background: linear-gradient(135deg, #00B2FF, #006AFF); }
.share-x { background: #000000; }
.share-snap { background: #FFFC00; color: #000; }
.share-snap span { color: #000; }
.share-copy {
  background: var(--rose-600);
}

.link-box {
  width: 100%;
  background: var(--rose-50);
  border: 1px solid var(--rose-200);
  border-radius: 12px;
  padding: var(--space-sm);
  margin-bottom: var(--space-md);
}

.link-text {
  display: block;
  padding: 0.4em 0.6em;
  font-size: 0.75rem;
  color: var(--rose-600);
  word-break: break-all;
  font-family: 'SF Mono', 'Fira Code', monospace;
  text-align: center;
  line-height: 1.5;
}

/* Footer */
.footer {
  margin-top: var(--space-xl);
  padding-top: var(--space-md);
}

.footer p {
  font-size: 0.85rem;
  color: var(--rose-400);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3em;
}

.footer-copyright {
  font-size: 0.75rem !important;
  margin-top: 0.25em;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .create-page {
    padding: var(--space-lg) var(--space-sm);
    align-items: flex-start;
    padding-top: var(--space-xl);
  }

  .hero-icon :deep(.svg-icon) {
    width: 40px;
    height: 40px;
  }

  .submit-btn {
    font-size: 1rem;
    padding: 0.9em 1.5em;
  }

  .share-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .share-btn {
    padding: 0.65em 0.4em;
    font-size: 0.72rem;
    border-radius: 12px;
    min-height: 58px;
  }

  .link-text {
    font-size: 0.7rem;
  }

  .result-desc {
    font-size: 0.95rem;
  }
}

@media (max-width: 380px) {
  .hero-icon :deep(.svg-icon) {
    width: 32px;
    height: 32px;
  }
}
</style>
