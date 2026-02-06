/**
 * GET  /api/requests/:id — Récupérer une demande
 * PATCH /api/requests/:id — Mettre à jour la réponse (body: { response: 'yes' })
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const supabase = getSupabase()
  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('love_requests')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        return res.status(404).json({ error: 'Demande introuvable' })
      }

      // Transformer snake_case → camelCase pour le frontend
      return res.status(200).json({
        id: data.id,
        senderName: data.sender_name,
        valentineName: data.valentine_name,
        personalMessage: data.personal_message,
        dateInfo: data.date_info,
        note: data.note,
        theme: data.theme,
        response: data.response,
        createdAt: data.created_at,
        respondedAt: data.responded_at,
      })
    } catch (err) {
      console.error('API error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { response } = req.body

      if (!response) {
        return res.status(400).json({ error: 'response est requis' })
      }

      const { error } = await supabase
        .from('love_requests')
        .update({
          response,
          responded_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) {
        console.error('Supabase update error:', error)
        return res.status(500).json({ error: 'Erreur lors de la mise à jour' })
      }

      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('API error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
