/**
 * GET /api/stats — Statistiques des demandes
 * Retourne le nombre total, les réponses, les thèmes populaires, etc.
 */
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  try {
    // Toutes les demandes
    const { data: all, error } = await supabase
      .from('love_requests')
      .select('id, theme, response, created_at, responded_at')

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }

    const total = all.length
    const answered = all.filter(r => r.response !== null).length
    const answeredYes = all.filter(r => r.response === 'yes').length
    const pending = total - answered

    // Thèmes les plus populaires
    const themeCounts = {}
    all.forEach(r => {
      const t = r.theme || 'rose'
      themeCounts[t] = (themeCounts[t] || 0) + 1
    })

    // Tri par popularité
    const themeRanking = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([theme, count]) => ({ theme, count }))

    // Dernières demandes créées (les 10 plus récentes, sans données perso)
    const recent = all
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
      .map(r => ({
        id: r.id,
        theme: r.theme,
        response: r.response,
        createdAt: r.created_at,
        respondedAt: r.responded_at,
      }))

    return res.status(200).json({
      total,
      answered,
      answeredYes,
      pending,
      successRate: total > 0 ? Math.round((answeredYes / Math.max(answered, 1)) * 100) : 0,
      themeRanking,
      recent,
    })
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
