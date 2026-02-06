<script setup>
/**
 * NotFoundView — Page affichée quand une demande est introuvable
 */
import SvgIcon from '../components/SvgIcon.vue'
</script>

<template>
  <main class="notfound-page">
    <div class="card animate-scale-in">
      <div class="icon">
        <SvgIcon name="heart-broken" :size="64" color="var(--rose-400)" />
      </div>
      <h2>Demande introuvable</h2>
      <p>
        Ce lien n'existe pas ou a expiré.<br />
        Vérifie le lien ou crée une nouvelle demande !
      </p>
      <router-link to="/" class="btn btn-primary back-btn">
        Créer une Love Request
      </router-link>
    </div>
  </main>
</template>

<style scoped>
.notfound-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) var(--space-md);
}

.icon {
  margin-bottom: var(--space-md);
  animation: float 3s ease-in-out infinite;
}

h2 {
  margin-bottom: var(--space-sm);
}

p {
  margin-bottom: var(--space-xl);
  line-height: 1.7;
}

.back-btn {
  text-decoration: none;
  color: white;
}
</style>
