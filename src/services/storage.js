/**
 * Service de stockage des demandes de Saint-Valentin.
 *
 * En production (Vercel) : appelle l'API serverless → Supabase
 * En dev local : fallback sur localStorage
 */

const API_BASE = '/api'

// Détection : si l'API est disponible (production)
let useApi = null

async function checkApi() {
  if (useApi !== null) return useApi
  try {
    const res = await fetch(`${API_BASE}/stats`, { method: 'GET' })
    useApi = res.ok || res.status === 500 // 500 = API exists but DB not configured
    return useApi
  } catch {
    useApi = false
    return false
  }
}

// ============================================
// LOCALSTORAGE FALLBACK (dev local)
// ============================================
const STORAGE_KEY = 'love_requests'

function localGetAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function localSaveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function generateLocalId() {
  const chars = 'abcdef0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

// ============================================
// API PUBLIQUE (utilisée par les composants)
// ============================================

/**
 * Crée une nouvelle demande. Retourne l'identifiant unique.
 */
export async function createRequest(payload) {
  const hasApi = await checkApi()

  if (hasApi) {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error('Erreur lors de la création de la demande')
    }
    const data = await res.json()
    return data.id
  }

  // Fallback localStorage
  const id = generateLocalId()
  const all = localGetAll()
  all[id] = {
    ...payload,
    createdAt: new Date().toISOString(),
    response: null,
  }
  localSaveAll(all)
  return id
}

/**
 * Récupère une demande par son identifiant.
 */
export async function getRequest(id) {
  const hasApi = await checkApi()

  if (hasApi) {
    const res = await fetch(`${API_BASE}/requests/${id}`)
    if (!res.ok) return null
    return await res.json()
  }

  // Fallback localStorage
  const all = localGetAll()
  return all[id] || null
}

/**
 * Met à jour la réponse d'une demande.
 */
export async function updateResponse(id, answer) {
  const hasApi = await checkApi()

  if (hasApi) {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: answer }),
    })
    return res.ok
  }

  // Fallback localStorage
  const all = localGetAll()
  if (all[id]) {
    all[id].response = answer
    all[id].respondedAt = new Date().toISOString()
    localSaveAll(all)
    return true
  }
  return false
}

/**
 * Récupère les statistiques (uniquement via API).
 */
export async function getStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
